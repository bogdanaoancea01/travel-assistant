import SideMenuWhole from "../components/SideMenuComponents/SideMenuWhole";
import ProfileMenu from "../components/ProfilePageComponents/ProfileMenu";
import EditProfileSection from "../components/ProfilePageComponents/EditProfileSection";
import EditAccountSection from "../components/ProfilePageComponents/EditAccountSection";
import TravelPreferenceSection from "../components/ProfilePageComponents/TravelPreferenceSection";
import { useState } from "react";

export default function EditProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const sections = {
    profile: <EditProfileSection />,
    account: <EditAccountSection />,
    travel: <TravelPreferenceSection />,
    notifications: <div>Notification Settings Content</div>,
    cookies: <div>Cookie Preferences Content</div>,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenuWhole />

      <div className="flex flex-1 flex-col ">
        <header className="border-b border-gray-200 px-8 py-6">
          <h1 className="text-xl font-semibold text-gray-800">Settings</h1>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="px-30 py-10">
            <ProfileMenu active={activeTab} setActive={setActiveTab} />
          </div>

          <div className="flex-1 overflow-y-auto py-8 pr-8 ">
            {sections[activeTab] || <EditProfileSection />}
          </div>
        </div>
      </div>
    </div>
  );
}
