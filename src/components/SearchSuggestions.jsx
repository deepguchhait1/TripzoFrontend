import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaBoxOpen, FaRupeeSign, FaSearch } from "react-icons/fa";
import { getSearchSuggestions } from "../services/api";

/**
 * Reusable search-suggestions dropdown.
 *
 * Props:
 *  - query        : string   (current input value)
 *  - onSelect     : (suggestion) => void  (called when user clicks a suggestion — optional, defaults to navigate)
 *  - visible      : bool     (parent controls mount — true when input is focused)
 *  - onClose      : () => void
 *  - className    : string   (extra wrapper classes)
 *  - variant      : "light" | "dark"  (light = white bg, dark = glassmorphism)
 */
const SearchSuggestions = ({
  query,
  onSelect,
  visible,
  onClose,
  className = "",
  variant = "light",
}) => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // Debounced fetch
  const fetchSuggestions = useCallback((q) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q || q.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      getSearchSuggestions(q.trim())
        .then((res) => {
          setSuggestions(res.data.suggestions || []);
          setActiveIdx(-1);
        })
        .catch(() => setSuggestions([]))
        .finally(() => setLoading(false));
    }, 250);
  }, []);

  useEffect(() => {
    fetchSuggestions(query);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchSuggestions]);

  // Click outside to close
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    if (visible) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [visible, onClose]);

  const handleClick = (item) => {
    if (onSelect) {
      onSelect(item);
    } else {
      const path =
        item.type === "destination"
          ? `/destinations/${item._id}`
          : `/packages/${item._id}`;
      navigate(path);
    }
    onClose?.();
  };

  const handleViewAll = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    onClose?.();
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!visible || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((prev) => (prev < suggestions.length) ? prev + 1 : 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((prev) => (prev > 0 ? prev - 1 : suggestions.length));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      if (activeIdx === suggestions.length) {
        handleViewAll();
      } else {
        handleClick(suggestions[activeIdx]);
      }
    } else if (e.key === "Escape") {
      onClose?.();
    }
  };

  if (!visible || (suggestions.length === 0 && !loading && (!query || query.trim().length < 2))) {
    return null;
  }

  const isDark = variant === "dark";

  return (
    <div
      ref={wrapperRef}
      onKeyDown={handleKeyDown}
      className={`absolute left-0 right-0 top-full mt-2 z-[100] rounded-2xl overflow-hidden shadow-2xl border ${
        isDark
          ? "bg-gray-900/90 backdrop-blur-2xl border-white/10"
          : "bg-white border-gray-100"
      } ${className}`}
    >
      {/* Loading */}
      {loading && suggestions.length === 0 && (
        <div className="px-4 py-6 text-center">
          <div
            className={`animate-spin h-5 w-5 border-2 rounded-full mx-auto ${
              isDark ? "border-emerald-400 border-t-transparent" : "border-emerald-500 border-t-transparent"
            }`}
          />
          <p className={`text-xs mt-2 ${isDark ? "text-white/40" : "text-gray-400"}`}>
            Finding suggestions...
          </p>
        </div>
      )}

      {/* Suggestions list */}
      {suggestions.length > 0 && (
        <div className="max-h-[360px] overflow-y-auto">
          {suggestions.map((item, idx) => (
            <button
              key={`${item.type}-${item._id}`}
              onClick={() => handleClick(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                activeIdx === idx
                  ? isDark
                    ? "bg-white/10"
                    : "bg-emerald-50"
                  : isDark
                  ? "hover:bg-white/[0.06]"
                  : "hover:bg-gray-50"
              } ${idx > 0 ? (isDark ? "border-t border-white/[0.05]" : "border-t border-gray-50") : ""}`}
            >
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-200">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      isDark ? "bg-white/10" : "bg-gray-100"
                    }`}
                  >
                    {item.type === "destination" ? (
                      <FaMapMarkerAlt className="text-emerald-500 text-sm" />
                    ) : (
                      <FaBoxOpen className="text-emerald-500 text-sm" />
                    )}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-semibold text-sm truncate ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.title}
                  </span>
                  <span
                    className={`shrink-0 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                      item.type === "destination"
                        ? isDark
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-emerald-100 text-emerald-700"
                        : isDark
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.type === "destination" ? "Dest" : "Pkg"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  {item.subtitle && (
                    <span
                      className={`text-xs truncate ${
                        isDark ? "text-white/40" : "text-gray-400"
                      }`}
                    >
                      {item.subtitle}
                    </span>
                  )}
                  {item.rating > 0 && (
                    <span className="flex items-center gap-0.5 text-xs shrink-0">
                      <FaStar className="text-yellow-500 text-[9px]" />
                      <span className={isDark ? "text-white/50" : "text-gray-500"}>
                        {item.rating}
                      </span>
                    </span>
                  )}
                  {item.price > 0 && (
                    <span
                      className={`flex items-center text-xs shrink-0 font-medium ${
                        isDark ? "text-emerald-300" : "text-emerald-600"
                      }`}
                    >
                      <FaRupeeSign className="text-[8px]" />
                      {item.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}

          {/* View all results */}
          {query.trim().length >= 2 && (
            <button
              onClick={handleViewAll}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 font-medium text-sm transition-colors ${
                activeIdx === suggestions.length
                  ? isDark
                    ? "bg-white/10 text-emerald-300"
                    : "bg-emerald-50 text-emerald-700"
                  : isDark
                  ? "text-emerald-400 hover:bg-white/[0.06]"
                  : "text-emerald-600 hover:bg-gray-50"
              } ${isDark ? "border-t border-white/[0.05]" : "border-t border-gray-100"}`}
            >
              <FaSearch className="text-[10px]" />
              View all results for "{query.trim()}"
            </button>
          )}
        </div>
      )}

      {/* No suggestions */}
      {!loading && suggestions.length === 0 && query.trim().length >= 2 && (
        <div className="px-4 py-6 text-center">
          <p className={`text-sm ${isDark ? "text-white/40" : "text-gray-400"}`}>
            No suggestions found
          </p>
          <p className={`text-xs mt-1 ${isDark ? "text-white/25" : "text-gray-300"}`}>
            Press Enter to search anyway
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
