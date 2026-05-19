import { useNavigate } from "react-router-dom";

export default function MenuOptions({ menuItems, onNewChat }) {
  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate("/chat");
    onNewChat?.();
  };

  return (
    <nav className="flex-1 px-3 py-4">
      <ul className="space-y-0.5">
        {menuItems.map((item) => (
          <li key={item.label}>
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left group cursor-pointer">
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-gray-500 group-hover:text-gray-900 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <button 
        className="w-full mt-4 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors text-sm font-medium cursor-pointer"
        onClick={handleNewChat}
      >
        New chat
      </button>
    </nav>
  );
}
