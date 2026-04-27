import { useState } from "react";
import ButtonsForEdit from "./ButtonsForEdit";

export default function TravelPreferenceSection() {
  const [activeEditSection, setActiveEditSection] = useState(null);

  const accountFields = [
    {
      id: "airport",
      header: "Airport",
      description: "Choose your home airport",
      isChanged: null,
    },
    {
      id: "flight",
      header: "Flight preference",
      description: "Enter your flight preferences",
      isChanged: false,
    },
    {
      id: "seat",
      header: "Seat preference",
      description: "Enter your preffered seat",
      isChanged: true,
    },
    {
      id: "accomodation",
      header: "Accomodation preference",
      description: "Enter your accommodation preferences",
      isChanged: false,
    },
    {
      id: "meals",
      header: "Meals preference",
      description: "Choose your dining plan.",
      isChanged: false,
    },
  ];

  const renderActiveForm = () => {
    switch (activeEditSection) {
      case "airport":
        return null;
      case "flight":
        return null;
      case "seat":
        return null;
      case "accomodation":
        return null;
      case "meals":
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
    </div>
  );
}
