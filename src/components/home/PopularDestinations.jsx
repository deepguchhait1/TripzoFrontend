import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaArrowRight, FaClock } from "react-icons/fa";
import { getDestinations } from "../../services/api";

const PopularDestinations = () => {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDestinations({ limit: 7 })
      .then((res) => setPopular(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-gray-50/60 dark:bg-gray-900/80">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      </section>
    );
  }

  if (popular.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50/60 dark:bg-gray-900/80 relative overflow-hidden transition-colors">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-0 w-80 h-80 bg-emerald-100 dark:bg-emerald-900/30 rounded-full blur-3xl opacity-40 -translate-x-1/2" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-cyan-100 dark:bg-cyan-900/20 rounded-full blur-3xl opacity-30 translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Explore India
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Popular <span className="text-emerald-600 dark:text-emerald-400">Destinations</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-lg text-lg">
              The most sought-after destinations from majestic forts to serene beaches.
            </p>
          </div>
          <Link
            to="/destinations"
            className="group inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-800 text-white px-7 py-3.5 rounded-2xl font-semibold hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all duration-300 shrink-0 hover:shadow-xl hover:shadow-emerald-200 dark:hover:shadow-emerald-900/30"
          >
            View All
            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[320px]">
          {popular.map((dest, i) => {
            const isLarge = i === 0 || i === 3;
            return (
              <Link
                to={`/destinations/${dest._id || dest.id}`}
                key={dest._id || dest.id}
                className={`group relative rounded-3xl overflow-hidden cursor-pointer ${
                  isLarge ? "sm:col-span-2 sm:row-span-1" : ""
                }`}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent" />

                {/* Top badges */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                  <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5">
                    <FaStar className="text-amber-400 text-xs" />
                    <span className="text-white text-sm font-semibold">{dest.rating}</span>
                    <span className="text-white/60 text-xs">({dest.reviews})</span>
                  </div>
                  {dest.duration && (
                    <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5">
                      <FaClock className="text-emerald-400 text-xs" />
                      <span className="text-white text-sm font-medium">{dest.duration}</span>
                    </div>
                  )}
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold text-white mb-1">{dest.name}</h3>
                  <div className="flex items-center gap-1.5 text-white/70 text-sm mb-3">
                    <FaMapMarkerAlt className="text-emerald-400 text-xs" />
                    {dest.state}
                  </div>
                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div>
                      <span className="text-emerald-400 font-bold text-xl">
                        ₹{dest.price?.toLocaleString()}
                      </span>
                      <span className="text-white/50 text-sm"> / person</span>
                    </div>
                    <span className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40 group-hover:scale-110 transition-transform">
                      <FaArrowRight className="text-white text-sm" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
