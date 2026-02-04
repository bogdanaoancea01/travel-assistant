import { useState } from 'react';
import { ChevronDown, Mic, Send, Sparkles } from 'lucide-react';

export function ChatArea() {
  const [message, setMessage] = useState('');

  // Handle sending a message
  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top navigation bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        {/* New chat button with dropdown */}
        <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors">
          <span className="text-sm font-medium">New chat</span>
          <ChevronDown className="size-4 text-gray-500" />
        </button>

        {/* Create a trip button */}
        <button className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors">
          <Sparkles className="size-4" />
          <span className="text-sm font-medium">Create a trip</span>
        </button>
      </div>

      {/* Main chat content area */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full text-center">
          {/* Illustration */}
          <div className="mb-8 flex justify-center">
            {/* <img
              src={chatIllustration}
              alt="Travel illustration"
              className="w-48 h-auto"
            /> */}
          </div>

          {/* Greeting text */}
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
            Where to today, Bogdana?
          </h1>
          <p className="text-gray-600 mb-8">
            Hey there, I'm here to assist you in planning your experience.
            <br />
            Ask me anything travel related.
          </p>

        </div>
      </div>

      {/* Input area at bottom */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          {/* Input container with rounded border */}
          <div className="relative flex items-end gap-2 p-1 border border-gray-300 rounded-2xl bg-white focus-within:border-gray-400 transition-colors">
            {/* Text input */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything"
              className="flex-1 px-4 py-2.5 bg-transparent border-none outline-none resize-none text-sm placeholder:text-gray-400"
            />

            {/* Action buttons */}
            <div className="flex items-center gap-1 pr-1">
              {/* Voice input button */}
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Voice input"
              >
                <Mic className="size-5 text-gray-500" />
              </button>

              {/* Send button */}
              <button
                onClick={handleSend}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                disabled={!message.trim()}
                aria-label="Send message"
              >
                <Send className="size-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Disclaimer text */}
          <p className="text-xs text-gray-400 text-center mt-3">
            ⓘ Mindtrip can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}
