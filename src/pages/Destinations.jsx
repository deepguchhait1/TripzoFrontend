import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
  FaClock,
  FaRupeeSign,
  FaLandmark,
  FaUmbrellaBeach,
  FaMountain,
  FaLeaf,
  FaPray,
  FaHiking,
  FaTimes,
  FaSlidersH,
  FaChevronDown,
  FaSortAmountDown,
} from "react-icons/fa";
import { getDestinations, getDestinationStates } from "../services/api";

const categoryIcons = {
  heritage: FaLandmark,
  beach: FaUmbrellaBeach,
  mountain: FaMountain,
  nature: FaLeaf,
  spiritual: FaPray,
  adventure: FaHiking,
};

const categories = [
  { id: "all", name: "All" },
  { id: "heritage", name: "Heritage" },
  { id: "beach", name: "Beach" },
  { id: "mountain", name: "Mountain" },
  { id: "nature", name: "Nature" },
  { id: "spiritual", name: "Spiritual" },
  { id: "adventure", name: "Adventure" },
];

const ratingOptions = [
  { value: "", label: "Any Rating" },
  { value: "4.5", label: "4.5+ ★" },
  { value: "4", label: "4+ ★" },
  { value: "3.5", label: "3.5+ ★" },
  { value: "3", label: "3+ ★" },
];

const Destinations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [states, setStates] = useState([]);

  // Advanced filters
  const [selectedState, setSelectedState] = useState("all");
  const [minRating, setMinRating] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [maxPriceLimit, setMaxPriceLimit] = useState(100000);

  // Fetch states list
  useEffect(() => {
    getDestinationStates()
      .then((res) => setStates(res.data))
      .catch(() => {});
  }, []);

  // Fetch destinations
  useEffect(() => {
    setLoading(true);
    getDestinations()
      .then((res) => {
        setDestinations(res.data);
        if (res.data.length) {
          const max = Math.max(...res.data.map((d) => d.price));
          setMaxPriceLimit(max);
          setPriceRange([0, max]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Client-side filtering
  const filtered = useMemo(() => {
    let result = destinations.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        (d.duration && d.duration.toLowerCase().includes(q));

      const matchCategory =
        activeCategory === "all" || d.category === activeCategory;

      const matchState =
        selectedState === "all" ||
        d.state.toLowerCase() === selectedState.toLowerCase();

      const matchRating = !minRating || d.rating >= Number(minRating);

      const matchPrice =
        d.price >= priceRange[0] && d.price <= priceRange[1];

      return matchSearch && matchCategory && matchState && matchRating && matchPrice;
    });

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else result.sort((a, b) => b.reviews - a.reviews);

    return result;
  }, [destinations, search, activeCategory, selectedState, minRating, priceRange, sortBy]);

  // Count active filters
  const activeFilterCount = useMemo(() => [
    activeCategory !== "all",
    selectedState !== "all",
    minRating !== "",
    priceRange[0] > 0 || priceRange[1] < maxPriceLimit,
  ].filter(Boolean).length, [activeCategory, selectedState, minRating, priceRange, maxPriceLimit]);

  const clearFilters = () => {
    setActiveCategory("all");
    setSelectedState("all");
    setMinRating("");
    setPriceRange([0, maxPriceLimit]);
    setSortBy("popular");
    setSearch("");
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-72 md:h-80 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600"
          alt="Destinations"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Explore Destinations
            </h1>
            <p className="text-gray-200 text-lg max-w-xl mx-auto">
              Discover the most beautiful places across incredible India
            </p>
            <div className="flex items-center gap-2 text-gray-300 text-sm justify-center mt-4">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-emerald-400">Destinations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          {/* ─── Top bar: search + sort + filter toggle ─── */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, state, category..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/50 outline-none transition text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="relative">
                <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-9 pr-8 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-gray-700 dark:text-gray-200 text-sm appearance-none bg-white dark:bg-gray-800 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-medium text-sm transition-all ${
                  showFilters || activeFilterCount > 0
                    ? "bg-emerald-50 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500"
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
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* ─── Expandable Filter Panel ─── */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              showFilters ? "max-h-[500px] opacity-100 mb-8" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* State filter */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    State
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
                  >
                    <option value="all">All States</option>
                    {states.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Rating filter */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Minimum Rating
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
                  >
                    {ratingOptions.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                {/* Min price */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Min Price (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm text-gray-700"
                  />
                </div>

                {/* Max price */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Max Price (₹)
                  </label>
                  <input
                    type="number"
                    min={priceRange[0]}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    placeholder="100000"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm text-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ─── Category Tabs ─── */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.id];
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all text-sm ${
                    activeCategory === cat.id
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {Icon && <Icon />}
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Results Count + Active filter chips */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <p className="text-gray-500 text-sm">
              Showing <span className="font-semibold text-gray-800">{filtered.length}</span> destinations
            </p>
            {search && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                Search: "{search}"
                <button onClick={() => setSearch("")}><FaTimes className="text-[9px]" /></button>
              </span>
            )}
            {selectedState !== "all" && (
              <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
                State: {selectedState}
                <button onClick={() => setSelectedState("all")}><FaTimes className="text-[9px]" /></button>
              </span>
            )}
            {minRating && (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 rounded-full">
                Rating: {minRating}+ ★
                <button onClick={() => setMinRating("")}><FaTimes className="text-[9px]" /></button>
              </span>
            )}
          </div>

          {/* ─── Grid ─── */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
              <p className="text-gray-400 mt-4">Loading destinations...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((dest) => (
                <Link
                  to={`/destinations/${dest._id || dest.id}`}
                  key={dest._id || dest.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-gray-700"
                >
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      <FaStar className="text-yellow-500 text-xs" />
                      <span className="text-sm font-semibold">{dest.rating}</span>
                    </div>
                    <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full capitalize">
                      {dest.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                      {dest.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <FaMapMarkerAlt className="text-emerald-500 text-xs" />
                      {dest.state}
                    </div>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                      {dest.description}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-3">
                      <span className="flex items-center gap-1">
                        <FaClock className="text-emerald-500 text-xs" />
                        {dest.duration}
                      </span>
                      {dest.reviews > 0 && (
                        <span className="text-gray-400 text-xs">
                          ({dest.reviews} reviews)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-emerald-600 font-bold text-lg">
                        <FaRupeeSign className="text-sm" />
                        {dest.price.toLocaleString()}
                        <span className="text-gray-400 text-xs font-normal ml-1">/ person</span>
                      </div>
                      <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full font-medium text-sm hover:bg-emerald-600 hover:text-white transition-all">
                        Explore
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No destinations found</h3>
              <p className="text-gray-400 text-lg mb-6">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition text-sm"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Destinations;
