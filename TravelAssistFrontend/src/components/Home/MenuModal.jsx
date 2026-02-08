import { X } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export function MenuModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const goTo = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`
          absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white
          rounded-tr-2xl rounded-br-2xl shadow-xl p-6
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-semibold text-lg">TravelAI</span>
          </div>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <button className="flex w-full items-center gap-4 rounded-xl px-4 py-4 text-lg hover:bg-gray-100 transition">
            <span className="text-xl">💬</span>
            <span>Start chatting</span>
          </button>

          <button className="flex w-full items-center gap-4 rounded-xl px-4 py-4 text-lg hover:bg-gray-100 transition">
            <span className="text-xl">🔍</span>
            <span>Explore</span>
          </button>

          <button className="flex w-full items-center gap-4 rounded-xl px-4 py-4 text-lg hover:bg-gray-100 transition">
            <span className="text-xl">✈️</span>
            <span>Get inspired</span>
          </button>

          <button className="flex w-full items-center gap-4 rounded-xl px-4 py-4 text-lg hover:bg-gray-100 transition">
            <span className="text-xl">✨</span>
            <span>Personalize</span>
          </button>
        </nav>

        <hr className="my-6" />

        <button className="flex w-full items-center gap-4 rounded-xl px-4 py-4 text-base text-gray-700 hover:bg-gray-100 transition">
          <span className="text-xl">🛟</span>
          <span>Help & Support</span>
        </button>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <button
            onClick={() => goTo("/login")}
            className="w-full rounded-full border py-2"
          >
            Log in
          </button>
          <button
            onClick={() => goTo("/chat")}
            className="w-full rounded-full bg-black py-2 text-white"
          >
            Get started
          </button>

          <p className="mt-4 text-center text-xs text-gray-400">
            Privacy Policy · Terms of Service <br />© 2026 TravelAI, Inc.
          </p>
        </div>
      </div>
    </div>
  );
}

MenuModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
