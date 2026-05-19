import { Send } from "lucide-react";
import { useRef } from "react";

export default function ChatInput({ inputQuestion, onInputChange, onSendMessage }) {
  const textBoxRef = useRef(null);
  const MAX_HEIGHT = 150;

  const handleInput = () => {
    const el = textBoxRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, MAX_HEIGHT) + "px";
  };

  const handleReset = () => {
    if (textBoxRef.current) textBoxRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
      handleReset();
    }
  };

  const hasContent = inputQuestion.trim().length > 0;

  return (
    <div className="px-6 py-4 border-t border-gray-100">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={(e) => { e.preventDefault(); onSendMessage(); handleReset(); }}>
          <div className="flex items-end gap-2 px-4 py-3 border border-gray-200 rounded-2xl bg-white focus-within:border-gray-400 transition-colors shadow-sm">
            <textarea
              rows={1}
              ref={textBoxRef}
              value={inputQuestion}
              onInput={handleInput}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything"
              className="flex-1 bg-transparent border-none outline-none text-sm resize-none leading-5 text-gray-800 placeholder-gray-400 py-0 self-center"
              style={{ height: "20px" }}
            />
            <button
              type="submit"
              disabled={!hasContent}
              className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-colors cursor-pointer
                ${hasContent
                  ? "bg-gray-900 hover:bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-center text-xs text-gray-300 mt-2">
            Meridian can make mistakes. Verify important information.
          </p>
        </form>
      </div>
    </div>
  );
}
