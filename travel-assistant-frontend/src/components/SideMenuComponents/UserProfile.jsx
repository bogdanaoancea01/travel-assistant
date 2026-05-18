import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

export default function UserProfile({ isCompact }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const fullName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "Guest";

  const username = user?.email?.split("@")[0] ?? "";

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          className="bg-gray-800 rounded-full size-8 cursor-pointer text-white text-sm font-medium"
          onClick={() => navigate("/editprofile")}
        >
          {initials}
        </button>
        {!isCompact && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {fullName}
            </p>
            <p className="text-xs text-gray-500 truncate">@{username}</p>
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
