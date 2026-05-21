import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SideMenuWhole from "../components/SideMenuComponents/SideMenuWhole";
import ChatComponent from "../components/ChatPageComponents/ChatComponent";
import RecommendationsPanel from "../components/ChatPageComponents/RecommendationsPanel";

export default function ChatPage() {
  const location = useLocation();
  const [activeTrip, setActiveTrip] = useState(() => {
    const stored = sessionStorage.getItem("activeTrip");
    return stored ? JSON.parse(stored) : null;
  });
  const [pendingPrompt, setPendingPrompt] = useState("");
  const [chatKey, setChatKey] = useState(0);
  const [initialChatId, setInitialChatId] = useState(
    location.state?.initialChatId ?? null
  );

  useEffect(() => {
    if (location.state?.initialChatId) {
      window.history.replaceState({}, "");
    }
  }, []);

  useEffect(() => {
    if (activeTrip) {
      sessionStorage.setItem("activeTrip", JSON.stringify(activeTrip));
    } else {
      sessionStorage.removeItem("activeTrip");
    }
  }, [activeTrip]);

  const handleNewChat = (chatId) => {
    sessionStorage.removeItem("currentChatId");
    sessionStorage.removeItem("currentMessages");
    sessionStorage.removeItem("activeTrip");
    setActiveTrip(null);
    setInitialChatId(chatId ?? null);
    setChatKey(prev => prev + 1);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div>
        <SideMenuWhole onNewChat={handleNewChat} />
      </div>

      <div className="flex flex-1 flex-col lg:flex-[0.6] border-r border-gray-200">
        <ChatComponent
          key={chatKey}
          initialChatId={initialChatId}
          pendingPrompt={pendingPrompt}
          onPendingPromptConsumed={() => setPendingPrompt("")}
          onTripGenerated={setActiveTrip}
        />
      </div>

      <div className="xl:block flex-[0.6] overflow-y-auto">
        <RecommendationsPanel
          activeTrip={activeTrip}
          onPrompt={(prompt) => setPendingPrompt(prompt)}
          onNewTrip={() => setActiveTrip(null)}
        />
      </div>
    </div>
  );
}