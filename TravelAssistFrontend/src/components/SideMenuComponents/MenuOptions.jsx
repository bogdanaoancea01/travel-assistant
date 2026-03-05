export default function MenuOptions({ menuItems }) {
  return (
    <nav className="flex-1 p-4">
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li key={item.label}>
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-200 transition-colors text-left group cursor-pointer">
              <div className="flex items-center gap-3">
                <item.icon className="size-5 text-gray-600 group-hover:text-gray-900 " />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {item.label}
                </span>
              </div>
              {/* Chats counter */}
              {item.badge && (
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      <button className="w-full mt-6 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 cursor-pointer">
        New chat
      </button>
    </nav>
  );
}
