import { useNavigate } from "react-router-dom";
export default function MenuOptionsCompact({ menuItems }) {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex-col">
      <ul className="space-y-1 p-2">
        {menuItems.map((item) => (
          <li key={item.label}>
            <button className="px-3 py-2.5 rounded-lg hover:bg-gray-200 cursor-pointer">
              <item.icon className="size-6 text-black" />
            </button>
          </li>
        ))}
      </ul>

      <div
        className="flex flex-col gap-2 cursor-pointer pl-4 pt-80"
        onClick={() => navigate("/home")}
      >
        <span className="[writing-mode:vertical-rl] rotate-180 font-semibold text-2xl">
          TravelAI
        </span>
        <svg
          className="w-5 h-5 [writing-mode:vertical-rl] rotate-180"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
    </div>
  );
}
