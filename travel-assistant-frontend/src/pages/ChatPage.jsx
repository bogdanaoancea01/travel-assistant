import { useState } from "react";
import SideMenuWhole from "../components/SideMenuComponents/SideMenuWhole";
import ChatComponent from "../components/ChatPageComponents/ChatComponent";
import RecommendationsPanel from "../components/ChatPageComponents/RecommendationsPanel";
import ChatHeader from "../components/ChatAreaComponents/ChatHeader";

export default function ChatPage() {
  const [activeTrip, setActiveTrip] = useState(null);
  const [pendingPrompt, setPendingPrompt] = useState("");

  const handlePrompt = (prompt) => {
    setPendingPrompt(prompt);
  };

  const handleNewTrip = () => {
    setActiveTrip(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div>
        <SideMenuWhole />
      </div>

      <div className="flex flex-1 flex-col lg:flex-[0.6] border-r border-gray-200">
        <ChatHeader />
        <ChatComponent
          pendingPrompt={pendingPrompt}
          onPendingPromptConsumed={() => setPendingPrompt("")}
          onTripGenerated={setActiveTrip}
        />
      </div>

      <div className="xl:block flex-[0.6] overflow-y-auto">
        <RecommendationsPanel
          activeTrip={activeTrip}
          onPrompt={handlePrompt}
          onNewTrip={handleNewTrip}
        />
      </div>
    </div>
  );
}