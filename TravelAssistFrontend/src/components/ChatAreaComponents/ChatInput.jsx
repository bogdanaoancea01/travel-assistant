import { Send } from "lucide-react";
import { useRef } from "react";

export default function ChatInput({
  inputQuestion,
  onInputChange,
  onSendMessage,
}) {
  const textBoxSize = useRef(null);
  const MAX_HEIGHT = 150;

  const handleInput = () => {
    const element = textBoxSize.current;

    if (!element) return;

    element.style.height = "auto";

    if (element.scrollHeight > MAX_HEIGHT) {
      element.style.height = MAX_HEIGHT + "px";
    } else {
      element.style.height = element.scrollHeight + "px";
    }
  };

  const handleReset = () => {
    textBoxSize.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
      handleReset();
    }
  };

  return (
    <div className="px-6 py-4 border-t border-gray-200">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage();
          }}
        >
          <div className="relative flex items-end gap-2 p-1 border border-gray-300 rounded-2xl bg-white focus-within:border-gray-400 transition-colors">
            <textarea
              id="clientQuestion"
              rows={1}
              ref={textBoxSize}
              value={inputQuestion}
              onInput={handleInput}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything"
              className="flex-1 px-4 py-2.5 bg-transparent border-none outline-none text-sm resize-none w-full"
            />

            <div className="flex items-center gap-1 pr-1">
              <button
                type="submit"
                onClick={handleReset}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send className="size-5 text-gray-500" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
