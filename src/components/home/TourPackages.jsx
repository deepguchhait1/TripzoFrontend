import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaClock, FaCheckCircle, FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";
import { getPackages } from "../../services/api";

const TourPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const showSkeleton = loading || packages.length === 0;

  useEffect(() => {
    getPackages({ limit: 6 })
      .then((res) => setPackages(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (showSkeleton) {
    return (
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors">
        <div className="absolute top-0 inset-x-0 h-1/2 bg-linear-to-b from-gray-50/80 dark:from-gray-800/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative animate-pulse">
          <div className="text-center mb-14 space-y-4">
            <div className="mx-auto h-7 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="mx-auto h-12 w-2/3 rounded-2xl bg-gray-200 dark:bg-gray-700" />
            <div className="mx-auto h-6 w-5/6 max-w-2xl rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="rounded-3xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div className="h-60 bg-gray-200 dark:bg-gray-700" />
                <div className="p-6 space-y-4">
                  <div className="h-6 w-5/6 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-1/2 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-10 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors">
      {/* Background accent */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-linear-to-b from-gray-50/80 dark:from-gray-800/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Best Offers
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Trending Tour <span className="text-emerald-600 dark:text-emerald-400">Packages</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
            Hand-picked packages with the best prices and unforgettable experiences.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {packages.map((pkg) => {
            const discount = pkg.originalPrice
              ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
              : 0;
            return (
              <Link
                to={`/packages/${pkg._id || pkg.id}`}
                key={pkg._id || pkg.id}
                className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-2xl hover:shadow-emerald-100/50 dark:hover:shadow-emerald-900/20 transition-all duration-500 flex flex-col"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-60">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    {discount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/95 dark:bg-gray-800/95 shadow-sm px-2.5 py-1.5 rounded-xl">
                    <FaStar className="text-amber-400 text-xs" />
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {pkg.rating}
                    </span>
                  </div>

                  {/* Duration pill at bottom of image */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/95 dark:bg-gray-800/95 shadow-sm px-3 py-1.5 rounded-xl">
                    <FaClock className="text-emerald-500 text-xs" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{pkg.duration}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {pkg.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-sm mb-4">
                    <FaMapMarkerAlt className="text-emerald-500 text-xs" />
                    <p className="truncate">{pkg.destinations?.join(" → ")}</p>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pkg.highlights?.slice(0, 3).map((h, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-lg font-medium"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Included */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-5 text-sm text-gray-500 dark:text-gray-400">
                    {pkg.included?.map((item, i) => (
                      <span key={i} className="flex items-center gap-1.5">
                        <FaCheckCircle className="text-emerald-500 text-[11px]" />
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="mt-auto flex items-end justify-between pt-5 border-t border-gray-100 dark:border-gray-700">
                    <div>
                      {pkg.originalPrice && (
                        <span className="text-gray-400 dark:text-gray-500 line-through text-sm block mb-0.5">
                          ₹{pkg.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        ₹{pkg.price?.toLocaleString()}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500 text-xs ml-1">/ person</span>
                    </div>
                    <span className="inline-flex items-center gap-2 bg-emerald-500 dark:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 transition-colors shadow-sm">
                      Details
                      <FaArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center mt-14">
          <Link
            to="/packages"
            className="group inline-flex items-center gap-2 border-2 border-gray-900 dark:border-gray-200 text-gray-900 dark:text-white px-8 py-3.5 rounded-2xl font-semibold hover:bg-gray-900 dark:hover:bg-gray-200 hover:text-white dark:hover:text-gray-900 transition-all duration-300"
          >
            View All Packages
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TourPackages;
