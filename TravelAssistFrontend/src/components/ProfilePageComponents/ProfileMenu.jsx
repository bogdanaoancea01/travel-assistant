import { useState } from "react";
export default function ProfileMenu() {
  const [active, setActive] = useState("profile");

  const menuOptions = [
    { id: "profile", label: "Edit profile" },
    { id: "account", label: "Your account" },
    { id: "travel", label: "Travel preferences" },
    { id: "notifications", label: "Notification settings" },
    { id: "cookies", label: "Cookie preferences" },
  ];

  return (
    <div className="w-64 border-r border-gray-200 py-6">
      {menuOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => setActive(option.id)}
          className={`relative w-full text-left px-6 py-2 text-s transition cursor-pointer
            ${
              active === option.id
                ? "font-semibold text-black"
                : "text-gray-600 hover:text-black"
            }`}
        >
          {option.label}

          {/* active indicator */}
          {active === option.id && (
            <span className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-black rounded-l"></span>
          )}
        </button>
      ))}
    </div>
  );
}
