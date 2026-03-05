import { useState } from "react";
import { X } from "lucide-react";
export default function RenameChatModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [chatName, setChatName] = useState("");
  return (
    <div className="relative inset-0 flex items-center justify-center bg-black/40">
      {isOpen && (
        <div className="bg-white w-125 rounded-2xl p-6 shadow-lg relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute left-5 top-5 text-gray-600 cursor-pointer"
          >
            <X size={20} />
          </button>

          <h2 className="text-center text-lg font-semibold mb-6">
            Edit chat name
          </h2>

          <input
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            className="w-full border rounded-full px-4 py-3 mb-6 outline-none"
            placeholder="Enter chat name"
          />

          <div className="flex justify-end">
            <button
              className="bg-black text-white px-8 py-3 rounded-full"
              onClick={() => {
                console.log("Saved:", chatName);
                setIsOpen(false);
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
