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

  if (isCompact) {
    return (
      <div className="flex justify-center">
        <button
          className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => navigate("/editprofile")}
          title={fullName}
        >
          {initials}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-semibold shrink-0 cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => navigate("/editprofile")}
        >
          {initials}
        </button>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate leading-tight">{fullName}</p>
          <p className="text-xs text-gray-400 truncate">@{username}</p>
        </div>
      </div>
      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors shrink-0 cursor-pointer">
        <MoreHorizontal className="h-4 w-4 text-gray-400" />
      </button>
    </div>
  );
}