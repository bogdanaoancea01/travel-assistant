import { useNavigate } from "react-router-dom";
import MenuOptions from "../SideMenuComponents/MenuOptions";
import MenuOptionsCompact from "../SideMenuComponents/MenuOptionsCompact";
import UserProfile from "../SideMenuComponents/UserProfile";
import FooterLinks from "../SideMenuComponents/FooterLinks";
import {
  MessageSquare,
  MapPin,
  Compass,
  Heart,
  Bell,
  Lightbulb,
} from "lucide-react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      <div
        className={`${isCompact ? "" : "border-b border-gray-200"} p-5.5  flex items-center justify-between`}
      >
        {!isCompact && (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-semibold text-lg">TravelAI</span>
          </div>
        )}

        <button
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsCompact(!isCompact)}
        >
          {isCompact ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {isCompact ? (
        <MenuOptionsCompact menuItems={menuItems} />
      ) : (
        <MenuOptions menuItems={menuItems} />
      )}

      <div
        className={`${isCompact ? "pl-5 pb-15" : "border-t border-gray-200 p-4"}`}
      >
        <UserProfile isCompact={isCompact} />
        {!isCompact && <FooterLinks />}
      </div>
    </div>
  );
}
