export default function ButtonsForEdit({ setActiveEditSection }) {
  return (
    <div className="flex gap-2 mt-1">
      <button
        onClick={() => setActiveEditSection(null)}
        className="px-6 py-2.5 border border-gray-200 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
      >
        Cancel
      </button>
      <button
        onClick={() => {
          setActiveEditSection(null);
        }}
        className="px-8 py-2.5 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
      >
        Save
      </button>
    </div>
  );
}
