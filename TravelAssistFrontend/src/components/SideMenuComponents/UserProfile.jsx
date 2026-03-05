import { MoreHorizontal } from "lucide-react";
export default function UserProfile({ isCompact }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-full bg-gray-800 flex items-center justify-center">
          <span className="text-white text-sm font-medium">B</span>
        </div>
        {!isCompact && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Bogdana Oancea
            </p>
            <p className="text-xs text-gray-500 truncate">@bogdana-oancea</p>
          </div>
        )}
      </div>
      {!isCompact && (
        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
          <MoreHorizontal className="size-4 text-gray-600" />
        </button>
      )}
    </div>
  );
}
