import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaStar,
  FaClock,
  FaCheckCircle,
  FaSearch,
  FaRupeeSign,
  FaUsers,
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaTimes,
  FaSlidersH,
  FaSortAmountDown,
} from "react-icons/fa";
import { getPackages } from "../services/api";

const ratingOptions = [
  { value: "", label: "Any Rating" },
  { value: "4.5", label: "4.5+ ★" },
  { value: "4", label: "4+ ★" },
  { value: "3.5", label: "3.5+ ★" },
  { value: "3", label: "3+ ★" },
];

const Packages = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [favorites, setFavorites] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Advanced filters
  const [minRating, setMinRating] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [maxPriceLimit, setMaxPriceLimit] = useState(200000);

  useEffect(() => {
    setLoading(true);
    getPackages()
      .then((res) => {
        setPackages(res.data);
        if (res.data.length) {
          const max = Math.max(...res.data.map((p) => p.price));
          setMaxPriceLimit(max);
          setPriceRange([0, max]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { id: "all", name: "All Packages" },
    { id: "popular", name: "Popular" },
    { id: "adventure", name: "Adventure" },
    { id: "luxury", name: "Luxury" },
    { id: "honeymoon", name: "Honeymoon" },
    { id: "budget", name: "Budget" },
    { id: "family", name: "Family" },
  ];

  const filtered = useMemo(() => {
    let result = packages.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.destinations && p.destinations.some((d) => d.toLowerCase().includes(q))) ||
        (p.highlights && p.highlights.some((h) => h.toLowerCase().includes(q))) ||
        (p.duration && p.duration.toLowerCase().includes(q));

      const matchTab = activeTab === "all" || p.category === activeTab;
      const matchRating = !minRating || p.rating >= Number(minRating);
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];

      return matchSearch && matchTab && matchRating && matchPrice;
    });

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === "discount") {
      result.sort((a, b) => {
        const discA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
        const discB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
        return discB - discA;
      });
    }

    return result;
  }, [packages, search, activeTab, minRating, priceRange, sortBy]);

  const activeFilterCount = useMemo(() => [
    activeTab !== "all",
    minRating !== "",
    priceRange[0] > 0 || priceRange[1] < maxPriceLimit,
  ].filter(Boolean).length, [activeTab, minRating, priceRange, maxPriceLimit]);

  const clearFilters = () => {
    setActiveTab("all");
    setMinRating("");
    setPriceRange([0, maxPriceLimit]);
    setSortBy("popular");
    setSearch("");
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-72 md:h-80 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600"
          alt="Tour Packages"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Tour Packages
            </h1>
            <p className="text-gray-200 text-lg max-w-xl mx-auto">
              Curated travel packages with the best deals and experiences
            </p>
            <div className="flex items-center gap-2 text-gray-300 text-sm justify-center mt-4">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-emerald-400">Packages</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* ─── Top bar ─── */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6">
            <div className="relative flex-1 max-w-lg">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search packages, destinations, highlights..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm"
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
              <div className="relative">
                <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-9 pr-8 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-gray-700 text-sm appearance-none bg-white cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="discount">Biggest Discount</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-medium text-sm transition-all ${
                  showFilters || activeFilterCount > 0
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
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

          {/* ─── Filter Panel ─── */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              showFilters ? "max-h-[500px] opacity-100 mb-8" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Minimum Rating
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm text-gray-700 bg-white"
                  >
                    {ratingOptions.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

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

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Max Price (₹)
                  </label>
                  <input
                    type="number"
                    min={priceRange[0]}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    placeholder="200000"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm text-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ─── Category Tabs ─── */}
          <div className="flex flex-wrap gap-3 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all text-sm ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Results + chips */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <p className="text-gray-500 text-sm">
              Showing <span className="font-semibold text-gray-800">{filtered.length}</span> packages
            </p>
            {search && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                Search: "{search}"
                <button onClick={() => setSearch("")}><FaTimes className="text-[9px]" /></button>
              </span>
            )}
            {minRating && (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 rounded-full">
                Rating: {minRating}+ ★
                <button onClick={() => setMinRating("")}><FaTimes className="text-[9px]" /></button>
              </span>
            )}
          </div>

          {/* ─── Package Cards ─── */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
              <p className="text-gray-400 mt-4">Loading packages...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((pkg) => (
                <div
                  key={pkg._id || pkg.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col md:flex-row"
                >
                  <div className="relative md:w-96 h-64 md:h-auto shrink-0 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                    <button
                      onClick={() => toggleFavorite(pkg._id || pkg.id)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition"
                    >
                      {favorites.includes(pkg._id || pkg.id) ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-500" />
                      )}
                    </button>
                  </div>

                  <div className="flex-1 p-6 md:p-8 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-500 text-sm" />
                          <span className="font-semibold text-gray-800">{pkg.rating}</span>
                          <span className="text-gray-400 text-sm">({pkg.reviews} reviews)</span>
                        </div>
                        <span className="capitalize text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">
                          {pkg.category}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {pkg.title}
                      </h3>

                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                        <FaMapMarkerAlt className="text-emerald-500" />
                        {pkg.destinations.join(" → ")}
                      </div>

                      <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
                        <span className="flex items-center gap-1">
                          <FaClock className="text-emerald-500" />
                          {pkg.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaUsers className="text-emerald-500" />
                          2-10 People
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {pkg.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full"
                          >
                            {h}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {pkg.included.map((item, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <FaCheckCircle className="text-emerald-500 text-xs" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                      <div>
                        <span className="text-gray-400 line-through text-sm">
                          ₹{pkg.originalPrice.toLocaleString()}
                        </span>
                        <div className="flex items-center text-emerald-600 font-bold text-2xl">
                          <FaRupeeSign className="text-lg" />
                          {pkg.price.toLocaleString()}
                        </div>
                        <span className="text-gray-500 text-xs">per person</span>
                      </div>
                      <div className="flex gap-3">
                        <Link
                          to={`/packages/${pkg._id || pkg.id}`}
                          className="border-2 border-emerald-600 text-emerald-600 px-5 py-2.5 rounded-full font-medium hover:bg-emerald-50 transition text-sm"
                        >
                          View Details
                        </Link>
                        <Link
                          to={`/booking/${pkg._id || pkg.id}`}
                          className="bg-emerald-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-emerald-700 transition text-sm"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No packages found</h3>
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

export default Packages;
