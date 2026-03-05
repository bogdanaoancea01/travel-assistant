export default function ConversationArea({ messages, isTyping }) {
  return (
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

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 rounded-2xl px-4 py-2 text-sm">
              Thinking…
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
