import { useNavigate } from "react-router-dom";
import MenuOptions from "../SideMenuComponents/MenuOptions";
import MenuOptionsCompact from "../SideMenuComponents/MenuOptionsCompact";
import UserProfile from "../SideMenuComponents/UserProfile";
import FooterLinks from "../SideMenuComponents/FooterLinks";
import { MessageSquare, MapPin, Compass, Heart, Bell, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Logo from "../Logo";

export default function SideMenu() {
  const menuItems = [
    { icon: MessageSquare, label: "Chats", badge: "2" },
    { icon: MapPin, label: "Trips", badge: null },
    { icon: Compass, label: "Explore", badge: null },
    { icon: Heart, label: "Saved", badge: null },
    { icon: Bell, label: "Updates", badge: null },
    { icon: Lightbulb, label: "Inspiration", badge: null },
  ];

  const navigate = useNavigate();
  const [isCompact, setIsCompact] = useState(false);

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
        <MenuOptionsCompact menuItems={menuItems} />
      ) : (
        <MenuOptions menuItems={menuItems} />
      )}

      {/* Footer */}
      <div className={`border-t border-gray-100 ${isCompact ? "p-2" : "p-4"}`}>
        <UserProfile isCompact={isCompact} />
        {!isCompact && <FooterLinks />}
      </div>
    </div>
  );
}
