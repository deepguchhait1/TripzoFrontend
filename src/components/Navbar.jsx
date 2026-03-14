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
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import SearchSuggestions from "./SearchSuggestions";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
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

  // Transparent on home hero, solid otherwise; dark mode support
  const navBg = isHome && !scrolled
    ? "bg-transparent absolute top-0 left-0 right-0"
    : scrolled
      ? "bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-950/50"
      : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm";

  const textColor = isHome && !scrolled ? "text-white" : "text-gray-700 dark:text-gray-200";
  const activeColor = isHome && !scrolled ? "text-emerald-300" : "text-emerald-600 dark:text-emerald-400";
  const logoText = isHome && !scrolled ? "text-white" : "text-gray-800 dark:text-white";

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
                      ? `${activeColor} ${isHome && !scrolled ? "bg-white/10" : "bg-emerald-50 dark:bg-emerald-900/30"}`
                      : `${textColor} ${isHome && !scrolled ? "hover:bg-white/10 hover:text-white" : "hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-emerald-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Search + Theme + CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                className={`p-2 rounded-full transition ${
                  isHome && !scrolled
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {theme === "light" ? (
                  <HiOutlineMoon className="text-lg" />
                ) : (
                  <HiOutlineSun className="text-lg" />
                )}
              </button>
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
                      className="w-56 pl-3 pr-8 py-1.5 rounded-full border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 dark:focus:ring-emerald-900 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); setShowDesktopSuggestions(false); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 z-10">
                      <FaTimes className="text-xs" />
                    </button>
                    <SearchSuggestions
                      query={searchQuery}
                      visible={showDesktopSuggestions}
                      variant={theme === "dark" ? "dark" : "light"}
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
                    className={`p-2 rounded-full transition ${
                      isHome && !scrolled
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <FaSearch className="text-sm" />
                  </button>
                )}
              </div>
              <Link
                to="/booking"
                className="bg-emerald-600 dark:bg-emerald-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-200 dark:shadow-emerald-900/30 text-sm"
              >
                Book Now
              </Link>
            </div>

            {/* Mobile: Theme + Menu Toggle */}
            <div className="md:hidden flex items-center gap-1">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                className={`p-2 rounded-full transition ${
                  isHome && !scrolled ? "text-white/80 hover:text-white hover:bg-white/10" : "text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                }`}
              >
                {theme === "light" ? <HiOutlineMoon className="text-lg" /> : <HiOutlineSun className="text-lg" />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`text-2xl transition-colors ${
                  isHome && !scrolled ? "text-white" : "text-gray-700 dark:text-gray-200"
                }`}
              >
                {isOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-125 border-t border-gray-100 dark:border-gray-700" : "max-h-0"
          }`}
        >
          <div className="px-4 py-5 space-y-2 bg-white dark:bg-gray-900 shadow-xl dark:shadow-gray-950/50">
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
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm outline-none focus:border-emerald-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                <button type="submit" className="bg-emerald-600 text-white p-2.5 rounded-xl shrink-0">
                  <FaSearch className="text-sm" />
                </button>
              </div>
              <SearchSuggestions
                query={searchQuery}
                visible={showMobileSuggestions}
                variant={theme === "dark" ? "dark" : "light"}
                onSelect={(item) => {
                  setShowMobileSuggestions(false);
                  setIsOpen(false);
                  setSearchQuery("");
                  navigate(item.type === "destination" ? `/destinations/${item._id}` : `/packages/${item._id}`);
                }}
                onClose={() => setShowMobileSuggestions(false)}
              />
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                  isActive(link.path)
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                )}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-gray-100 dark:border-gray-700 space-y-2">
              <Link
                to="/booking"
                className="block text-center bg-emerald-600 dark:bg-emerald-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-emerald-700 dark:hover:bg-emerald-600"
              >
                Book Now
              </Link>
            </div>
            {/* Mobile Contact Info */}
            <div className="pt-3 mt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-4">
              {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center text-gray-500 dark:text-gray-400 transition"
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
