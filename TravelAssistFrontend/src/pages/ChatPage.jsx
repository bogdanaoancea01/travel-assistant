import SideMenuWhole from "../components/SideMenuComponents/SideMenuWhole";
import ChatComponent from "../components/ChatPageComponents/ChatComponent";
import RecommendationsPanel from "../components/ChatPageComponents/RecommendationsPanel";
import { Menu } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="size-full flex overflow-hidden">
      <div>
        <SideMenuWhole />
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
