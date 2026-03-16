import SideMenuWhole from "../components/SideMenuComponents/SideMenuWhole";
import ProfileMenu from "../components/ProfilePageComponents/ProfileMenu";
import EditSection from "../components/ProfilePageComponents/EditSection";

export default function Profile() {
  return (
    <div className="flex flex-row">
      <div className="">
        <SideMenuWhole />
      </div>

      <h1 className="px-8 py-8 text-xl font-semibold">Settings</h1>

      <div className="flex flex-1 flex-row py-20">
        <div className="mr-10">
          <ProfileMenu />
        </div>

        <EditSection />
      </div>
    </div>
  );
}
