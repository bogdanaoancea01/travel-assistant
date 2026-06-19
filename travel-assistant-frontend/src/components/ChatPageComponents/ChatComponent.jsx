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
  const [thinkingSteps, setThinkingSteps] = useState([]);
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

  // Streams the /generatetrip Server-Sent Events response.
  // onStatus(label) is called for every "status" frame while the trip is being built;
  // the promise resolves with the final trip object from the "result" frame.
  const callBackendChat = async (chatMessages, onStatus) => {
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

    if (!response.ok || !response.body) {
      const text = await response.text().catch(() => "");
      throw new Error(text || "Server error");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let result = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      let sep;
      while ((sep = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);

        let eventName = "message";
        const dataLines = [];
        for (const line of frame.split("\n")) {
          if (line.startsWith("event:")) eventName = line.slice(6).trim();
          else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
        }
        if (dataLines.length === 0) continue;

        const payload = JSON.parse(dataLines.join("\n"));

        if (eventName === "status") {
          onStatus?.(payload);
        } else if (eventName === "result") {
          result = payload;
        } else if (eventName === "error") {
          throw new Error(payload.error || "Server error");
        }
      }
    }

    if (!result) throw new Error("No data received from the server.");
    return result;
  };

  const handleSendMessage = async (overrideText) => {
    const textToSend = overrideText || inputQuestion;
    if (!textToSend.trim() || isTyping) return;

    const userMessage = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputQuestion("");
    setIsTyping(true);
    setThinkingSteps([]);

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
      const aiReply = await callBackendChat(updatedMessages, (update) =>
        setThinkingSteps((prev) => {
          const step = {
            stage: update.stage,
            label: update.label || "",
          };
          const last = prev[prev.length - 1];
          if (last && last.stage === step.stage) {
            return [...prev.slice(0, -1), step];
          }
          return [...prev, step];
        })
      );
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
              placeName: a.placeName,
              city: a.city,
              country: a.country,
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
      setThinkingSteps([]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <ChatHeader chatId={currentChatId} />
      <ConversationArea
        messages={messages}
        isTyping={isTyping || isLoadingHistory}
        thinkingSteps={thinkingSteps}
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