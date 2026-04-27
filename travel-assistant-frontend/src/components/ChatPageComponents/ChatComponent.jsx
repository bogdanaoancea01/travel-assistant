import { useState } from "react";
import ConversationArea from "../ChatAreaComponents//ConverstaionArea";
import ChatInput from "../ChatAreaComponents//ChatInput";
import ChatHeader from "../ChatAreaComponents/ChatHeader";

export default function ChatComponent() {
  const [inputQuestion, setInputQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey there, I'm here to assist you in planning your experience. Ask me anything travel related.",
    },
  ]);

  const handleOnInputChange = (event) => {
    setInputQuestion(event.target.value);
  };

  const callBackendChat = async (chatMessages) => {
    const response = await fetch("https://localhost:7063/generatetrip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    const data = await response.json(); 
    console.log("Debug: Received data:", data); 
    return data;
  };

  const handleSendMessage = async () => {
    if (!inputQuestion.trim() || isTyping) return;

    const userMessage = { role: "user", content: inputQuestion };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputQuestion("");
    setIsTyping(true);

    try {
      const aiReply = await callBackendChat(updatedMessages);

      if (!aiReply) {
        throw new Error("No data received from the server.");
      }

      if (aiReply.isPlanComplete) {
        setTripDetails(aiReply.tripDetails);
        
        setMessages(prev => [...prev, { role: "assistant", content: aiReply.tripDetails.summary }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: aiReply.assistantMessage }]);

        setTripDetails(null); 
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong! Please try again.",
        },
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
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
