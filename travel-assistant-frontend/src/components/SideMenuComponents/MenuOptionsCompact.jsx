export default function MenuOptionsCompact({ menuItems }) {
  return (
    <div className="flex-1 flex-col">
      <ul className="space-y-1 p-2">
        {menuItems.map((item) => (
          <li key={item.label}>
            <button className="px-4 py-3 rounded-lg hover:bg-gray-200 cursor-pointer">
              <item.icon className="size-5 text-black" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
