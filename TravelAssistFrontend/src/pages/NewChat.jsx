import { useState } from 'react';
import { Sidebar } from "../components/ForChatPage/SideBar";
import { ChatArea } from "../components/ForChatPage/ChatArea";
import { RecommendationsPanel } from "../components/ForChatPage/RecommendationsPanel";
import { Menu } from 'lucide-react';

export function NewChat() {
  // State to control mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="size-full flex bg-white">
      {/* Mobile menu button - only visible on small screens */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white shadow-md hover:bg-gray-50"
        aria-label="Toggle menu"
      >
        <Menu className="size-6" />
      </button>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - slides in on mobile, always visible on desktop */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Sidebar />
      </div>

      {/* Main content area - takes up remaining space */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Chat area - full width on mobile, 60% on desktop */}
        <div className="flex-1 lg:flex-[0.6] overflow-y-auto">
          <ChatArea />
        </div>

        {/* Recommendations panel - hidden on mobile, visible on large screens */}
        <div className="hidden xl:block flex-[0.4] overflow-y-auto border-l border-gray-200">
          <RecommendationsPanel />
        </div>
      </div>
    </div>
  );
}
