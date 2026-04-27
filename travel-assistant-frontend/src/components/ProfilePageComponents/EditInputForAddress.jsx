export default function EditInputForAddress() {
  const inputFields = [
    { id: "street", placeholder: "Street address" },
    { id: "details", placeholder: "Apt/Suite/Other" },
    { id: "country", placeholder: "Country" },
    { id: "state", placeholder: "State" },
    { id: "city", placeholder: "City" },
  ];

  return (
    <div className="flex-row mt-4">
      {inputFields.map((field) => (
        <input
          key={field.id}
          type="text"
          placeholder={field.placeholder}
          className="mb-4 px-8 py-3 border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all"
        />
      ))}
    </div>
  );
}
