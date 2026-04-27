import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function UserProfile({ isCompact }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          className="bg-gray-800 rounded-full size-8 cursor-pointer text-white text-sm font-medium"
          onClick={() => navigate("/editprofile")}
        >
          FL
        </button>
        {!isCompact && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              FirstName LastName
            </p>
            <p className="text-xs text-gray-500 truncate">@firstname-lastname</p>
          </div>
        )}
      </div>
      {!isCompact && (
        <button className="hover:bg-gray-200 rounded transition-colors">
          <MoreHorizontal className="size-4 text-gray-600 ml-2" />
        </button>
      )}
    </div>
  );
}
