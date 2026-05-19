import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Logo from "../Logo";

export default function HeaderSection({ onSignInClick, onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Left — menu + logo */}
        <div className="flex items-center gap-5">
          <button
            onClick={onMenuClick}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          <div className="h-5 w-px bg-gray-200" />

          <Logo size={22} />
        </div>

        {/* Center — nav links (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-1">
          {["Explore", "Destinations", "Inspiration"].map((item) => (
            <button
              key={item}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right — auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={() => navigate("/editprofile")}
              className="flex items-center gap-2.5 hover:bg-gray-50 rounded-full pl-2 pr-3 py-1.5 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
            >
              <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {initials}
              </div>
              <span className="text-sm font-medium text-gray-800 hidden sm:inline">
                {user.firstName} {user.lastName}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onSignInClick}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
              >
                Sign in
              </button>
              <button
                onClick={onSignInClick}
                className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Get started
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}