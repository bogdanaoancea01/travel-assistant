import { useState } from "react";
import EditInputForAddress from "./EditInputForAddress";
import ButtonsForEdit from "./ButtonsForEdit";

export default function EditAccountSection() {
  const [activeEditSection, setActiveEditSection] = useState(null);

  const accountFields = [
    {
      id: "email",
      header: "Email",
      description: "Add your email",
      isChanged: null,
    },
    {
      id: "password",
      header: "Password",
      description: "Password updates",
      isChanged: true,
    },
    {
      id: "phone",
      header: "Phone",
      description:
        "Add mobile phone number for notifications and profile verification",
      isChanged: false,
    },
    {
      id: "address",
      header: "Address",
      description: "Add your full address",
      isChanged: false,
    },
    {
      id: "language",
      header: "Language",
      description: "Add your prefered language",
      isChanged: false,
    },
    {
      id: "currency",
      header: "Currency",
      description: "Add your prefered currency",
      isChanged: false,
    },
  ];

  const renderActiveForm = () => {
    switch (activeEditSection) {
      case "address":
        return (
          <EditInputForAddress onCancel={() => setActiveEditSection(null)} />
        );
      case "phone":
        return (
          <input
            key="phone"
            type="text"
            placeholder="Phone Number"
            className="mt-4 mb-4 px-20 py-3 border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all"
          />
        );
      case "timezone":
        return null;
      case "marketing":
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl px-10 py-6">
      <h2 className="text-xl font-semibold mb-10">Your account</h2>
      <div className="space-y-6 mb-10">
        {accountFields.map((field) => (
          <div
            key={field.id}
            className="flex items-center justify-between py-2"
          >
            <div key={field.id}>
              <h3 className="text-base font-semibold text-gray-900">
                {field.header}
              </h3>
              {field.header !== "Email" && activeEditSection === field.id ? (
                <div>
                  {renderActiveForm()}
                  <ButtonsForEdit setActiveEditSection={setActiveEditSection} />
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-1">
                  {field.description}
                  {field.header === "Email" && (
                    <span className="text-emerald-600 ml-1 text-xs">
                      (verified)
                    </span>
                  )}
                </p>
              )}
            </div>
            {field.header !== "Email" && activeEditSection !== field.id && (
              <button
                className="px-4 py-1.5 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => {
                  setActiveEditSection(field.id);
                }}
              >
                {/* if value is changed => the button should be "Change" */}
                {field.isChanged ? "Change" : "Add"}
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 pt-8">
        <button className="text-red-500 font-semibold hover:underline transition-all cursor-pointer">
          Delete my account
        </button>
        <p className="text-gray-500 text-sm mt-1">
          Permanently delete the account and remove access to my data.
        </p>
      </div>
    </div>
  );
}
