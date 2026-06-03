import SideMenuWhole from "../components/SideMenuComponents/SideMenuWhole";
import SettingsPage from "../components/ProfilePageComponents/SettingsPage";

export default function EditProfile() {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenuWhole />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-gray-100 px-10 py-5 shrink-0">
          <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
        </header>
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-10 py-8">
            <SettingsPage />
          </div>
        </div>
      </div>
    </div>
  );
}