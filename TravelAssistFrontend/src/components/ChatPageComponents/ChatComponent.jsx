import { useState } from "react";
import ConversationArea from "../ChatAreaComponents//ConverstaionArea";
import ChatInput from "../ChatAreaComponents//ChatInput";
import ChatHeader from "../ChatAreaComponents/ChatHeader";

export default function ChatComponent() {
  const [inputQuestion, setInputQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "assistant",
      content:
        "Hey there, I'm here to assist you in planning your experience. Ask me anything travel related.",
    },
  ]);

  const handleOnInputChange = (event) => {
    setInputQuestion(event.target.value);
  };

  const callBackendChat = async (chatMessages) => {
    const response = await fetch("https://localhost:7237/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: chatMessages.map((m) => ({
          role: m.type,
          content: m.content,
        })),
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("Backend error:", text);
      throw new Error(text);
    }

    return JSON.parse(text).reply;
  };

  const handleSendMessage = async () => {
    if (!inputQuestion.trim() || isTyping) return;

    const userMessage = { type: "user", content: inputQuestion };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputQuestion("");
    setIsTyping(true);

    try {
      const aiReply = await callBackendChat(updatedMessages);

      setMessages((prev) => [...prev, { type: "assistant", content: aiReply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "Sorry, something went wrong! Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <ChatHeader />
      <ConversationArea messages={messages} isTyping={isTyping} />
      <ChatInput
        inputQuestion={inputQuestion}
        onInputChange={handleOnInputChange}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
