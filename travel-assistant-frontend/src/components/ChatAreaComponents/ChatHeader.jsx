import { useState, useEffect, useRef } from "react";
import RenameChatModal from "./RenameChatModal";
import { ChevronDown, Pencil, Download, Trash2 } from "lucide-react";
import { useChatHistory } from "../../utilities/useChatHistory";
import { exportChatPdf, hasExportableTrip } from "../../utilities/exportTripPdf";

export default function ChatHeader({ chatId, trip, messages }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [chatName, setChatName] = useState("New Chat");
  const menuRef = useRef(null);
  const { renameChat, loadChat  } = useChatHistory();

  useEffect(() => {
    if (!chatId) return;
    loadChat(chatId).then((chat) => {
      if (chat?.name) setChatName(chat.name);
    });
  }, [chatId]);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRename = async (newName) => {
    setChatName(newName);
    if (chatId) {
      await renameChat(chatId, newName);
    }
  };

  const handleExport = () => {
    setOpenMenu(false);
    exportChatPdf({ trip, messages, title: chatName });
  };

  const exportable = hasExportableTrip(trip);

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
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => { setOpenRenameModal(true); setOpenMenu(false); }}
            >
              <Pencil className="h-4 w-4 text-gray-400" />
              Rename chat
            </button>
            <button
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 text-gray-400" />
              {exportable ? "Export itinerary (PDF)" : "Export chat (PDF)"}
            </button>
          </div>
        )}
      </div>

      {openRenameModal && (
        <RenameChatModal
          open={openRenameModal}
          handleClose={() => setOpenRenameModal(false)}
          onRename={handleRename}
          currentName={chatName}
        />
      )}
    </div>
  );
}