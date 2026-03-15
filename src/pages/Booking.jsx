import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaCalendarAlt,
  FaUsers,
  FaClipboardList,
  FaPaperPlane,
  FaCheckCircle,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaRupeeSign,
  FaShieldAlt,
  FaHeadset,
  FaTag,
} from "react-icons/fa";
import { submitBooking, getPackages, getDestinations } from "../services/api";
import CalendarPicker from "../components/CalendarPicker";
import toast from "react-hot-toast";

const Booking = () => {
  const { packageId } = useParams();
  const location = useLocation();
  const destinationFromState = location.state?.destination || null;

  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(destinationFromState);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    packageId: packageId || "",
    packageTitle: "",
    destinationId: destinationFromState?._id || destinationFromState?.id || "",
    destinationTitle: destinationFromState?.name || "",
    travelers: 1,
    travelDate: "",
    specialRequests: "",
  });

  useEffect(() => {
    getPackages()
      .then((res) => {
        setPackages(res.data);
        if (packageId) {
          const pkg = res.data.find(
            (p) => (p._id || p.id) === packageId
          );
          if (pkg) {
            setSelectedPackage(pkg);
            setForm((prev) => ({
              ...prev,
              packageId: pkg._id || pkg.id,
              packageTitle: pkg.title,
            }));
          }
        }
      })
      .catch(() => {});

    getDestinations()
      .then((res) => {
        setDestinations(res.data);
      })
      .catch(() => {});
  }, [packageId]);

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) return "Please enter a valid email address";
    const domain = email.split("@")[1];
    const validTLDs = ["com", "in", "org", "net", "co", "io", "edu", "gov", "info", "co.in"];
    const tld = domain.split(".").slice(1).join(".");
    if (!validTLDs.some((t) => tld === t || domain.endsWith("." + t))) {
      return "Please enter a valid email domain";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "email") {
      setEmailTouched(true);
      setEmailError(validateEmail(value));
    }

    if (name === "packageId") {
      const pkg = packages.find((p) => (p._id || p.id) === value);
      setSelectedPackage(pkg || null);
      setForm((prev) => ({
        ...prev,
        packageId: value,
        packageTitle: pkg ? pkg.title : "",
      }));
    }

    if (name === "destinationId") {
      const dest = destinations.find((d) => (d._id || d.id) === value);
      setSelectedDestination(dest || null);
      setForm((prev) => ({
        ...prev,
        destinationId: value,
        destinationTitle: dest ? dest.name : "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateEmail(form.email);
    if (error) {
      setEmailTouched(true);
      setEmailError(error);
      toast.error(error);
      return;
    }
    setSending(true);
    try {
      // Sanitize: convert empty strings to null for ObjectId fields
      const payload = {
        ...form,
        packageId: form.packageId || null,
        packageTitle: form.packageTitle || "",
        destinationId: form.destinationId || null,
        destinationTitle: form.destinationTitle || "",
        totalPrice: priceBreakdown.total,
      };
      await submitBooking(payload);
      toast.success("Booking submitted successfully! We'll contact you soon.");
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  // Determine booking mode: "destination", "package", or "both"
  const bookingMode = useMemo(() =>
    destinationFromState
      ? "destination"
      : packageId
        ? "package"
        : "both",
    [destinationFromState, packageId]
  );

  // Memoized price calculation
  const priceBreakdown = useMemo(() => {
    const destPrice = selectedDestination && (bookingMode === "destination" || bookingMode === "both")
      ? (selectedDestination.price || 0) : 0;
    const pkgPrice = selectedPackage && (bookingMode === "package" || bookingMode === "both")
      ? (selectedPackage.price || 0) : 0;
    const perPerson = destPrice + pkgPrice;
    const travelers = Math.max(1, Number(form.travelers) || 1);
    const subtotal = perPerson * travelers;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;
    return { perPerson, travelers, subtotal, tax, total };
  }, [selectedDestination, selectedPackage, bookingMode, form.travelers]);

  if (submitted) {
    return (
      <>
        {/* Hero Banner */}
        <section className="relative h-72 md:h-80 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600"
            alt="Booking Confirmed"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/50 to-black/70" />
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Booking Submitted!
              </h1>
              <p className="text-gray-200 text-lg max-w-xl mx-auto">
                Your adventure is about to begin
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-gray-900 transition-colors">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 border border-gray-100 dark:border-gray-700">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-emerald-600 dark:text-emerald-400 text-4xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
                Thank You!
              </h2>
              <p className="text-gray-300 dark:text-gray-400 mb-3 text-lg">
                Your booking request has been submitted successfully.
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Our travel experts will review your request and contact you
                within 24 hours with a personalized itinerary and payment
                details.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/packages"
                  className="border-2 border-emerald-600 dark:border-[#00BC7D] text-emerald-600 dark:text-[#00BC7D] px-8 py-3 rounded-full font-semibold hover:bg-emerald-50 dark:hover:bg-gray-900 transition"
                >
                  Browse More Packages
                </Link>
                <Link
                  to="/"
                  className="bg-emerald-600 dark:bg-[#00BC7D] text-white dark:text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 dark:hover:bg-emerald-500 transition"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-72 md:h-80 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600"
          alt="Book Your Trip"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Book Your Trip
            </h1>
            <p className="text-gray-200 text-lg max-w-xl mx-auto">
              Fill in the details below and let us plan the perfect getaway for
              you
            </p>
            <div className="flex items-center gap-2 text-gray-300 text-sm justify-center mt-4">
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
              <span>/</span>
              <Link to="/packages" className="hover:text-white transition">
                Packages
              </Link>
              <span>/</span>
              <span className="text-emerald-400">Book Now</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">

          {/* Your Selection - Destination & Package Cards */}
          {(selectedDestination || selectedPackage) && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-[#00BC7D] mb-5 flex items-center gap-2">
                <FaClipboardList className="text-emerald-500" />
                Your Selection
              </h2>
              <div className={`grid ${selectedDestination && selectedPackage ? 'sm:grid-cols-2' : 'sm:grid-cols-1'} gap-6`}>
                {/* Destination Card */}
                {selectedDestination && (bookingMode === "destination" || bookingMode === "both") && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={selectedDestination.image}
                        alt={selectedDestination.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-[#00BC7D] text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Destination
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-[#00BC7D] mb-1">
                        {selectedDestination.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-[#00BC7D] text-xs" />
                          {selectedDestination.state}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock className="text-[#00BC7D] text-xs" />
                          {selectedDestination.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaStar className="text-yellow-500 text-xs" />
                          {selectedDestination.rating}
                        </span>
                        <span className="capitalize text-xs bg-[#00BC7D] text-white px-2 py-0.5 rounded-full">
                          {selectedDestination.category}
                        </span>
                      </div>
                      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center text-[#00BC7D] dark:text-[#00BC7D] font-bold text-xl">
                          <FaRupeeSign className="text-base" />
                          {selectedDestination.price?.toLocaleString()}
                          <span className="text-gray-500 text-xs font-normal ml-1">/ person</span>
                        </div>
                        {form.travelers > 1 && (
                          <span className="text-xs text-gray-500 dark:text-gray-300">
                            {form.travelers} travelers: <strong className="text-gray-800 dark:text-[#00BC7D]">₹{(selectedDestination.price * form.travelers).toLocaleString()}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Package Card */}
                {selectedPackage && (bookingMode === "package" || bookingMode === "both") && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={selectedPackage.image}
                        alt={selectedPackage.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Package
                      </span>
                      {selectedPackage.originalPrice && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                          Save ₹{(selectedPackage.originalPrice - selectedPackage.price).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-[#00BC7D] mb-1">
                        {selectedPackage.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-emerald-500 text-xs" />
                          {selectedPackage.destinations?.join(" → ")}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock className="text-emerald-500 text-xs" />
                          {selectedPackage.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaStar className="text-yellow-500 text-xs" />
                          {selectedPackage.rating}
                        </span>
                      </div>
                      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-gray-400 dark:text-gray-300 line-through text-sm mr-2">
                            ₹{selectedPackage.originalPrice?.toLocaleString()}
                          </span>
                          <span className="text-emerald-600 dark:text-[#00BC7D] font-bold text-xl inline-flex items-center">
                            <FaRupeeSign className="text-base" />
                            {selectedPackage.price?.toLocaleString()}
                          </span>
                          <span className="text-gray-500 dark:text-gray-300 text-xs ml-1">/ person</span>
                        </div>
                        {form.travelers > 1 && (
                          <span className="text-xs text-gray-500 dark:text-gray-300">
                            {form.travelers} travelers: <strong className="text-gray-800 dark:text-[#00BC7D]">₹{(selectedPackage.price * form.travelers).toLocaleString()}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border dark:border-[#00BC7D] border-gray-100 p-8 md:p-10">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-[#00BC7D] mb-2">
                  Booking Details
                </h2>
                <p className="text-gray-500 mb-8 dark:text-gray-400">
                  Please fill in all the required fields to complete your
                  booking request.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                      <FaUser className="text-emerald-500" />
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                            emailTouched && form.email
                              ? emailError
                                ? "text-red-400"
                                : "text-emerald-500"
                              : "text-gray-400"
                          }`} />
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            onBlur={() => {
                              setEmailTouched(true);
                              setEmailError(validateEmail(form.email));
                            }}
                            required
                            placeholder="you@email.com"
                            className={`w-full pl-11 pr-10 py-3 rounded-xl border outline-none transition bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 ${
                              emailTouched && form.email
                                ? emailError
                                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-red-500"
                                  : "border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-emerald-500"
                                : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700"
                            }`}
                          />
                          {emailTouched && form.email && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2">
                              {emailError ? (
                                <span className="text-red-500 text-sm font-bold">✗</span>
                              ) : (
                                <FaCheckCircle className="text-emerald-500" />
                              )}
                            </span>
                          )}
                        </div>
                        {emailTouched && emailError && (
                          <p className="text-red-500 text-xs mt-1.5 ml-1">{emailError}</p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            placeholder="+91 98765 43210"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Trip Details */}
                  <div>
                    <h3 className="text-lg font-semibold dark:text-gray-400 text-gray-700 mb-4 flex items-center gap-2">
                      <FaClipboardList className="text-emerald-500 " />
                      Trip Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-5">
                      {/* Destination Selector - shown in destination or both mode */}
                      {(bookingMode === "destination" || bookingMode === "both") && (
                        <>
                          <div className="md:col-span-2">
                            <label className="dark:text-gray-400 block text-sm font-medium text-gray-700 mb-2">
                              Select Destination{bookingMode === "destination" && <span className="text-red-500"> *</span>}
                            </label>
                            <select
                              name="destinationId"
                              value={form.destinationId}
                              onChange={handleChange}
                              required={bookingMode === "destination"}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                            >
                              <option value="">-- Choose a destination --</option>
                              {destinations.map((dest) => (
                                <option key={dest._id || dest.id} value={dest._id || dest.id}>
                                  {dest.name} — {dest.state}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Selected Destination Details Card */}
                          {selectedDestination && (
                            <div className=" md:col-span-2 dark:bg-gray-800 dark:border-[#00BC7D] bg-blue-50/60 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-5">
                              <img
                                src={selectedDestination.image}
                                alt={selectedDestination.name}
                                className="w-full sm:w-36 h-28 object-cover rounded-xl shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-base font-bold text-gray-800 mb-1 truncate">
                                  {selectedDestination.name}
                                </h4>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-300 mb-2">
                                  <span className="flex items-center gap-1 text-gray-500 dark:text-gray-300">
                                    <FaMapMarkerAlt className="text-[#00BC7D] text-xs" />
                                    {selectedDestination.state}
                                  </span>
                                  <span className="flex items-center gap-1 text-gray-500 dark:text-gray-300">
                                    <FaClock className="text-[#00BC7D] text-xs" />
                                    {selectedDestination.duration}
                                  </span>
                                  <span className="flex items-center gap-1 text-gray-500 dark:text-gray-300">
                                    <FaStar className="text-yellow-500 text-xs" />
                                    {selectedDestination.rating}
                                  </span>
                                  <span className="capitalize flex items-center gap-1 text-xs bg-blue-100 text-[#00BC7D] dark:bg-transparent dark:border px-2 py-0.5 rounded-full">
                                    {selectedDestination.category}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[#00BC7D] font-bold text-lg flex items-center">
                                    <FaRupeeSign className="text-sm" />
                                    {selectedDestination.price?.toLocaleString()}
                                  </span>
                                  <span className="text-gray-500 dark:text-gray-300 text-xs">/ person</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* Package Selector - shown in package or both mode */}
                      {(bookingMode === "package" || bookingMode === "both") && (
                        <>
                          <div className="md:col-span-2 ">
                            <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-2">
                              Select Package <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="packageId"
                              value={form.packageId}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                            >
                              <option value="">-- Choose a package --</option>
                              {packages.map((pkg) => (
                                <option key={pkg._id || pkg.id} value={pkg._id || pkg.id}>
                                  {pkg.title} — ₹{pkg.price.toLocaleString()}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Selected Package Details Card */}
                          {selectedPackage && (
                            <div className="md:col-span-2  border dark:text-gray-900 border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-5">
                              <img
                                src={selectedPackage.image}
                                alt={selectedPackage.title}
                                className="w-full sm:w-36 h-28 object-cover rounded-xl shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-base font-bold text-gray-800 dark:text-[#00BC7D] mb-1 truncate">
                                  {selectedPackage.title}
                                </h4>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-300 mb-2">
                                  <span className="flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-emerald-500 text-xs dark:text-[#00BC7D]" />
                                    {selectedPackage.destinations?.join(" → ")}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <FaClock className="text-emerald-500 text-xs dark:text-[#00BC7D]" />
                                    {selectedPackage.duration}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <FaStar className="text-yellow-500 text-xs" />
                                    {selectedPackage.rating}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400 dark:text-gray-300 line-through text-sm">
                                    ₹{selectedPackage.originalPrice?.toLocaleString()}
                                  </span>
                                  <span className="text-emerald-600 dark:text-[#00BC7D] font-bold text-lg flex items-center">
                                    <FaRupeeSign className="text-sm" />
                                    {selectedPackage.price?.toLocaleString()}
                                  </span>
                                  <span className="text-gray-500 dark:text-gray-300 text-xs">/ person</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                          Travel Date <span className="text-red-500">*</span>
                        </label>
                        <div className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 transition">
                          <CalendarPicker
                            value={form.travelDate}
                            onChange={(date) =>
                              setForm((prev) => ({ ...prev, travelDate: date }))
                            }
                            minDate={today}
                          />
                        </div>
                        <input
                          type="hidden"
                          name="travelDate"
                          value={form.travelDate}
                          required
                        />
                      </div>
                      <div>
                        <label className="dark:text-gray-400 block text-sm font-medium text-gray-700 mb-2">
                          Number of Travelers{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            name="travelers"
                            value={form.travelers}
                            onChange={handleChange}
                            required
                            min="1"
                            max="50"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400">
                          Special Requests
                        </label>
                        <textarea
                          name="specialRequests"
                          value={form.specialRequests}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Any dietary preferences, accessibility needs, or special occasions..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition resize-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-emerald-600 dark:bg-[#00BC7D] text-white dark:text-gray-900 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Submit Booking Request
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Bill Summary */}
              {(selectedDestination || selectedPackage) && (
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-[#00BC7D] p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-[#00BC7D] mb-4 flex items-center gap-2">
                    <FaClipboardList className="text-emerald-500" />
                    Booking Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    {/* Destination line item */}
                    {selectedDestination && (bookingMode === "destination" || bookingMode === "both") && (
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 dark:text-[#00BC7D] truncate">{selectedDestination.name}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-300">Destination · {selectedDestination.duration}</p>
                          </div>
                          <span className="text-gray-700 dark:text-[#00BC7D] font-medium whitespace-nowrap">
                            ₹{selectedDestination.price?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Package line item */}
                    {selectedPackage && (bookingMode === "package" || bookingMode === "both") && (
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 dark:text-[#00BC7D] truncate">{selectedPackage.title}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-300">Package · {selectedPackage.duration}</p>
                          </div>
                          <span className="text-gray-700 dark:text-[#00BC7D] font-medium whitespace-nowrap">
                            ₹{selectedPackage.price?.toLocaleString()}
                          </span>
                        </div>
                        {selectedPackage.originalPrice > selectedPackage.price && (
                          <div className="flex items-center justify-between mt-1 text-xs">
                            <span className="text-gray-400 dark:text-gray-300">Original price</span>
                            <span className="text-gray-400 dark:text-gray-300 line-through">
                              ₹{selectedPackage.originalPrice?.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <hr className="border-gray-100 dark:border-[#00BC7D]" />

                    {/* Per person subtotal */}
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-300">Price per person</span>
                      <span className="font-medium text-gray-700 dark:text-[#00BC7D]">₹{priceBreakdown.perPerson.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-300">Travelers</span>
                      <span className="font-medium text-gray-700 dark:text-[#00BC7D]">× {priceBreakdown.travelers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-300">Subtotal</span>
                      <span className="font-medium text-gray-700 dark:text-[#00BC7D]">₹{priceBreakdown.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-300">GST (5%)</span>
                      <span className="font-medium text-gray-700 dark:text-[#00BC7D]">₹{priceBreakdown.tax.toLocaleString()}</span>
                    </div>

                    <hr className="border-gray-100 dark:border-[#00BC7D]" />

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-base font-bold text-gray-800 dark:text-[#00BC7D]">Total</span>
                      <span className="text-xl font-bold text-emerald-600 dark:text-[#00BC7D] flex items-center">
                        <FaRupeeSign className="text-base" />
                        {priceBreakdown.total.toLocaleString()}
                      </span>
                    </div>

                    {selectedPackage && selectedPackage.originalPrice > selectedPackage.price && (
                      <div className="bg-red-50 dark:bg-red-900 rounded-xl px-4 py-2.5 text-center mt-1">
                        <span className="text-red-600 dark:text-red-300 text-xs font-semibold">
                          You save ₹{((selectedPackage.originalPrice - selectedPackage.price) * priceBreakdown.travelers).toLocaleString()}!
                        </span>
                      </div>
                    )}
                  </div>

                  {form.travelDate && (
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#00BC7D] text-xs text-gray-500 dark:text-gray-300 flex items-center gap-2">
                      <FaCalendarAlt className="text-emerald-500 dark:text-[#00BC7D]" />
                      Travel date: <span className="font-medium text-gray-700 dark:text-[#00BC7D]">{new Date(form.travelDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Why Book With Us */}
              <div className="bg-white dark:bg-gray-900 dark:border-[#00BC7D] rounded-3xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-[#00BC7D] mb-5">
                  Why Book With Tripzo?
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: FaShieldAlt,
                      title: "Secure Booking",
                      desc: "100% safe & secure payment process",
                    },
                    {
                      icon: FaTag,
                      title: "Best Price Guarantee",
                      desc: "We match any competitor's price",
                    },
                    {
                      icon: FaHeadset,
                      title: "24/7 Support",
                      desc: "Dedicated travel experts anytime",
                    },
                    {
                      icon: FaCheckCircle,
                      title: "Free Cancellation",
                      desc: "Cancel up to 48 hours before trip",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-10 h-10 dark:bg-gray-800 bg-emerald-50 dark:border dark:border-[#00BC7D] rounded-lg flex items-center justify-center shrink-0">
                        <item.icon className="text-emerald-600 dark:text-[#00BC7D]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm dark:text-gray-300">
                          {item.title}
                        </h4>
                        <p className="text-gray-500 text-xs dark:text-gray-300">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-emerald-600 rounded-3xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Need Help?</h3>
                <p className="text-emerald-100 text-sm mb-4">
                  Our travel experts are here to assist you with your booking.
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
        </div>
      </section>
    </>
  );
};

export default Booking;
