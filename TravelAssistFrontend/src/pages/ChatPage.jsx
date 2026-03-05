import { useState } from "react";
import SideMenu from "../components/ChatPageComponents/SideMenu";
import ChatComponent from "../components/ChatPageComponents/ChatComponent";
import RecommendationsPanel from "../components/ChatPageComponents/RecommendationsPanel";
import { Menu } from "lucide-react";

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="size-full flex overflow-hidden">
      {/* Mobile sidebar */}
      {isSidebarOpen ? (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white shadow-md"
          aria-label="Toggle menu"
        >
          <Menu className={`${isSidebarOpen ? "hidden" : ""}`} />
        </button>
      )}

      {/* Sidebar - always visible on desktop */}
      <div
        className={`
       fixed lg:static inset-y-0 left-0 z-40
       transform duration-300 ease-in-out
       ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
     `}
      >
        <SideMenu />
      </div>

      <div className="flex-1 lg:flex-[0.6] overflow-y-auto">
        <ChatComponent />
      </div>

      <div className="hidden xl:block flex-[0.6] overflow-y-auto border-l border-gray-200">
        <RecommendationsPanel />
      </div>
    </div>
  );
}
