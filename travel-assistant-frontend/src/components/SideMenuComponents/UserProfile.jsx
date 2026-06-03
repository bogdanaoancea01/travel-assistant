import { MoreHorizontal, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../AuthContext";

export default function UserProfile({ isCompact }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const fullName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "Guest";

  const username = user?.email?.split("@")[0] ?? "";

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/home");
  };

  const handleSettings = () => {
    setMenuOpen(false);
    navigate("/editprofile");
  };

  if (isCompact) {
    return (
      <div className="flex justify-center">
        <button
          className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => navigate("/editprofile")}
          title={fullName}
        >
          {initials}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-semibold shrink-0 cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => navigate("/editprofile")}
        >
          {initials}
        </button>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate leading-tight">{fullName}</p>
          <p className="text-xs text-gray-400 truncate">@{username}</p>
        </div>
      </div>

      {/* Three dots menu */}
      <div className="relative shrink-0" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((p) => !p)}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </button>

        {menuOpen && (
          <div className="absolute bottom-full mb-2 right-0 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
            <button
              onClick={handleSettings}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5 text-gray-400" />
              Settings
            </button>
            <div className="mx-3 my-1 border-t border-gray-100" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}