import { useState, useEffect, useRef } from "react";
import RenameChatModal from "./RenameChatModal";
import { ChevronDown, Pencil, Download, Trash2 } from "lucide-react";

export default function ChatHeader() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [chatName, setChatName] = useState(() => localStorage.getItem("chatName") || "New Chat");
  const menuRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chatName", chatName);
  }, [chatName]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-14 border-b border-gray-100 px-5 flex items-center">
      <div className="relative" ref={menuRef}>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <span className="text-sm font-semibold text-gray-900">{chatName}</span>
          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform duration-200 ${openMenu ? "rotate-180" : ""}`}
          />
        </button>

        {openMenu && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
            <button
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => { setOpenRenameModal(true); setOpenMenu(false); }}
            >
              <Pencil className="h-4 w-4 text-gray-400" />
              Rename chat
            </button>
            <button
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setOpenMenu(false)}
            >
              <Download className="h-4 w-4 text-gray-400" />
              Export chat
            </button>
            <div className="my-1 mx-2 border-t border-gray-100" />
            <button
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
              onClick={() => setOpenMenu(false)}
            >
              <Trash2 className="h-4 w-4" />
              Delete chat
            </button>
          </div>
        )}
      </div>

      {openRenameModal && (
        <RenameChatModal
          open={openRenameModal}
          handleClose={() => setOpenRenameModal(false)}
          onRename={(newName) => setChatName(newName)}
          currentName={chatName}
        />
      )}
    </div>
  );
}
