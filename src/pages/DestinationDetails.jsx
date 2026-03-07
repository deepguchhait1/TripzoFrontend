import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaRupeeSign,
  FaCheckCircle,
  FaChevronRight,
  FaArrowLeft,
  FaShareAlt,
  FaHeart,
  FaRegHeart,
  FaPhoneAlt,
  FaEnvelope,
  FaShieldAlt,
  FaHeadset,
  FaTag,
  FaLandmark,
  FaUmbrellaBeach,
  FaMountain,
  FaLeaf,
  FaPray,
  FaHiking,
  FaCamera,
  FaCalendarAlt,
  FaUsers,
  FaTimes,
  FaChevronLeft,
  FaImages,
} from "react-icons/fa";
import { getDestination, getDestinations } from "../services/api";

const categoryIcons = {
  heritage: FaLandmark,
  beach: FaUmbrellaBeach,
  mountain: FaMountain,
  nature: FaLeaf,
  spiritual: FaPray,
  adventure: FaHiking,
};

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dest, setDest] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    getDestination(id)
      .then((res) => {
        setDest(res.data);
        return getDestinations({ category: res.data.category, limit: 5 });
      })
      .then((res) => {
        setRelated(
          res.data.filter((d) => (d._id || d.id) !== id).slice(0, 3)
        );
      })
      .catch(() => navigate("/destinations"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const allImages = useMemo(() => {
    if (!dest) return [];
    return [dest.image, ...(dest.images || [])].filter(Boolean);
  }, [dest]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!dest) return null;

  const CatIcon = categoryIcons[dest.category];

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-100 md:h-120 overflow-hidden">
        <img
          src={dest.image}
          alt={dest.name}
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
              <Link to="/destinations" className="hover:text-white transition">
                Destinations
              </Link>
              <FaChevronRight className="text-xs" />
              <span className="text-emerald-400">{dest.name}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="capitalize text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full font-medium border border-emerald-500/30 flex items-center gap-1.5">
                {CatIcon && <CatIcon className="text-sm" />}
                {dest.category}
              </span>
              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                <FaStar />
                <span className="text-white font-semibold">{dest.rating}</span>
                <span className="text-gray-300">
                  ({dest.reviews} reviews)
                </span>
              </div>
            </div>

            {dest.tags?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-3 w-[40%]">
                {dest.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-white/10 text-white/80 px-3 py-1.5 rounded-full font-medium border border-white/10 backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
              {dest.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
              <span className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-emerald-400" />
                {dest.state}
              </span>
              <span className="flex items-center gap-1.5">
                <FaClock className="text-emerald-400" />
                {dest.duration}
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
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition shadow-lg"
          >
            <FaShareAlt className="text-gray-600" />
          </button>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/destinations")}
          className="absolute top-6 left-6 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition shadow-lg"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
      </section>

      {/* Photo Gallery */}
      {allImages.length > 1 && (
        <section className="bg-gray-50 border-b border-gray-100">
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
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* About */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-emerald-500" />
                  About {dest.name}
                </h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  {dest.description}
                </p>
              </div>

              {/* Quick Info */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <FaCalendarAlt className="text-emerald-500" />
                  Quick Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-800 mb-1 text-sm">
                      Location
                    </h4>
                    <p className="text-blue-600 flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-xs" />
                      {dest.state}, India
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="font-semibold text-green-800 mb-1 text-sm">
                      Best Duration
                    </h4>
                    <p className="text-green-600 flex items-center gap-1.5">
                      <FaClock className="text-xs" />
                      {dest.duration}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-800 mb-1 text-sm">
                      Category
                    </h4>
                    <p className="text-purple-600 capitalize flex items-center gap-1.5">
                      {CatIcon && <CatIcon className="text-xs" />}
                      {dest.category}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <h4 className="font-semibold text-orange-800 mb-1 text-sm">
                      Rating
                    </h4>
                    <p className="text-orange-600 flex items-center gap-1.5">
                      <FaStar className="text-xs" />
                      {dest.rating} ★ ({dest.reviews} reviews)
                    </p>
                  </div>
                </div>
              </div>

              {/* Best For */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <FaCamera className="text-emerald-500" />
                  Perfect For
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: FaUsers, text: "Family Trips" },
                    { icon: FaHeart, text: "Honeymoon Couples" },
                    { icon: FaCamera, text: "Photography Enthusiasts" },
                    { icon: FaHiking, text: "Adventure Seekers" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
                    >
                      <item.icon className="text-emerald-500" />
                      <span className="text-gray-700 text-sm font-medium">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel Tips */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-500" />
                  Travel Tips
                </h2>
                <div className="space-y-3">
                  {[
                    "Carry comfortable walking shoes and weather-appropriate clothing.",
                    "Book accommodations in advance during peak tourist season.",
                    "Keep copies of your ID and important documents handy.",
                    "Respect local customs, traditions, and heritage sites.",
                    "Stay hydrated and carry basic medications while traveling.",
                  ].map((tip, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-emerald-50 rounded-xl px-4 py-3"
                    >
                      <FaCheckCircle className="text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <div className="text-center pb-5 border-b border-gray-100">
                  <p className="text-gray-500 text-sm mb-1">Starting from</p>
                  <div className="flex items-center justify-center text-emerald-600 font-bold text-4xl">
                    <FaRupeeSign className="text-2xl" />
                    {dest.price.toLocaleString()}
                  </div>
                  <span className="text-gray-500 text-sm">per person</span>
                </div>

                <div className="py-5 space-y-4">
                  <Link
                    to="/booking"
                    state={{ destination: dest }}
                    className="block w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold text-center text-lg hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-200"
                  >
                    Book Now
                  </Link>
                  <Link
                    to="/packages"
                    className="block w-full border-2 border-emerald-600 text-emerald-600 py-3.5 rounded-xl font-semibold text-center hover:bg-emerald-50 transition"
                  >
                    View Packages
                  </Link>
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
                  Our travel experts are here to help you plan the perfect trip
                  to {dest.name}.
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

          {/* Related Destinations */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                Similar Destinations You Might Like
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((rDest) => (
                  <Link
                    key={rDest._id || rDest.id}
                    to={`/destinations/${rDest._id || rDest.id}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={rDest.image}
                        alt={rDest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
                          {rDest.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        <FaStar className="text-yellow-500 text-xs" />
                        <span className="text-sm font-semibold">
                          {rDest.rating}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition">
                        {rDest.name}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                        <FaMapMarkerAlt className="text-emerald-500" />
                        {rDest.state}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center text-emerald-600 font-bold text-lg">
                          <FaRupeeSign className="text-sm" />
                          {rDest.price.toLocaleString()}
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

export default DestinationDetails;
