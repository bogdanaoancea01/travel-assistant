import { useEffect, useRef } from "react";
import GlobeLogo from "../GlobeLogo";
import { useAuth } from "../../AuthContext";

export default function ConversationArea({ messages, isTyping }) {
  const bottomRef = useRef(null);
  const { user } = useAuth();
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-2xl mx-auto space-y-5">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {msg.role === "assistant" ? (
              <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 mr-2.5 mt-0.5">
                <GlobeLogo size={16} />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0 text-white text-xs font-semibold">
                {initials}
              </div>
            )}

            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gray-900 text-white rounded-br-sm"
                  : "bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 mr-2.5 mt-0.5">
                <GlobeLogo size={16} />
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}