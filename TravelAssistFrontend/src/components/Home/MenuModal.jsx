import {
  MessageSquare,
  Compass,
  Heart,
  Bell,
  Lightbulb,
  X,
} from "lucide-react";

export default function MenuModal({ isOpen, onClose }) {
  const menuItems = [
    { icon: MessageSquare, label: "Start chatting" },
    { icon: Compass, label: "Explore" },
    { icon: Lightbulb, label: "Get inspired" },
    { icon: Heart, label: "Personalize" },
    { icon: Bell, label: "Help & Support" },
  ];

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

      {/* Menu */}
      <div
        className={`
          absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white
          rounded-tr-xl rounded-br-xl shadow-xl p-6
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
            <span className="font-semibold text-2xl">TravelAI</span>
          </div>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {menuItems.map((item) => (
          <nav className="space-y-2">
            {item.label !== "Help & Support" ? (
              <button className="flex w-full items-center gap-4 rounded-xl px-4 py-4 hover:bg-gray-100 transition cursor-pointer">
                <span>
                  <item.icon />
                </span>
                <span className="font-semibold">{item.label}</span>
              </button>
            ) : (
              <div>
                <hr className="my-6" />
                <button className="flex w-full items-center gap-4 rounded-xl px-4 py-4 text-base text-black-700 hover:bg-gray-100 transition cursor-pointer">
                  <span>
                    <item.icon />
                  </span>
                  <span className="font-semibold">{item.label}</span>
                </button>
              </div>
            )}
          </nav>
        ))}

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <button className="w-full rounded-full border border-gray-400 py-2 cursor-pointer hover:bg-gray-50">
            Log in
          </button>
          <button className="w-full rounded-full bg-black py-2 text-white cursor-pointer hover:bg-gray-900">
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
