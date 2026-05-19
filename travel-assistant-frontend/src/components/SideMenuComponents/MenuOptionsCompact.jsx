import { useNavigate } from "react-router-dom";

export default function MenuOptionsCompact({ menuItems, onNewChat }) {
  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate("/chat");
    onNewChat?.();
  };

  return (
    <nav className="flex-1 flex flex-col items-center px-2 py-4 gap-1">
      {menuItems.map((item) => (
        <button
          key={item.label}
          className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
          title={item.label}
        >
          <item.icon className="h-4 w-4 text-gray-500 group-hover:text-gray-900 transition-colors" />
          {item.badge && (
            <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-[9px] font-semibold bg-gray-900 text-white rounded-full">
              {item.badge}
            </span>
          )}
        </button>
      ))}

      <div className="mt-3 w-8 h-px bg-gray-100" />

      <button
        className="w-6 h-6 flex items-center justify-center rounded-xl bg-gray-900 hover:bg-gray-700 transition-colors cursor-pointer mt-3"
        title="New chat"
        onClick={handleNewChat}
      >
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </nav>
  );
}
