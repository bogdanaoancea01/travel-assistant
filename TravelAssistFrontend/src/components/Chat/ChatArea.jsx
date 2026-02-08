import { useState, useEffect, useRef } from "react";
import { ChevronDown, Mic, Send, Sparkles } from "lucide-react";

export function ChatArea() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      type: "assistant",
      content:
        "Hey there, I'm here to assist you in planning your experience. Ask me anything travel related.",
    },
  ]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

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

    //const data = await response.json();
    //return data.reply;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { type: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
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
      {/* Top navigation bar */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
        {/* New chat button with dropdown */}
        <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg transition-colors">
          <span className="text-base font-medium">New chat</span>
          <ChevronDown className="size-4 text-gray-500" />
        </button>

        {/* Create a trip button */}
        <button className="hidden md:flex items-center gap-2 hover:bg-gray-50 rounded-lg transition-colors">
          <Sparkles className="size-4" />
          <span className="text-base font-medium">Create a trip</span>
        </button>
      </div>

      {/* Main chat content area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.type === "user"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-500 rounded-2xl px-4 py-2 text-sm">
                Thinking…
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area at bottom */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          {/* Input container with rounded border */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <div className="relative flex items-end gap-2 p-1 border border-gray-300 rounded-2xl bg-white focus-within:border-gray-400 transition-colors">
              {/* Text input */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything"
                className="flex-1 px-4 py-2.5 bg-transparent border-none outline-none text-sm"
              />

              {/* Send button */}
              <div className="flex items-center gap-1 pr-1">
                <button
                  type="submit"
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Send className="size-5 text-gray-500" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
