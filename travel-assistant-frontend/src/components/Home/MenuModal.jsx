import {
  MessageSquare, Compass, Heart, Bell, Lightbulb, X, User, LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Logo from "../Logo";

export default function MenuModal({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: MessageSquare, label: "Start planning", path: "/chat" },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: Lightbulb, label: "Get inspired", path: "/inspiration" },
    { icon: Heart, label: "Personalize", path: "/personalize" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 duration-200 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div
        className={`
          absolute left-0 top-0 h-full w-[80%] max-w-xs bg-white
          shadow-2xl flex flex-col 
          transform duration-200 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
          <Logo size={32} />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 pt-8">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigate(item.path)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-800 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}

          <div className="pt-3 mt-3 border-t border-gray-100">
            <button
              onClick={() => handleNavigate("/support")}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-800 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Bell className="h-4.5 w-4.5 shrink-0" />
              <span className="font-medium">Help & Support</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 pb-6 pt-3 border-t border-gray-100 space-y-2">
          {user ? (
            <>
              <button
                onClick={() => handleNavigate("/editprofile")}
                className="flex w-full items-center gap-2 justify-center rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <User className="h-4 w-4" />
                My profile
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 justify-center rounded-xl py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="h-6 w-6" />
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigate("/signup")}
                className="w-full rounded-xl bg-gray-900 py-2.5 text-sm text-white font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Get started
              </button>
              <button
                onClick={() => handleNavigate("/signin")}
                className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Log in
              </button>
            </>
          )}

          <p className="pt-1 text-center text-xs text-gray-500">
            Privacy Policy · Terms of Service · © 2026 Meridian
          </p>
        </div>
      </div>
    </div>
  );
}