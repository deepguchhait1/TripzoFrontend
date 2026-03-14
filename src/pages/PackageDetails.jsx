import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaClock,
  FaCheckCircle,
  FaRupeeSign,
  FaUsers,
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaArrowLeft,
  FaShieldAlt,
  FaHeadset,
  FaTag,
  FaCalendarAlt,
  FaChevronRight,
  FaShareAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaTimes,
  FaChevronLeft,
  FaImages,
} from "react-icons/fa";
import { getPackage, getPackages } from "../services/api";

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    getPackage(id)
      .then((res) => {
        setPkg(res.data);
        // Fetch related packages in same category
        return getPackages({ category: res.data.category, limit: 4 });
      })
      .then((res) => {
        setRelated(res.data.filter((p) => (p._id || p.id) !== id).slice(0, 3));
      })
      .catch(() => navigate("/packages"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const discount = useMemo(() => {
    if (!pkg) return 0;
    return Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);
  }, [pkg]);
  const allImages = useMemo(() => {
    if (!pkg) return [];
    return [pkg.image, ...(pkg.images || [])].filter(Boolean);
  }, [pkg]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!pkg) return null;

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-100 md:h-120 overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-10 w-full">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-gray-300 text-sm mb-4">
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
              <FaChevronRight className="text-xs" />
              <Link to="/packages" className="hover:text-white transition">
                Packages
              </Link>
              <FaChevronRight className="text-xs" />
              <span className="text-emerald-400">{pkg.title}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {discount}% OFF
              </span>
              <span className="capitalize text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full font-medium border border-emerald-500/30">
                {pkg.category}
              </span>
              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                <FaStar />
                <span className="text-white font-semibold">{pkg.rating}</span>
                <span className="text-gray-300">({pkg.reviews} reviews)</span>
              </div>
              {pkg.tags?.length > 0 && pkg.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-white/10 text-white/80 px-3 py-1.5 rounded-full font-medium border border-white/10 backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
              {pkg.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
              <span className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-emerald-400" />
                {pkg.destinations.join(" → ")}
              </span>
              <span className="flex items-center gap-1.5">
                <FaClock className="text-emerald-400" />
                {pkg.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <FaUsers className="text-emerald-400" />
                2-10 People
              </span>
            </div>
          </div>
        </div>

        {/* Top Actions */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <button
            onClick={() => setIsFav(!isFav)}
            className="w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition shadow-lg"
          >
            {isFav ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-gray-600" />
            )}
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
            className="w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition shadow-lg"
          >
            <FaShareAlt className="text-gray-600" />
          </button>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/packages")}
          className="absolute top-6 left-6 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition shadow-lg"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
      </section>

      {/* Photo Gallery */}
      {allImages.length > 1 && (
        <section className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FaImages className="text-emerald-500" /> Photo Gallery
              <span className="text-gray-400 font-normal normal-case tracking-normal">({allImages.length} photos)</span>
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveImage(idx); setShowLightbox(true); }}
                  className={`relative shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                    idx === 0 ? 'border-emerald-500' : 'border-transparent hover:border-emerald-300'
                  }`}
                >
                  <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Main</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Highlights */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <FaStar className="text-emerald-500" />
                  Tour Highlights
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
                    >
                      <FaCheckCircle className="text-emerald-500 shrink-0" />
                      <span className="text-gray-700 text-sm">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-500" />
                  What's Included
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {pkg.included.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-emerald-50 rounded-xl px-4 py-3"
                    >
                      <FaCheckCircle className="text-emerald-600 shrink-0" />
                      <span className="text-gray-700 text-sm font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destinations */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-emerald-500" />
                  Destinations Covered
                </h2>
                <div className="flex flex-wrap gap-3">
                  {pkg.destinations.map((dest, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 font-medium">{dest}</span>
                      {i < pkg.destinations.length - 1 && (
                        <FaChevronRight className="text-gray-300 text-xs mx-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Info */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <FaCalendarAlt className="text-emerald-500" />
                  Important Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-800 mb-1">
                      Duration
                    </h4>
                    <p className="text-blue-600">{pkg.duration}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="font-semibold text-green-800 mb-1">
                      Group Size
                    </h4>
                    <p className="text-green-600">2 – 10 People</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-800 mb-1">
                      Category
                    </h4>
                    <p className="text-purple-600 capitalize">{pkg.category}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <h4 className="font-semibold text-orange-800 mb-1">
                      Rating
                    </h4>
                    <p className="text-orange-600">
                      {pkg.rating} ★ ({pkg.reviews} reviews)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
                <div className="text-center pb-5 border-b border-gray-100">
                  <span className="text-gray-400 line-through text-lg">
                    ₹{pkg.originalPrice.toLocaleString()}
                  </span>
                  <div className="flex items-center justify-center text-emerald-600 font-bold text-4xl mt-1">
                    <FaRupeeSign className="text-2xl" />
                    {pkg.price.toLocaleString()}
                  </div>
                  <span className="text-gray-500 text-sm">per person</span>
                  <div className="mt-2">
                    <span className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                      Save ₹{(pkg.originalPrice - pkg.price).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="py-5 space-y-4">
                  <Link
                    to={`/booking/${pkg._id || pkg.id}`}
                    className="block w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold text-center text-lg hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-200"
                  >
                    Book Now
                  </Link>
                  <a
                    href="tel:+911234567890"
                    className="w-full border-2 border-emerald-600 text-emerald-600 py-3.5 rounded-xl font-semibold text-center hover:bg-emerald-50 transition flex items-center justify-center gap-2"
                  >
                    <FaPhoneAlt />
                    Call to Book
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="space-y-3 pt-5 border-t border-gray-100">
                  {[
                    {
                      icon: FaShieldAlt,
                      title: "Secure Booking",
                      desc: "100% safe & secure payments",
                    },
                    {
                      icon: FaTag,
                      title: "Best Price Guarantee",
                      desc: "We match any competitor's price",
                    },
                    {
                      icon: FaHeadset,
                      title: "24/7 Support",
                      desc: "Dedicated travel experts",
                    },
                    {
                      icon: FaCheckCircle,
                      title: "Free Cancellation",
                      desc: "Cancel up to 48 hours before",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                        <item.icon className="text-emerald-600 text-sm" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm">
                          {item.title}
                        </h4>
                        <p className="text-gray-500 text-xs">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-emerald-600 rounded-3xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Need Help?</h3>
                <p className="text-emerald-100 text-sm mb-4">
                  Our travel experts are here to help you plan the perfect trip.
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:+911234567890"
                    className="flex items-center gap-3 text-emerald-100 hover:text-white transition text-sm"
                  >
                    <FaPhoneAlt />
                    +91 123 456 7890
                  </a>
                  <a
                    href="mailto:tripzo.india.01@gmail.com"
                    className="flex items-center gap-3 text-emerald-100 hover:text-white transition text-sm"
                  >
                    <FaEnvelope />
                    tripzo.india.01@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Related Packages */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                Similar Packages You Might Like
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((rPkg) => (
                  <Link
                    key={rPkg._id || rPkg.id}
                    to={`/packages/${rPkg._id || rPkg.id}`}
                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={rPkg.image}
                        alt={rPkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {Math.round(
                            ((rPkg.originalPrice - rPkg.price) /
                              rPkg.originalPrice) *
                              100
                          )}
                          % OFF
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1 text-sm">
                          <FaStar className="text-yellow-500" />
                          <span className="font-semibold text-gray-800">
                            {rPkg.rating}
                          </span>
                        </div>
                        <span className="capitalize text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium">
                          {rPkg.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition">
                        {rPkg.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                        <FaMapMarkerAlt className="text-emerald-500" />
                        {rPkg.destinations.join(" → ")}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <span className="text-gray-400 line-through text-xs">
                            ₹{rPkg.originalPrice.toLocaleString()}
                          </span>
                          <div className="flex items-center text-emerald-600 font-bold text-lg">
                            <FaRupeeSign className="text-sm" />
                            {rPkg.price.toLocaleString()}
                          </div>
                        </div>
                        <span className="text-emerald-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                          View <FaChevronRight className="text-xs" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setShowLightbox(false)}>
          <button onClick={() => setShowLightbox(false)} className="absolute top-6 right-6 text-white/70 hover:text-white transition z-10">
            <FaTimes className="text-2xl" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length); }}
            className="absolute left-4 md:left-8 text-white/60 hover:text-white transition p-3 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20"
          >
            <FaChevronLeft className="text-xl" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setActiveImage((prev) => (prev + 1) % allImages.length); }}
            className="absolute right-4 md:right-8 text-white/60 hover:text-white transition p-3 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20"
          >
            <FaChevronRight className="text-xl" />
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-w-5xl max-h-[85vh] w-full mx-16">
            <img src={allImages[activeImage]} alt="" className="w-full max-h-[70vh] object-contain rounded-2xl" />
            <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
              {allImages.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    idx === activeImage ? 'border-emerald-500 scale-110' : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <p className="text-center text-white/40 text-sm mt-2">{activeImage + 1} / {allImages.length}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default PackageDetails;
