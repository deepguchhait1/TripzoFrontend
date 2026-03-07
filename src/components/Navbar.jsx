import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import SearchSuggestions from "./SearchSuggestions";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDesktopSuggestions, setShowDesktopSuggestions] = useState(false);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  const prevPath = location.pathname;
  useEffect(() => {
    return () => setIsOpen(false);
  }, [prevPath]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/destinations", label: "Destinations" },
    { path: "/packages", label: "Packages" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Transparent on home hero, solid otherwise
  const navBg = isHome && !scrolled
    ? "bg-transparent absolute top-0 left-0 right-0"
    : scrolled
      ? "bg-white shadow-lg"
      : "bg-white/95 backdrop-blur-sm";

  const textColor = isHome && !scrolled ? "text-white" : "text-gray-700";
  const activeColor = isHome && !scrolled ? "text-emerald-300" : "text-emerald-600";
  const logoText = isHome && !scrolled ? "text-white" : "text-gray-800";

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`${isHome ? "absolute left-0 right-0" : "sticky top-0"} z-50 transition-all duration-300 ${navBg} ${
          isHome && scrolled ? "fixed! top-0 left-0 right-0" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.jpeg"
                alt="Tripzo"
                className="h-12 w-12 rounded-full object-cover ring-2 shadow-md group-hover:scale-105 transition-transform"
                style={{ '--tw-ring-color': '#00BC7D' }}
              />
              <span className={`text-2xl font-bold ${logoText} transition-colors`}>
                Trip<span className="text-emerald-500">zo</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative text-sm ${
                    isActive(link.path)
                      ? `${activeColor} ${isHome && !scrolled ? "bg-white/10" : "bg-emerald-50"}`
                      : `${textColor} ${isHome && !scrolled ? "hover:bg-white/10 hover:text-white" : "hover:text-emerald-600 hover:bg-gray-50"}`
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-emerald-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Search + CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                {searchOpen ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (searchQuery.trim()) {
                        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                        setSearchOpen(false);
                        setSearchQuery("");
                        setShowDesktopSuggestions(false);
                      }
                    }}
                    className="flex items-center"
                  >
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setShowDesktopSuggestions(true); }}
                      onFocus={() => setShowDesktopSuggestions(true)}
                      onBlur={() => { if (!searchQuery) setTimeout(() => setSearchOpen(false), 200); }}
                      placeholder="Search…"
                      className="w-56 pl-3 pr-8 py-1.5 rounded-full border border-gray-200 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 bg-white"
                    />
                    <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); setShowDesktopSuggestions(false); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10">
                      <FaTimes className="text-xs" />
                    </button>
                    <SearchSuggestions
                      query={searchQuery}
                      visible={showDesktopSuggestions}
                      onSelect={(item) => {
                        setShowDesktopSuggestions(false);
                        setSearchOpen(false);
                        setSearchQuery("");
                        navigate(item.type === "destination" ? `/destinations/${item._id}` : `/packages/${item._id}`);
                      }}
                      onClose={() => setShowDesktopSuggestions(false)}
                      variant="light"
                      className="w-80 -left-12"
                    />
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className={`p-2 rounded-full transition ${isHome && !scrolled ? "text-white/80 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-emerald-600 hover:bg-gray-100"}`}
                  >
                    <FaSearch className="text-sm" />
                  </button>
                )}
              </div>
              <Link
                to="/booking"
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-200 text-sm"
              >
                Book Now
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden text-2xl transition-colors ${
                isHome && !scrolled ? "text-white" : "text-gray-700"
              }`}
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-125 border-t border-gray-100" : "max-h-0"
          }`}
        >
          <div className="px-4 py-5 space-y-2 bg-white shadow-xl">
            {/* Mobile search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                  setIsOpen(false);
                  setSearchQuery("");
                  setShowMobileSuggestions(false);
                }
              }}
              className="relative mb-3"
            >
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowMobileSuggestions(true); }}
                    onFocus={() => setShowMobileSuggestions(true)}
                    placeholder="Search destinations, packages…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <button type="submit" className="bg-emerald-600 text-white p-2.5 rounded-xl shrink-0">
                  <FaSearch className="text-sm" />
                </button>
              </div>
              <SearchSuggestions
                query={searchQuery}
                visible={showMobileSuggestions}
                onSelect={(item) => {
                  setShowMobileSuggestions(false);
                  setIsOpen(false);
                  setSearchQuery("");
                  navigate(item.type === "destination" ? `/destinations/${item._id}` : `/packages/${item._id}`);
                }}
                onClose={() => setShowMobileSuggestions(false)}
                variant="light"
              />
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                  isActive(link.path)
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                )}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-gray-100 space-y-2">
              <Link
                to="/booking"
                className="block text-center bg-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold"
              >
                Book Now
              </Link>
            </div>
            {/* Mobile Contact Info */}
            <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-center gap-4">
              {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-emerald-100 hover:text-emerald-600 flex items-center justify-center text-gray-500 transition"
                  >
                    <Icon className="text-sm" />
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
