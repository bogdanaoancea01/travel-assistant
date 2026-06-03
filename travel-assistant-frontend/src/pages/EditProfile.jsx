import { useNavigate } from "react-router-dom";
import SideMenuWhole from "../components/SideMenuComponents/SideMenuWhole";
import SettingsPage from "../components/ProfilePageComponents/SettingsPage";

export default function EditProfile() {
  const navigate = useNavigate();

  const handleChatSelect = (chatId) => {
    sessionStorage.removeItem("currentMessages");
    sessionStorage.removeItem("activeTrip");
    sessionStorage.setItem("currentChatId", String(chatId));
    navigate("/chat", { state: { initialChatId: chatId } });
  };

  const handleNewChat = (chatId) => {
    sessionStorage.removeItem("currentChatId");
    sessionStorage.removeItem("currentMessages");
    sessionStorage.removeItem("activeTrip");
    navigate("/chat", { state: { initialChatId: chatId ?? null } });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenuWhole
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-gray-100 px-10 py-5 shrink-0">
          <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
        </header>
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-10 py-8">
            <SettingsPage />
          </div>
        </div>
      </div>
    </div>
  );
}