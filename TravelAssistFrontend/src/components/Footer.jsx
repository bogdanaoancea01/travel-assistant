export function Footer({ brand, icons, onNavigate }) {
  const { Globe } = icons;

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-linear-to-br from-pink-400 via-orange-400 to-yellow-300 p-2 rounded-xl">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span>{brand}</span>
            </div>
            <p className="text-gray-400 text-sm">
              AI-powered travel planning for the modern explorer.
            </p>
          </div>

          <FooterColumn title="Product">
            <li><button className="hover:text-white transition-colors">How it Works</button></li>
            <li><button className="hover:text-white transition-colors">Features</button></li>
            <li><button className="hover:text-white transition-colors">Pricing</button></li>
            <li>
              <button onClick={() => onNavigate('explore')} className="hover:text-white transition-colors">
                Explore
              </button>
            </li>
          </FooterColumn>

          <FooterColumn title="Company">
            <li><button className="hover:text-white transition-colors">About Us</button></li>
            <li><button className="hover:text-white transition-colors">Careers</button></li>
            <li><button className="hover:text-white transition-colors">Blog</button></li>
            <li><button className="hover:text-white transition-colors">Contact</button></li>
          </FooterColumn>

          <FooterColumn title="Legal">
            <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
            <li><button className="hover:text-white transition-colors">Terms of Service</button></li>
            <li><button className="hover:text-white transition-colors">Cookie Policy</button></li>
          </FooterColumn>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© 2026 {brand}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <h4 className="mb-4">{title}</h4>
      <ul className="space-y-2 text-sm text-gray-400">{children}</ul>
    </div>
  );
}