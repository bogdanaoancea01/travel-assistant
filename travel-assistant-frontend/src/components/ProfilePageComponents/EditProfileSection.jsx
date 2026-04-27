export default function EditProfileSection() {
  const profileFields = [
    {
      id: "firstName",
      label: "First name",
      type: "text",
      placeholder: "First Name",
    },
    {
      id: "lastName",
      label: "Last name",
      type: "text",
      placeholder: "Last Name",
    },
    {
      id: "username",
      label: "Username",
      type: "text",
      placeholder: "@username",
    },
    {
      id: "bio",
      label: "Bio",
      type: "textarea",
      placeholder: "Let us know you",
    },
  ];

  return (
    <div className="flex-1 max-w-3xl px-10 py-6">
      <h2 className="text-xl font-semibold">Profile</h2>

      <div className="flex items-center gap-2 mb-6 mt-6">
        <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
          B
        </div>
        <div>
          <p className="font-medium">@bogdana-oancea</p>
          <button className="text-sm text-gray-500 hover:text-black cursor-pointer">
            Change profile photo
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {profileFields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
            </label>

            {field.type === "textarea" ? (
              <textarea
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm h-40 resize-none"
                placeholder={field.placeholder}
              />
            ) : (
              <input
                type={field.type}
                placeholder={field.placeholder}
                className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm"
              />
            )}
          </div>
        ))}
      </div>

      <button className="bg-black text-white mt-6 px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition cursor-pointer">
        Save
      </button>
    </div>
  );
}
