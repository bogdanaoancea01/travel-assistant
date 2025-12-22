export default function NavBar({
  brand = "AI travel assistant",
  mobileMenuOpen = false,
  onToggleMobileMenu = () => {},
  onNavigate = () => {},
  icons = {},
}) {
  const { Globe, Menu, X } = icons;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo brand={brand} Globe={Globe} />

          <DesktopNav onNavigate={onNavigate} />

          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              X ? <X className="w-6 h-6" /> : <span>✕</span>
            ) : (
              Menu ? <Menu className="w-6 h-6" /> : <span>☰</span>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && <MobileNav onNavigate={onNavigate} />}
    </nav>
  );
}

function Logo({ brand, Globe }) {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-linear-to-br from-pink-400 via-orange-400 to-yellow-300 p-2 rounded-xl">
        {Globe ? <Globe className="w-5 h-5 text-white" /> : null}
      </div>
      <span className="text-gray-900">{brand}</span>
    </div>
  );
}

function DesktopNav({ onNavigate }) {
  return (
    <div className="hidden md:flex items-center gap-8">
      <button 
        onClick={() => onNavigate("home")}
        className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
          
        Home
      </button>
      <button
        onClick={() => onNavigate("explore")}
        className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
      >
        Explore
      </button>
      <button
        onClick={() => onNavigate("newTrip")}
        className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
      >
        Get Started
      </button>
      <button
        onClick={() => onNavigate("signin")}
        className="bg-linear-to-r from-pink-500 to-orange-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
      >
        Sign In
      </button>
    </div>
  );
}

function MobileNav({ onNavigate }) {
  return (
    <div className="md:hidden bg-white border-t border-gray-200">
      <div className="px-4 py-4 space-y-3">
        <button 
          onClick={() => onNavigate("home")}
          className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
          
          Home
        </button>
        <button
          onClick={() => onNavigate("explore")}
          className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
        >
          Explore
        </button>
        <button
          onClick={() => onNavigate("newTrip")}
          className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
        >
          Get Started
        </button>
        <button
          onClick={() => onNavigate("signin")}
          className="block w-full bg-linear-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
