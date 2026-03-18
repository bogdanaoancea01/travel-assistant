import { useState } from "react";
import RenameChatModal from "./RenameChatModal";
import { ChevronDown } from "lucide-react";

export default function ChatHeader() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);

  return (
    <div className="border-b border-gray-200 px-4 py-4">
      <button
        className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={() => setOpenMenu(!openMenu)}
      >
        <span className="font-medium">New chat</span>
        <ChevronDown size={16} />
      </button>

      {openMenu && (
        <div className="absolute w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
          <button
            className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => {
              setOpenRenameModal(!openRenameModal);
              setOpenMenu(false);
            }}
          >
            Rename chat
          </button>
          <button
            className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => {
              setOpenExportModal(!openExportModal);
              setOpenMenu(false);
            }}
          >
            Export chat
          </button>
          <div className="my-1 border-t border-gray-200" />
          <button
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
            onClick={() => {
              setOpenExportModal(!openExportModal);
              setOpenMenu(false);
            }}
          >
            Delete chat
          </button>
        </div>
      )}

      {openRenameModal && <RenameChatModal />}
    </div>
  );
}
