import { useEffect, useState, useMemo } from "react";
import {
  FaCalendarCheck,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSuitcase,
  FaUsers,
  FaClock,
  FaTrash,
  FaCheck,
  FaTimes,
  FaEye,
  FaSearch,
  FaFilter,
  FaRupeeSign,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglass,
  FaArrowRight,
  FaPaperPlane,
  FaReply,
} from "react-icons/fa";
import { getBookings, updateBooking, deleteBooking, replyBooking } from "../../services/api";
import toast from "react-hot-toast";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [emailModal, setEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ subject: "", body: "" });
  const [emailSending, setEmailSending] = useState(false);
  const [activePreset, setActivePreset] = useState(null);

  const getPresetTemplates = (booking) => {
    const tripName = booking.packageTitle || booking.destinationTitle || "your trip";
    const name = booking.name;
    const travelDate = booking.travelDate
      ? new Date(booking.travelDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      : "your selected dates";
    return [
      {
        id: "confirmation",
        label: "Booking Confirmed",
        icon: "\u2705",
        subject: `Booking Confirmed \u2014 ${tripName} | Tripzo`,
        body: `Hi ${name},\n\nGreat news! Your booking for ${tripName} has been confirmed.\n\nTravel Date: ${travelDate}\nTravelers: ${booking.travelers}\n\nOur team will share a detailed itinerary and further instructions within the next 24-48 hours. Please ensure your contact details are up to date.\n\nIf you have any questions, don't hesitate to reach out.\n\nHappy travels!\nTeam Tripzo`,
      },
      {
        id: "payment",
        label: "Payment Details",
        icon: "\ud83d\udcb3",
        subject: `Payment Details \u2014 ${tripName} | Tripzo`,
        body: `Hi ${name},\n\nThank you for booking ${tripName} with Tripzo!\n\nTo proceed with confirming your trip, please complete the payment using the details below:\n\n\u2022 Amount: \u20b9[AMOUNT]\n\u2022 Payment Method: Bank Transfer / UPI\n\u2022 UPI ID: tripzo@upi\n\u2022 Bank: [Bank Name]\n\u2022 Account: [Account Number]\n\u2022 IFSC: [IFSC Code]\n\nPlease share the payment confirmation screenshot with us. Once verified, we will confirm your booking immediately.\n\nBest regards,\nTeam Tripzo`,
      },
      {
        id: "itinerary",
        label: "Itinerary",
        icon: "\ud83d\uddfa\ufe0f",
        subject: `Your Itinerary \u2014 ${tripName} | Tripzo`,
        body: `Hi ${name},\n\nWe're excited to share the itinerary for your upcoming trip to ${tripName}!\n\nTravel Date: ${travelDate}\n\nDay 1:\n[Add details here]\n\nDay 2:\n[Add details here]\n\nDay 3:\n[Add details here]\n\nInclusions:\n\u2022 Accommodation\n\u2022 Meals as mentioned\n\u2022 Sightseeing & transfers\n\u2022 Travel insurance\n\nPlease review and let us know if you'd like any changes.\n\nBest regards,\nTeam Tripzo`,
      },
      {
        id: "reminder",
        label: "Trip Reminder",
        icon: "\u23f0",
        subject: `Trip Reminder \u2014 ${tripName} | Tripzo`,
        body: `Hi ${name},\n\nJust a friendly reminder that your trip to ${tripName} is coming up on ${travelDate}!\n\nHere's a quick checklist:\n\u2022 Valid ID proof for all travelers\n\u2022 Comfortable clothing & footwear\n\u2022 Any prescribed medications\n\u2022 Camera for memories!\n\u2022 Printed/digital copy of booking confirmation\n\nOur support team is available 24/7 during your trip at +91 123 456 7890.\n\nHave a wonderful journey!\nTeam Tripzo`,
      },
      {
        id: "cancellation",
        label: "Cancellation",
        icon: "\u274c",
        subject: `Booking Cancelled \u2014 ${tripName} | Tripzo`,
        body: `Hi ${name},\n\nWe're sorry to inform you that your booking for ${tripName} has been cancelled.\n\nIf a refund is applicable, it will be processed within 5-7 business days to your original payment method.\n\nIf this cancellation was a mistake or you'd like to rebook, please don't hesitate to reach out. We'd love to help you plan another trip.\n\nBest regards,\nTeam Tripzo`,
      },
      {
        id: "followup",
        label: "Follow Up",
        icon: "\ud83d\udd14",
        subject: `Following Up on Your Booking \u2014 Tripzo`,
        body: `Hi ${name},\n\nWe noticed your booking for ${tripName} is still pending. We wanted to check in and see if you need any help or have questions.\n\nOur travel experts are ready to assist you with:\n\u2022 Customizing your itinerary\n\u2022 Payment options\n\u2022 Special requests or add-ons\n\nFeel free to reply to this email or call us at +91 123 456 7890.\n\nLooking forward to hearing from you!\nTeam Tripzo`,
      },
    ];
  };

  const fetchBookings = () => {
    setLoading(true);
    getBookings()
      .then((res) => setBookings(res.data))
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateBooking(id, { status });
      toast.success(`Booking ${status}`);
      fetchBookings();
      if (selected?._id === id) setSelected({ ...selected, status });
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    try {
      await deleteBooking(id);
      toast.success("Booking deleted");
      if (selected?._id === id) setSelected(null);
      fetchBookings();
    } catch {
      toast.error("Delete failed");
    }
  };

  const openEmailModal = (booking) => {
    const tripName = booking.packageTitle || booking.destinationTitle || "your trip";
    setEmailForm({
      subject: `Regarding Your Booking \u2014 ${tripName} | Tripzo`,
      body: `Hi ${booking.name},\n\nThank you for booking with Tripzo!\n\n\n\nBest regards,\nTeam Tripzo`,
    });
    setActivePreset(null);
    setEmailModal(true);
  };

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setEmailForm({ subject: preset.subject, body: preset.body });
  };

  const handleSendEmail = async () => {
    if (!emailForm.subject.trim() || !emailForm.body.trim()) {
      toast.error("Subject and message body are required");
      return;
    }
    setEmailSending(true);
    try {
      await replyBooking(selected._id, emailForm);
      toast.success("Email sent successfully!");
      setEmailModal(false);
    } catch {
      toast.error("Failed to send email. Please try again.");
    } finally {
      setEmailSending(false);
    }
  };

  const statusColors = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
  };

  const statusIcons = {
    pending: FaHourglass,
    confirmed: FaCheckCircle,
    completed: FaCheckCircle,
    cancelled: FaTimesCircle,
  };

  const statusTabs = [
    { key: "all", label: "All Bookings" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const filteredBookings = useMemo(() => bookings
    .filter((b) => statusFilter === "all" || b.status === statusFilter)
    .filter(
      (b) =>
        b.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.email?.toLowerCase().includes(search.toLowerCase()) ||
        b.packageTitle?.toLowerCase().includes(search.toLowerCase()) ||
        b.destinationTitle?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [bookings, statusFilter, search]);

  const getStatusCount = (status) =>
    status === "all" ? bookings.length : bookings.filter((b) => b.status === status).length;

  const totalRevenue = useMemo(() => bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0), [bookings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 p-2.5 rounded-xl">
              <FaCalendarCheck className="text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{bookings.length}</div>
              <div className="text-xs text-gray-500">Total Bookings</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 p-2.5 rounded-xl">
              <FaHourglass className="text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {bookings.filter((b) => b.status === "pending").length}
              </div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-xl">
              <FaCheckCircle className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {bookings.filter((b) => b.status === "confirmed").length}
              </div>
              <div className="text-xs text-gray-500">Confirmed</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 p-2.5 rounded-xl">
              <FaRupeeSign className="text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                &#8377;{totalRevenue.toLocaleString("en-IN")}
              </div>
              <div className="text-xs text-gray-500">Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by name, email, package, or destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  statusFilter === tab.key
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label} ({getStatusCount(tab.key)})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Bookings List */}
        <div className="lg:col-span-3 space-y-3">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <FaCalendarCheck className="text-4xl text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No bookings found</p>
              <p className="text-gray-300 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            filteredBookings.map((b) => {
              const StatusIcon = statusIcons[b.status] || FaClock;
              return (
                <div
                  key={b._id}
                  onClick={() => setSelected(b)}
                  className={`bg-white rounded-2xl p-4 shadow-sm border transition-all cursor-pointer hover:shadow-md ${
                    selected?._id === b._id
                      ? "border-emerald-300 ring-2 ring-emerald-100"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {b.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800 truncate">{b.name}</h4>
                        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 ${statusColors[b.status] || "bg-gray-100 text-gray-600"}`}>
                          <StatusIcon className="text-[10px]" />
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2 truncate">{b.email}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        {b.packageTitle && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <FaSuitcase className="text-emerald-400 text-[10px]" />
                            {b.packageTitle}
                          </span>
                        )}
                        {b.destinationTitle && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <FaMapMarkerAlt className="text-blue-400 text-[10px]" />
                            {b.destinationTitle}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FaUsers className="text-purple-400 text-[10px]" />
                          {b.travelers} travelers
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FaCalendarAlt className="text-cyan-400 text-[10px]" />
                          {b.travelDate ? new Date(b.travelDate).toLocaleDateString() : "N/A"}
                        </span>
                        {b.totalPrice > 0 && (
                          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                            &#8377;{b.totalPrice?.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          {selected ? (() => {
            const StatusIcon = statusIcons[selected.status] || FaClock;
            const daysUntilTrip = selected.travelDate
              ? Math.ceil((new Date(selected.travelDate) - new Date()) / (1000 * 60 * 60 * 24))
              : null;
            return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-20 overflow-hidden">
              {/* Accent Top Bar */}
              <div className={`h-1.5 w-full ${
                selected.status === "confirmed" ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                : selected.status === "completed" ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                : selected.status === "cancelled" ? "bg-gradient-to-r from-red-400 to-rose-500"
                : "bg-gradient-to-r from-amber-400 to-orange-400"
              }`} />

              {/* Header — Profile Card */}
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1.5 border ${statusColors[selected.status]}`}>
                    <StatusIcon className="text-[10px]" />
                    {selected.status?.charAt(0).toUpperCase() + selected.status?.slice(1)}
                  </span>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-100">
                    {selected.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-base truncate">{selected.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <a href={`mailto:${selected.email}`} className="text-xs text-gray-500 hover:text-emerald-600 transition truncate flex items-center gap-1">
                        <FaEnvelope className="text-[10px] shrink-0" />
                        {selected.email}
                      </a>
                      {selected.phone && (
                        <a href={`tel:${selected.phone}`} className="text-xs text-gray-500 hover:text-emerald-600 transition flex items-center gap-1">
                          <FaPhone className="text-[10px] shrink-0" />
                          {selected.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Row */}
              <div className="mx-5 mb-4 grid grid-cols-3 gap-2">
                <div className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
                  <FaUsers className="text-purple-500 text-sm mx-auto mb-1" />
                  <div className="text-sm font-bold text-gray-800">{selected.travelers}</div>
                  <div className="text-[10px] text-gray-400">Travelers</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
                  <FaRupeeSign className="text-emerald-500 text-sm mx-auto mb-1" />
                  <div className="text-sm font-bold text-gray-800">{selected.totalPrice > 0 ? `₹${(selected.totalPrice / 1000).toFixed(selected.totalPrice >= 1000 ? 1 : 0)}k` : "—"}</div>
                  <div className="text-[10px] text-gray-400">Amount</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
                  <FaCalendarAlt className={`text-sm mx-auto mb-1 ${daysUntilTrip !== null && daysUntilTrip >= 0 ? "text-cyan-500" : "text-gray-400"}`} />
                  <div className="text-sm font-bold text-gray-800">
                    {daysUntilTrip !== null ? (daysUntilTrip >= 0 ? daysUntilTrip : "Past") : "—"}
                  </div>
                  <div className="text-[10px] text-gray-400">{daysUntilTrip !== null && daysUntilTrip >= 0 ? "Days Left" : "Trip Date"}</div>
                </div>
              </div>

              {/* Scrollable Detail Body */}
              <div className="max-h-[45vh] overflow-y-auto px-5 pb-2 space-y-4">
                {/* Trip Details Card */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-5 h-5 bg-emerald-100 rounded-md flex items-center justify-center">
                      <FaSuitcase className="text-emerald-600 text-[10px]" />
                    </div>
                    <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Trip Details</h5>
                  </div>
                  <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                    {selected.packageTitle && (
                      <div className="flex items-center justify-between px-3.5 py-2.5 bg-white hover:bg-gray-50/50 transition">
                        <span className="text-xs text-gray-400">Package</span>
                        <span className="text-xs font-medium text-gray-700 text-right max-w-[60%] truncate">{selected.packageTitle}</span>
                      </div>
                    )}
                    {selected.destinationTitle && (
                      <div className="flex items-center justify-between px-3.5 py-2.5 bg-white hover:bg-gray-50/50 transition">
                        <span className="text-xs text-gray-400">Destination</span>
                        <span className="text-xs font-medium text-gray-700 text-right max-w-[60%] truncate">{selected.destinationTitle}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-white hover:bg-gray-50/50 transition">
                      <span className="text-xs text-gray-400">Travel Date</span>
                      <span className="text-xs font-medium text-gray-700">
                        {selected.travelDate
                          ? new Date(selected.travelDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-white hover:bg-gray-50/50 transition">
                      <span className="text-xs text-gray-400">Travelers</span>
                      <span className="text-xs font-medium text-gray-700">{selected.travelers} people</span>
                    </div>
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-emerald-50/60">
                      <span className="text-xs font-medium text-emerald-600">Total Amount</span>
                      <span className="text-sm font-bold text-emerald-700">
                        {selected.totalPrice > 0 ? <>&#8377;{selected.totalPrice?.toLocaleString("en-IN")}</> : <span className="text-xs font-medium text-gray-400">Not available</span>}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {selected.specialRequests && (
                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-5 h-5 bg-amber-100 rounded-md flex items-center justify-center">
                        <span className="text-[10px]">📝</span>
                      </div>
                      <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Special Requests</h5>
                    </div>
                    <div className="bg-amber-50/70 rounded-xl p-3.5 border border-amber-100/80">
                      <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{selected.specialRequests}</p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
                      <FaClock className="text-blue-600 text-[10px]" />
                    </div>
                    <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Timeline</h5>
                  </div>
                  <div className="relative pl-4 border-l-2 border-gray-100 space-y-3">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm" />
                      <div className="text-[11px] font-medium text-gray-700">Booking Created</div>
                      <div className="text-[10px] text-gray-400">{new Date(selected.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                    {selected.updatedAt !== selected.createdAt && (
                      <div className="relative">
                        <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-blue-400 border-2 border-white shadow-sm" />
                        <div className="text-[11px] font-medium text-gray-700">Last Updated</div>
                        <div className="text-[10px] text-gray-400">{new Date(selected.updatedAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    )}
                    {selected.travelDate && (
                      <div className="relative">
                        <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${daysUntilTrip !== null && daysUntilTrip >= 0 ? "bg-cyan-400" : "bg-gray-300"}`} />
                        <div className="text-[11px] font-medium text-gray-700">Travel Date</div>
                        <div className="text-[10px] text-gray-400">
                          {new Date(selected.travelDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                          {daysUntilTrip !== null && daysUntilTrip >= 0 && (
                            <span className="ml-1.5 text-cyan-600 font-medium">({daysUntilTrip} days away)</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-gray-100 space-y-3 bg-gray-50/40">
                {/* Status Switcher */}
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Update Status</div>
                  <div className="bg-white rounded-xl border border-gray-200 p-1 flex gap-1">
                    {[
                      { key: "pending", icon: FaHourglass, label: "Pending", bg: "bg-amber-500", ring: "ring-amber-200", light: "bg-amber-50 text-amber-600" },
                      { key: "confirmed", icon: FaCheckCircle, label: "Confirmed", bg: "bg-blue-500", ring: "ring-blue-200", light: "bg-blue-50 text-blue-600" },
                      { key: "completed", icon: FaCheck, label: "Done", bg: "bg-emerald-500", ring: "ring-emerald-200", light: "bg-emerald-50 text-emerald-600" },
                      { key: "cancelled", icon: FaTimesCircle, label: "Cancel", bg: "bg-red-500", ring: "ring-red-200", light: "bg-red-50 text-red-600" },
                    ].map((s) => {
                      const isActive = selected.status === s.key;
                      return (
                        <button
                          key={s.key}
                          onClick={() => !isActive && handleStatus(selected._id, s.key)}
                          className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-semibold transition-all duration-200 ${
                            isActive
                              ? `${s.bg} text-white shadow-md ring-2 ${s.ring} scale-[1.02]`
                              : `${s.light} hover:opacity-80 cursor-pointer`
                          }`}
                        >
                          <s.icon className={`text-sm ${isActive ? "drop-shadow-sm" : ""}`} />
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openEmailModal(selected)}
                    className="bg-emerald-600 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-200"
                  >
                    <FaPaperPlane className="text-[10px]" /> Send Email
                  </button>
                  <button
                    onClick={() => handleDelete(selected._id)}
                    className="bg-white text-red-500 text-xs font-semibold py-2.5 rounded-xl hover:bg-red-50 transition flex items-center justify-center gap-1.5 border border-red-200"
                  >
                    <FaTrash className="text-[10px]" /> Delete
                  </button>
                </div>
              </div>
            </div>
            );
          })() : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center sticky top-20 overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
              <div className="px-8 py-14">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <FaCalendarCheck className="text-3xl text-gray-300" />
                </div>
                <p className="text-gray-600 font-semibold mb-1.5">No Booking Selected</p>
                <p className="text-gray-400 text-sm leading-relaxed">Select a booking from the list to view<br/>complete details and manage it</p>
                <div className="flex items-center justify-center gap-1 mt-4 text-xs text-gray-300">
                  <FaArrowRight className="text-[10px] animate-pulse" />
                  <span>Click any booking card</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Email Modal */}
      {emailModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FaPaperPlane className="text-emerald-500" />
                  Send Email to Customer
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  To: {selected.name} &lt;{selected.email}&gt; {selected.packageTitle || selected.destinationTitle ? `\u2022 ${selected.packageTitle || selected.destinationTitle}` : ""}
                </p>
              </div>
              <button
                onClick={() => setEmailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Preset Templates */}
            <div className="px-5 pt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Quick Templates</label>
                {activePreset && (
                  <button
                    onClick={() => {
                      setActivePreset(null);
                      const tripName = selected.packageTitle || selected.destinationTitle || "your trip";
                      setEmailForm({
                        subject: `Regarding Your Booking \u2014 ${tripName} | Tripzo`,
                        body: `Hi ${selected.name},\n\nThank you for booking with Tripzo!\n\n\n\nBest regards,\nTeam Tripzo`,
                      });
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600 transition"
                  >
                    Clear template
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {getPresetTemplates(selected).map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                      activePreset === preset.id
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <span>{preset.icon}</span>
                    {preset.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setActivePreset("custom");
                    setEmailForm({
                      subject: ``,
                      body: `Hi ${selected.name},\n\n`,
                    });
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                    activePreset === "custom"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                  }`}
                >
                  <span>\u270f\ufe0f</span>
                  Custom Message
                </button>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="px-5 pt-4">
              <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-1">Booking Summary</div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                  {selected.packageTitle && <span>\ud83d\udce6 {selected.packageTitle}</span>}
                  {selected.destinationTitle && <span>\ud83d\udccd {selected.destinationTitle}</span>}
                  <span>\ud83d\udcc5 {selected.travelDate ? new Date(selected.travelDate).toLocaleDateString() : "N/A"}</span>
                  <span>\ud83d\udc65 {selected.travelers} travelers</span>
                  <span className={`font-medium ${selected.status === "confirmed" ? "text-blue-600" : selected.status === "pending" ? "text-amber-600" : selected.status === "completed" ? "text-emerald-600" : "text-red-600"}`}>\u25cf {selected.status}</span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="px-5 pb-2 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Subject</label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Message Body</label>
                <textarea
                  value={emailForm.body}
                  onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-5 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setEmailModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={emailSending}
                className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition flex items-center gap-2 disabled:opacity-60"
              >
                {emailSending ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <FaPaperPlane className="text-xs" />
                )}
                {emailSending ? "Sending..." : "Send Email"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
