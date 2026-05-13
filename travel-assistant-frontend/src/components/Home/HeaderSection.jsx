import { Menu } from "lucide-react";
import { useAuth } from "../../AuthContext";
import AuthProvider from "../../AuthContext"; 

export default function HeaderSection({ onSignInClick, onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button>
            <Menu
              onClick={onMenuClick}
              className="w-6 h-6 cursor-pointer"
            ></Menu>
          </button>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-semibold text-lg">TravelAI</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <span className="hidden sm:inline-flex font-medium">
              Hi, {user.firstName}
            </span>
          ) : (
            <button
              className="px-4 py-2 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={onSignInClick}
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
