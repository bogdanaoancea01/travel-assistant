import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useChatHistory } from "../../utilities/useChatHistory";

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const diff = Math.floor((new Date() - date) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return "Today";
  if (diff < 172800) return "Yesterday";
  return `${Math.floor(diff / 86400)} days ago`;
}

function ChatItemMenu({ onRename, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
      >
        <MoreHorizontal className="h-3 w-3 text-gray-500" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-50">
          <button
            onClick={(e) => { e.stopPropagation(); onRename(); setOpen(false); }}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
          >
            <Pencil className="h-3 w-3 text-gray-400" /> Rename chat
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); setOpen(false); }}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" /> Delete chat
          </button>
        </div>
      )}
    </div>
  );
}

function RenameInline({ currentName, onSave, onCancel }) {
  const [value, setValue] = useState(currentName);
  const ref = useRef(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <input
      ref={ref}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSave(value.trim());
        if (e.key === "Escape") onCancel();
      }}
      onBlur={() => onSave(value.trim())}
      onClick={(e) => e.stopPropagation()}
      className="w-full text-xs border border-gray-300 rounded px-1.5 py-0.5 outline-none focus:border-gray-500"
    />
  );
}

export default function MenuOptions({ menuItems, onNewChat, currentChatId, showChatList, onChatsClick, onChatCountChange }) {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const { createChat, fetchChats, renameChat, deleteChat } = useChatHistory();

  useEffect(() => {
    if (!showChatList) return;
    fetchChats().then((data) => setChats(data ?? [])).finally(() => setLoadingChats(false));
  }, [showChatList]);

  const handleNewChat = async () => {
    const chat = await createChat("New Chat");
    sessionStorage.removeItem("currentMessages");
    sessionStorage.removeItem("activeTrip");
    navigate("/chat", { state: { initialChatId: chat?.id } });
    onNewChat?.(chat?.id);
    onChatCountChange?.((c) => (c ?? 0) + 1);
  };

  const handleRename = async (chatId, newName) => {
    if (!newName) { setRenamingId(null); return; }
    await renameChat(chatId, newName);
    setChats((prev) => prev.map((c) => c.id === chatId ? { ...c, name: newName } : c));
    setRenamingId(null);
  };

  const handleDelete = async (chatId) => {
    await deleteChat(chatId);
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    onChatCountChange?.((c) => Math.max(0, (c ?? 1) - 1));
    if (chatId === currentChatId) onNewChat?.();
  };

  const handleItemClick = (item) => {
    if (item.label === "Chats") { onChatsClick?.(); return; }
    navigate(item.path ?? "/");
  };

  return (
    <nav className="flex-1 px-3 py-4">
      <ul className="space-y-0.5">
        {menuItems.map((item) => {
          const isChatsOption = item.label === "Chats";
          const isChatsActive = isChatsOption && showChatList;
          return (
            <li key={item.label}>
              <button
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors text-left group cursor-pointer ${
                  isChatsActive ? "bg-gray-50" : "hover:bg-gray-50"
                }`}
                onClick={() => handleItemClick(item)}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-4 w-4 transition-colors ${isChatsActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"}`} />
                  <span className={`text-sm font-medium transition-colors ${isChatsActive ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"}`}>
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isChatsOption && (
                    <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${showChatList ? "rotate-180" : ""}`} />
                  )}
                </div>
              </button>

              {/* Inline chats list */}
              {isChatsOption && showChatList && (
                <div className="mt-1 mb-1 max-h-70 overflow-auto">
                  {loadingChats ? (
                    <div className="space-y-1 px-3 py-1">
                      {[1, 2].map((i) => <div key={i} className="h-7 rounded bg-gray-50 animate-pulse" />)}
                    </div>
                  ) : chats.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-3">No chats yet</p>
                  ) : (
                    chats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`group flex items-center justify-between px-3 py-1.5 pl-10 rounded-lg cursor-pointer transition-colors ${
                          chat.id === currentChatId ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          {renamingId === chat.id ? (
                            <RenameInline
                              currentName={chat.name}
                              onSave={(name) => handleRename(chat.id, name)}
                              onCancel={() => setRenamingId(null)}
                            />
                          ) : (
                            <>
                              <p className="text-xs font-semibold text-gray-700 truncate">{chat.name}</p>
                              <p className="text-xs font-thin text-gray-400 truncate">{timeAgo(chat.updatedAt)}</p>
                            </>
                          )}
                        </div>
                        <ChatItemMenu
                          onRename={() => setRenamingId(chat.id)}
                          onDelete={() => handleDelete(chat.id)}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}
            </li>
          );
        })}
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
