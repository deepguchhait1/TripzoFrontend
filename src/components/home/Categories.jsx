import { useState, useEffect } from "react";
import {
  FaLandmark,
  FaUmbrellaBeach,
  FaMountain,
  FaLeaf,
  FaPray,
  FaHiking,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { getPublicStats } from "../../services/api";

const categoryIcons = {
  heritage: FaLandmark,
  beach: FaUmbrellaBeach,
  mountain: FaMountain,
  nature: FaLeaf,
  spiritual: FaPray,
  adventure: FaHiking,
};

const categoriesData = [
  {
    id: "heritage",
    name: "Heritage & Culture",
    tagline: "Timeless wonders",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600",
    accent: "bg-amber-500",
    accentLight: "bg-amber-500/10 text-amber-600",
  },
  {
    id: "beach",
    name: "Beach & Island",
    tagline: "Sun, sand & sea",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
    accent: "bg-cyan-500",
    accentLight: "bg-cyan-500/10 text-cyan-600",
  },
  {
    id: "mountain",
    name: "Mountain & Hill",
    tagline: "Reach new heights",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600",
    accent: "bg-emerald-500",
    accentLight: "bg-emerald-500/10 text-emerald-600",
  },
  {
    id: "nature",
    name: "Nature & Wildlife",
    tagline: "Into the wild",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600",
    accent: "bg-green-500",
    accentLight: "bg-green-500/10 text-green-600",
  },
  {
    id: "spiritual",
    name: "Spiritual & Wellness",
    tagline: "Inner peace awaits",
    image: "https://t3.ftcdn.net/jpg/06/49/80/42/360_F_649804278_ykaDvgIWNOPpupfMC6snG6YsjYsa49wa.jpg",
    accent: "bg-purple-500",
    accentLight: "bg-purple-500/10 text-purple-600",
  },
  {
    id: "adventure",
    name: "Adventure & Sports",
    tagline: "Thrill & adrenaline",
    image: "https://static.toiimg.com/thumb/msid-101293795,width-748,height-499,resizemode=4,imgsize-94472/.jpg",
    accent: "bg-rose-500",
    accentLight: "bg-rose-500/10 text-rose-600",
  },
];

const Categories = () => {
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const hasCategoryData = Object.keys(categoryCounts).length > 0;

  useEffect(() => {
    getPublicStats()
      .then((res) => setCategoryCounts(res.data.categories || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !hasCategoryData) {
    return (
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative animate-pulse">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div className="space-y-4 max-w-2xl w-full">
              <div className="h-7 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-12 w-2/3 rounded-2xl bg-gray-200 dark:bg-gray-700" />
              <div className="h-6 w-5/6 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="h-6 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-5 rounded-2xl p-4 pr-6 bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div className="relative w-24 h-24 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-3/5 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-1/2 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors">
      {/* Subtle bg decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 dark:bg-emerald-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-50 dark:bg-amber-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Categories
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Explore by <span className="text-emerald-600 dark:text-emerald-400">Category</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-lg text-lg">
              Choose your travel style and find the perfect destination.
            </p>
          </div>
          <Link
            to="/destinations"
            className="group inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold hover:gap-3 transition-all shrink-0"
          >
            Browse All
            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid – 3x2 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoriesData.map((cat) => {
            const Icon = categoryIcons[cat.id];
            const count = categoryCounts[cat.id] || 0;
            return (
              <Link
                key={cat.id}
                to={`/destinations?category=${cat.id}`}
                className="group relative flex items-center gap-5 bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700/80 rounded-2xl p-4 pr-6 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-950/50 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="text-2xl text-white drop-shadow-lg" />
                  </div>
                </div>

                {/* Copy */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-0.5">{cat.tagline}</p>
                  <div className="mt-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cat.accentLight} dark:bg-white/10 dark:text-gray-300`}>
                      {count} {count === 1 ? "Tour" : "Tours"}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-emerald-500 flex items-center justify-center transition-all duration-300 shrink-0 group-hover:shadow-lg group-hover:shadow-emerald-200 dark:group-hover:shadow-emerald-900/50">
                  <FaArrowRight className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-white transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
