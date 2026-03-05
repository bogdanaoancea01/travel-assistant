export default function FooterLinks() {
  return (
    <div>
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <a href="#" className="hover:underline">
          Company
        </a>
        <span>·</span>
        <a href="#" className="hover:underline">
          Contact
        </a>
        <span>·</span>
        <a href="#" className="hover:underline">
          Help
        </a>
      </div>
      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
        <a href="#" className="hover:underline">
          Terms
        </a>
        <span>·</span>
        <a href="#" className="hover:underline">
          Privacy
        </a>
      </div>
      <p className="mt-4 text-xs text-gray-400">© TravelAI, Inc</p>
    </div>
  );
}
