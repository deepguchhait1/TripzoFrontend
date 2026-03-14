import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaSearch,
  FaClock,
  FaRupeeSign,
  FaTimes,
  FaSlidersH,
  FaSortAmountDown,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";
import { globalSearch } from "../services/api";
import SearchSuggestions from "../components/SearchSuggestions";

const ratingOptions = [
  { value: "", label: "Any Rating" },
  { value: "4.5", label: "4.5+ ★" },
  { value: "4", label: "4+ ★" },
  { value: "3.5", label: "3.5+ ★" },
  { value: "3", label: "3+ ★" },
];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBoxRef = useRef(null);

  // Run search
  const doSearch = (q) => {
    if (!q.trim()) {
      setDestinations([]);
      setPackages([]);
      return;
    }
    setLoading(true);
    const params = { q: q.trim() };
    if (activeTab !== "all") params.type = activeTab;
    if (sortBy) params.sort = sortBy;
    if (minRating) params.minRating = minRating;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    globalSearch(params)
      .then((res) => {
        setDestinations(res.data.destinations || []);
        setPackages(res.data.packages || []);
      })
      .catch(() => {
        setDestinations([]);
        setPackages([]);
      })
      .finally(() => setLoading(false));
  };

  // Search on mount and when filters change
  useEffect(() => {
    doSearch(query);
  }, [activeTab, sortBy, minRating, minPrice, maxPrice]);

  // Search on query param change
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== query) setQuery(q);
    doSearch(q);
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    setSearchParams({ q: query });
    doSearch(query);
  };

  const handleSuggestionSelect = (item) => {
    setShowSuggestions(false);
    const path = item.type === "destination" ? `/destinations/${item._id}` : `/packages/${item._id}`;
    navigate(path);
  };

  const totalResults = useMemo(() => destinations.length + packages.length, [destinations, packages]);

  const activeFilterCount = useMemo(() => [
    minRating !== "",
    minPrice !== "",
    maxPrice !== "",
  ].filter(Boolean).length, [minRating, minPrice, maxPrice]);

  const clearFilters = () => {
    setMinRating("");
    setMinPrice("");
    setMaxPrice("");
    setActiveTab("all");
    setSortBy("rating");
  };

  return (
    <>
      {/* Header */}
      <section className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          <p className="text-gray-500 mb-6">
            {initialQuery
              ? <>Showing results for "<span className="font-semibold text-gray-800">{initialQuery}</span>"</>
              : "Search across all destinations and packages"}
          </p>

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div ref={searchBoxRef} className="relative flex items-center">
              <FaSearch className="absolute left-4 text-gray-400 z-10" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search destinations, packages, states, ratings..."
                className="w-full pl-11 pr-24 py-3.5 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); setSearchParams({}); setDestinations([]); setPackages([]); setShowSuggestions(false); }}
                  className="absolute right-20 text-gray-400 hover:text-gray-600 z-10"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl font-medium text-sm transition z-10"
              >
                Search
              </button>
              <SearchSuggestions
                query={query}
                visible={showSuggestions}
                onSelect={handleSuggestionSelect}
                onClose={() => setShowSuggestions(false)}
                variant="light"
              />
            </div>
          </form>
        </div>
      </section>

      {/* Main */}
      <section className="py-8 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6">
            {/* Type tabs */}
            <div className="flex items-center gap-2">
              {[
                { id: "all", label: "All", count: totalResults },
                { id: "destinations", label: "Destinations", count: destinations.length },
                { id: "packages", label: "Packages", count: packages.length },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === t.id
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t.label}
                  <span className="ml-1.5 text-xs opacity-70">({t.count})</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-gray-700 text-sm appearance-none bg-white"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all ${
                  showFilters || activeFilterCount > 0
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                <FaSlidersH className="text-xs" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium">
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter panel */}
          <div className={`overflow-hidden transition-all duration-300 ${showFilters ? "max-h-[300px] opacity-100 mb-6" : "max-h-0 opacity-0"}`}>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Min Rating</label>
                  <select value={minRating} onChange={(e) => setMinRating(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm bg-white">
                    {ratingOptions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Min Price (₹)</label>
                  <input type="number" min={0} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Max Price (₹)</label>
                  <input type="number" min={0} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Any" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
              <p className="text-gray-400 mt-4">Searching...</p>
            </div>
          )}

          {/* No results */}
          {!loading && totalResults === 0 && initialQuery && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No results found</h3>
              <p className="text-gray-400 mb-6">Try different keywords or adjust your filters</p>
              <div className="flex justify-center gap-3">
                <Link to="/destinations" className="px-5 py-2.5 bg-emerald-600 text-white rounded-full font-medium text-sm hover:bg-emerald-700 transition">
                  Browse Destinations
                </Link>
                <Link to="/packages" className="px-5 py-2.5 border-2 border-emerald-600 text-emerald-600 rounded-full font-medium text-sm hover:bg-emerald-50 transition">
                  Browse Packages
                </Link>
              </div>
            </div>
          )}

          {/* Destination results */}
          {!loading && (activeTab === "all" || activeTab === "destinations") && destinations.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Destinations
                  <span className="text-sm font-normal text-gray-400 ml-2">({destinations.length})</span>
                </h2>
                {activeTab === "all" && destinations.length > 4 && (
                  <button onClick={() => setActiveTab("destinations")} className="text-emerald-600 text-sm font-medium hover:underline">
                    View all →
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(activeTab === "all" ? destinations.slice(0, 4) : destinations).map((dest) => (
                  <Link
                    to={`/destinations/${dest._id}`}
                    key={dest._id}
                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-gray-700"
                  >
                    <div className="relative overflow-hidden h-48">
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        <FaStar className="text-yellow-500 text-[10px]" />
                        <span className="text-xs font-semibold">{dest.rating}</span>
                      </div>
                      <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize">
                        {dest.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">{dest.name}</h3>
                      <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                        <FaMapMarkerAlt className="text-emerald-500 text-[10px]" />
                        {dest.state}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-emerald-600 font-bold flex items-center">
                          <FaRupeeSign className="text-xs" />{dest.price.toLocaleString()}
                          <span className="text-gray-400 text-[10px] font-normal ml-1">/person</span>
                        </span>
                        <span className="text-xs flex items-center gap-1 text-gray-400">
                          <FaClock className="text-[10px]" /> {dest.duration}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Package results */}
          {!loading && (activeTab === "all" || activeTab === "packages") && packages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Packages
                  <span className="text-sm font-normal text-gray-400 ml-2">({packages.length})</span>
                </h2>
                {activeTab === "all" && packages.length > 3 && (
                  <button onClick={() => setActiveTab("packages")} className="text-emerald-600 text-sm font-medium hover:underline">
                    View all →
                  </button>
                )}
              </div>
              <div className="space-y-5">
                {(activeTab === "all" ? packages.slice(0, 3) : packages).map((pkg) => (
                  <div key={pkg._id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row">
                    <div className="relative md:w-80 h-52 md:h-auto shrink-0 overflow-hidden">
                      <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      {pkg.originalPrice > pkg.price && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                          {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                    <div className="flex-1 p-5 md:p-6 flex flex-col">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-500 text-xs" />
                            <span className="font-semibold text-gray-800 text-sm">{pkg.rating}</span>
                            <span className="text-gray-400 text-xs">({pkg.reviews})</span>
                          </div>
                          <span className="capitalize text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium">
                            {pkg.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{pkg.title}</h3>
                        <p className="text-gray-500 text-xs flex items-center gap-1.5 mb-2">
                          <FaMapMarkerAlt className="text-emerald-500" />
                          {pkg.destinations.join(" → ")}
                        </p>
                        <div className="flex items-center gap-3 text-gray-500 text-xs mb-3">
                          <span className="flex items-center gap-1"><FaClock className="text-emerald-500" /> {pkg.duration}</span>
                          <span className="flex items-center gap-1"><FaUsers className="text-emerald-500" /> 2-10</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {pkg.highlights.slice(0, 4).map((h, i) => (
                            <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{h}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div>
                          {pkg.originalPrice > pkg.price && (
                            <span className="text-gray-400 line-through text-xs">₹{pkg.originalPrice.toLocaleString()}</span>
                          )}
                          <div className="flex items-center text-emerald-600 font-bold text-xl">
                            <FaRupeeSign className="text-sm" />{pkg.price.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/packages/${pkg._id}`} className="border border-emerald-600 text-emerald-600 px-4 py-2 rounded-full font-medium text-xs hover:bg-emerald-50 transition">Details</Link>
                          <Link to={`/booking/${pkg._id}`} className="bg-emerald-600 text-white px-4 py-2 rounded-full font-medium text-xs hover:bg-emerald-700 transition">Book Now</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SearchResults;
