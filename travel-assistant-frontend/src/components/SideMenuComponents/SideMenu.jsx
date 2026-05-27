import { useNavigate } from "react-router-dom";
import MenuOptions from "../SideMenuComponents/MenuOptions";
import MenuOptionsCompact from "../SideMenuComponents/MenuOptionsCompact";
import UserProfile from "../SideMenuComponents/UserProfile";
import FooterLinks from "../SideMenuComponents/FooterLinks";
import { MessageSquare, MapPin, Compass, Heart, Bell, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Logo from "../Logo";
import { useChatHistory } from "../../utilities/useChatHistory";

export default function SideMenu({ onNewChat, onChatSelect, currentChatId }) {
  const navigate = useNavigate();
  const [isCompact, setIsCompact] = useState(false);
  const [showChatList, setShowChatList] = useState(false);
  const [chatCount, setChatCount] = useState(null);
  const { fetchChats } = useChatHistory();

  useEffect(() => {
    async function loadChatCount() {
      try {
        const chats = await fetchChats();
        setChatCount(chats?.length ?? 0);
      } catch {
        setChatCount(null);
      }
    }
    loadChatCount();
  }, []);

  const menuItems = [
    { icon: MessageSquare, label: "Chats", badge: chatCount > 0 ? String(chatCount) : null },
    { icon: Compass, label: "Explore", badge: null },
    { icon: Lightbulb, label: "Inspiration", badge: null },
  ];

  return (
    <div className={`h-full bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ${isCompact ? "w-16" : "w-56"}`}>

      {/* Header */}
      <div className={`flex items-center h-16 border-b border-gray-100 px-3 ${isCompact ? "justify-center" : "justify-between px-4"}`}>
        {!isCompact && (
          <div className="cursor-pointer" onClick={() => navigate("/home")}>
            <Logo size={20} />
          </div>
        )}
        <button
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer text-gray-400"
          onClick={() => setIsCompact(!isCompact)}
        >
          {isCompact ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      {isCompact ? (
        <MenuOptionsCompact 
          menuItems={menuItems} 
          onNewChat={onNewChat} 
          onChatCountChange={setChatCount}
        />
      ) : (
        <MenuOptions
          menuItems={menuItems}
          onNewChat={onNewChat}
          currentChatId={currentChatId}
          showChatList={showChatList}
          onChatsClick={() => setShowChatList((p) => !p)}
          onChatCountChange={setChatCount}
          onChatSelect={onChatSelect} 
        />
      )}

      {/* Footer */}
      <div className={`border-t border-gray-100 ${isCompact ? "p-2" : "p-4"}`}>
        <UserProfile isCompact={isCompact} />
        {!isCompact && <FooterLinks />}
      </div>
    </div>
  );
}
