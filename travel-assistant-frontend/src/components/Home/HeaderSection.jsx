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
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">

        {/* Left — menu + logo */}
        <div className="flex-1 flex items-center gap-5">
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
        <nav className="hidden md:flex items-center">
          {["Explore", "Quiz", "Saved"].map((item) => (
            <button
              key={item}
              className="px-2 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
              onClick={() => {
                if (item === "Explore") navigate("/explore");
                if (item === "Quiz") navigate("/quiz");
                if (item === "Saved") navigate("/saved");
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right — auth */}
        <div className="flex-1 flex items-center justify-end gap-3">
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
                className="px-4 py-2 text-sm font-medium text-gray-90 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
              >
                Sign in
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}