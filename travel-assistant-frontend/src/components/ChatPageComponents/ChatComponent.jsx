import { useState, useEffect } from "react";
import ConversationArea from "../ChatAreaComponents/ConverstaionArea";
import ChatInput from "../ChatAreaComponents/ChatInput";

export default function ChatComponent({ pendingPrompt, onPendingPromptConsumed, onTripGenerated }) {
  const [inputQuestion, setInputQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey there, I'm here to assist you in planning your experience. Ask me anything travel related.",
    },
  ]);

  // When a destination card is clicked in RecommendationsPanel,
  // pendingPrompt is set in ChatPage. We consume it here by
  // populating the input and auto-sending.
  useEffect(() => {
    if (!pendingPrompt) return;
    setInputQuestion(pendingPrompt);
    onPendingPromptConsumed();
  }, [pendingPrompt]);

  // Auto-send once inputQuestion is set from a pending prompt
  useEffect(() => {
    if (!inputQuestion || isTyping) return;
    // Only auto-send if it came from a card click (not manual typing)
    // We track this with a flag set during the pendingPrompt effect
    if (inputQuestion === pendingPrompt) return; // guard against double-send
    handleSendMessage();
  }, [inputQuestion]);

  const handleOnInputChange = (event) => {
    setInputQuestion(event.target.value);
  };

  const callBackendChat = async (chatMessages) => {
    const response = await fetch("https://localhost:7063/generatetrip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: chatMessages.map((m) => ({
          role: m.role || "user",
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Server error");
    }

    const data = await response.json();
    console.log("Debug: Received data:", data);
    return data;
  };

  const handleSendMessage = async (overrideText) => {
    const textToSend = overrideText || inputQuestion;
    if (!textToSend.trim() || isTyping) return;

    const userMessage = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputQuestion("");
    setIsTyping(true);

    try {
      const aiReply = await callBackendChat(updatedMessages);

      if (!aiReply) throw new Error("No data received from the server.");

      if (aiReply.isPlanComplete) {
        const trip = aiReply.tripDetails;

        // Build activeTrip for the map panel using geocoded coordinates
        onTripGenerated({
          destination: trip.destination,
          dateRange: `${trip.days?.length ?? ""} days · ${trip.startDate ?? ""} – ${trip.endDate ?? ""}`,
          pins: trip.days
            ?.flatMap((day) => day.activities ?? [])
            .map((a) => ({ name: a.name, lat: a.lat, lng: a.lng })) ?? [],
        });

        setMessages((prev) => [...prev, { role: "assistant", content: trip.summary }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: aiReply.assistantMessage }]);
        onTripGenerated(null);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong! Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <ConversationArea messages={messages} isTyping={isTyping} />
      <ChatInput
        inputQuestion={inputQuestion}
        onInputChange={handleOnInputChange}
        onSendMessage={() => handleSendMessage()}
      />
    </div>
  );
}