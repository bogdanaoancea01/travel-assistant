import { 
  MessageSquare, 
  MapPin, 
  Compass, 
  Heart, 
  Bell, 
  Lightbulb, 
  PlusCircle,
  MoreHorizontal
} from 'lucide-react';

// Navigation menu items configuration
const menuItems = [
  { icon: MessageSquare, label: 'Chats', badge: '2' },
  { icon: MapPin, label: 'Trips', badge: null },
  { icon: Compass, label: 'Explore', badge: null },
  { icon: Heart, label: 'Saved', badge: null },
  { icon: Bell, label: 'Updates', badge: null },
  { icon: Lightbulb, label: 'Inspiration', badge: null },
  { icon: PlusCircle, label: 'Create', badge: null },
];

export function Sidebar() {
  return (
    <div className="h-full w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Logo section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xl">✈️</span>
          <span className="font-semibold text-lg">mindtrip.</span>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg 
                         hover:bg-gray-200 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="size-5 text-gray-600 group-hover:text-gray-900" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {item.label}
                  </span>
                </div>
                {/* Badge for notification count */}
                {item.badge && (
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* New chat button */}
        <button
          className="w-full mt-6 px-4 py-2.5 bg-white border border-gray-300 rounded-lg 
                   hover:bg-gray-50 transition-colors text-sm text-gray-700"
        >
          New chat
        </button>
      </nav>

      {/* User profile section at bottom */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          {/* User avatar and info */}
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="text-white text-sm font-medium">B</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Bogdana Gancea
              </p>
              <p className="text-xs text-gray-500 truncate">
                @bogdana-gancea
              </p>
            </div>
          </div>
          {/* More options button */}
          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
            <MoreHorizontal className="size-4 text-gray-600" />
          </button>
        </div>

        {/* Footer links */}
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <a href="#" className="hover:underline">Company</a>
          <span>·</span>
          <a href="#" className="hover:underline">Contact</a>
          <span>·</span>
          <a href="#" className="hover:underline">Help</a>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
          <a href="#" className="hover:underline">Terms</a>
          <span>·</span>
          <a href="#" className="hover:underline">Privacy</a>
        </div>
        <p className="mt-2 text-xs text-gray-400">© 2025 Mindtrip, Inc</p>
      </div>
    </div>
  );
}
