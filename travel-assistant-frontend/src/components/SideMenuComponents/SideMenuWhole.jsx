import { useState } from "react";
import SideMenu from "./SideMenu";
import { Menu } from "lucide-react";

export default function SideMenuWhole({ onNewChat }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen">
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
        <SideMenu onNewChat={onNewChat} />
      </div>
    </div>
  );
}
