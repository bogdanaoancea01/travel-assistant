import { useState, useEffect, useRef } from "react";
import ConversationArea from "../ChatAreaComponents/ConverstaionArea";
import ChatInput from "../ChatAreaComponents/ChatInput";
import ChatHeader from "../ChatAreaComponents/ChatHeader";
import { useChatHistory } from "../../utilities/useChatHistory";

const DEFAULT_MESSAGES = [
  {
    role: "assistant",
    content: "Hey there, I'm here to assist you in planning your experience. Ask me anything travel related.",
  },
];

export default function ChatComponent({ pendingPrompt, pendingChatTitle, onPendingPromptConsumed, onTripGenerated, onChatCreated, initialChatId }) {
  const [inputQuestion, setInputQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(!!initialChatId);
  const [currentChatId, setCurrentChatId] = useState(initialChatId ?? null);
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);

  const fromCardClick = useRef(false);
  const pendingTitleRef = useRef(null);
  const { createChat, saveUserMessage, saveAssistantResponse, loadChat } = useChatHistory();

  useEffect(() => {
    if (!initialChatId) {
      setMessages(DEFAULT_MESSAGES);
      setIsLoadingHistory(false);
      return;
    }

    setIsLoadingHistory(true);
    loadChat(initialChatId)
      .then((data) => {
        const userMsgs = (data?.userMessages ?? []).map((m) => ({
          role: "user",
          content: m.content,
          createdAt: m.createdAt,
        }));

        const assistantMsgs = (data?.assistantResponses ?? []).map((m) => {
          let content = "";
          let aiReply = null;
          try {
            aiReply = JSON.parse(m.jsonContent);
            content = aiReply?.tripDetails?.summary ?? aiReply?.assistantMessage ?? "";
          } catch {
            content = m.jsonContent ?? "";
          }
          return { role: "assistant", content, aiReply, createdAt: m.createdAt };
        });

        const merged = [...userMsgs, ...assistantMsgs].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        setMessages(merged.length > 0 ? merged : DEFAULT_MESSAGES);
      })
      .catch((err) => {
        console.error("Failed to load chat:", err);
        setMessages(DEFAULT_MESSAGES);
      })
      .finally(() => setIsLoadingHistory(false));
  }, [initialChatId]);

  useEffect(() => {
    sessionStorage.setItem("currentMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (currentChatId) {
      sessionStorage.setItem("currentChatId", String(currentChatId));
    } else {
      sessionStorage.removeItem("currentChatId");
    }
  }, [currentChatId]);

  useEffect(() => {
    if (!pendingPrompt) return;
    fromCardClick.current = true;
    pendingTitleRef.current = pendingChatTitle; 
    setInputQuestion(pendingPrompt);
    onPendingPromptConsumed();
  }, [pendingPrompt]);

  useEffect(() => {
  if (!inputQuestion || isTyping || isLoadingHistory || !fromCardClick.current) return;
    fromCardClick.current = false;
    handleSendMessage(inputQuestion);
  }, [inputQuestion, isLoadingHistory]);

  const handleOnInputChange = (event) => setInputQuestion(event.target.value);

  const callBackendChat = async (chatMessages) => {
    const response = await fetch("https://localhost:7063/generatetrip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
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

    return await response.json();
  };

  const handleSendMessage = async (overrideText) => {
    const textToSend = overrideText || inputQuestion;
    if (!textToSend.trim() || isTyping) return;

    const userMessage = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputQuestion("");
    setIsTyping(true);

    let chatId = currentChatId;
    if (!chatId) {
      const chat = await createChat(pendingTitleRef.current ?? "New Chat");
      pendingTitleRef.current = null;
      chatId = chat?.id;
      setCurrentChatId(chatId);
      onChatCreated?.();
    }

    await saveUserMessage(chatId, textToSend);

    try {
      const aiReply = await callBackendChat(updatedMessages);
      if (!aiReply) throw new Error("No data received from the server.");

      await saveAssistantResponse(chatId, aiReply);

      if (aiReply.isPlanComplete) {
        const trip = aiReply.tripDetails;
        const tripDays = trip.itinerary ?? [];

        onTripGenerated({
          destination: `${trip.destination.city}, ${trip.destination.country}`,
          pins: tripDays.flatMap((day) =>
            (day.activities ?? []).map((a) => ({
              name: a.name,
              lat: a.lat,
              lng: a.lng,
              day: day.dayNumber,
              description: a.description,
              estimatedDuration: a.estimatedDuration,
              address: a.address,
              isWeatherDependent: a.isWeatherDependent ?? false,
            }))
          ),
        });

        setMessages((prev) => [...prev, { role: "assistant", content: trip.summary, aiReply }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: aiReply.assistantMessage, aiReply: null }]);
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
      <ChatHeader chatId={currentChatId} />
      <ConversationArea
        messages={messages}
        isTyping={isTyping || isLoadingHistory}
        onRefine={(text) => handleSendMessage(text)}
      />
      <ChatInput
        inputQuestion={inputQuestion}
        onInputChange={handleOnInputChange}
        onSendMessage={() => handleSendMessage()}
        disabled={isLoadingHistory}
      />
    </div>
  );
}