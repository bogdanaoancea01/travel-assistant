export default function FooterLinks() {
  return (
    <div className="mt-3 space-y-1">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-400">
        <a href="#" className="hover:text-gray-600 transition-colors">Company</a>
        <span>·</span>
        <a href="#" className="hover:text-gray-600 transition-colors">Contact</a>
        <span>·</span>
        <a href="#" className="hover:text-gray-600 transition-colors">Help</a>
        <span>·</span>
        <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
        <span>·</span>
        <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
      </div>
      <p className="text-xs text-gray-300">© 2026 Meridian, Inc.</p>
    </div>
  );
}
