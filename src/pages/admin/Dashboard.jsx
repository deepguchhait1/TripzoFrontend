import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaSuitcase,
  FaComments,
  FaBlog,
  FaEnvelope,
  FaCalendarCheck,
  FaArrowRight,
  FaArrowUp,
  FaRupeeSign,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { getStats, getBookings, getContacts } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { admin } = useAuth();

  useEffect(() => {
    Promise.all([getStats(), getBookings(), getContacts()])
      .then(([statsRes, bookingsRes, contactsRes]) => {
        setStats(statsRes.data);
        setBookings(bookingsRes.data);
        setContacts(contactsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = useMemo(() => bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0), [bookings]);

  const pendingCount = useMemo(() => bookings.filter((b) => b.status === "pending").length, [bookings]);
  const confirmedCount = useMemo(() => bookings.filter((b) => b.status === "confirmed").length, [bookings]);
  const completedCount = useMemo(() => bookings.filter((b) => b.status === "completed").length, [bookings]);
  const cancelledCount = useMemo(() => bookings.filter((b) => b.status === "cancelled").length, [bookings]);

  const recentBookings = useMemo(() => [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5), [bookings]);

  const recentContacts = useMemo(() => [...contacts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5), [contacts]);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const statusColors = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
    new: "bg-blue-100 text-blue-700",
    replied: "bg-emerald-100 text-emerald-700",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const overviewCards = stats
    ? [
        { label: "Destinations", value: stats.destinations, icon: FaMapMarkerAlt, gradient: "from-blue-500 to-blue-600", link: "/admin/destinations" },
        { label: "Packages", value: stats.packages, icon: FaSuitcase, gradient: "from-emerald-500 to-emerald-600", link: "/admin/packages" },
        { label: "Total Bookings", value: stats.bookings, icon: FaCalendarCheck, gradient: "from-cyan-500 to-cyan-600", link: "/admin/bookings" },
        { label: "New Messages", value: stats.newContacts, icon: FaEnvelope, gradient: "from-rose-500 to-rose-600", link: "/admin/contacts" },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <p className="text-emerald-100 text-sm font-medium mb-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {getGreeting()}, {admin?.name || "Admin"}!
          </h2>
          <p className="text-emerald-100 max-w-lg">
            Here{"'"}s what{"'"}s happening with your travel platform today. You have{" "}
            <span className="text-white font-semibold">{pendingCount} pending bookings</span> and{" "}
            <span className="text-white font-semibold">{stats?.newContacts || 0} new messages</span> to review.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`bg-gradient-to-br ${card.gradient} p-3 rounded-xl text-white`}>
                <card.icon className="text-lg" />
              </div>
              <FaArrowRight className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{card.value}</div>
            <div className="text-gray-500 text-sm">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Revenue & Content & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">Revenue Overview</h3>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <FaArrowUp className="text-[10px]" /> Active
            </span>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <FaRupeeSign className="text-gray-400 text-sm" />
            <span className="text-3xl font-bold text-gray-800">
              {totalRevenue.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-gray-400 text-xs mb-5">From confirmed & completed bookings</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-amber-700">{pendingCount}</div>
              <div className="text-xs text-amber-600 mt-0.5">Pending</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-blue-700">{confirmedCount}</div>
              <div className="text-xs text-blue-600 mt-0.5">Confirmed</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-emerald-700">{completedCount}</div>
              <div className="text-xs text-emerald-600 mt-0.5">Completed</div>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-red-700">{cancelledCount}</div>
              <div className="text-xs text-red-600 mt-0.5">Cancelled</div>
            </div>
          </div>
        </div>

        {/* Content Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Content Overview</h3>
          <div className="space-y-4">
            {[
              { label: "Destinations", value: stats?.destinations || 0, icon: FaMapMarkerAlt, color: "text-blue-500", bg: "bg-blue-50" },
              { label: "Packages", value: stats?.packages || 0, icon: FaSuitcase, color: "text-emerald-500", bg: "bg-emerald-50" },
              { label: "Testimonials", value: stats?.testimonials || 0, icon: FaComments, color: "text-purple-500", bg: "bg-purple-50" },
              { label: "Blog Posts", value: stats?.blogs || 0, icon: FaBlog, color: "text-orange-500", bg: "bg-orange-50" },
              { label: "Total Contacts", value: stats?.contacts || 0, icon: FaEnvelope, color: "text-pink-500", bg: "bg-pink-50" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${item.bg} p-2 rounded-lg`}>
                    <item.icon className={`${item.color} text-sm`} />
                  </div>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-2.5">
            {[
              { label: "Add Destination", link: "/admin/destinations", icon: FaMapMarkerAlt, color: "text-blue-600", bg: "bg-blue-50 hover:bg-blue-100" },
              { label: "Add Package", link: "/admin/packages", icon: FaSuitcase, color: "text-emerald-600", bg: "bg-emerald-50 hover:bg-emerald-100" },
              { label: "New Blog Post", link: "/admin/blogs", icon: FaBlog, color: "text-orange-600", bg: "bg-orange-50 hover:bg-orange-100" },
              { label: "View All Bookings", link: "/admin/bookings", icon: FaCalendarCheck, color: "text-cyan-600", bg: "bg-cyan-50 hover:bg-cyan-100" },
              { label: "View Messages", link: "/admin/contacts", icon: FaEnvelope, color: "text-rose-600", bg: "bg-rose-50 hover:bg-rose-100" },
            ].map((action, i) => (
              <Link
                key={i}
                to={action.link}
                className={`${action.bg} flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group`}
              >
                <action.icon className={`${action.color} text-sm`} />
                <span className={`text-sm font-medium ${action.color}`}>{action.label}</span>
                <FaArrowRight className={`${action.color} text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity`} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div>
              <h3 className="text-base font-semibold text-gray-800">Recent Bookings</h3>
              <p className="text-xs text-gray-400 mt-0.5">Latest booking activity</p>
            </div>
            <Link to="/admin/bookings" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
              View All <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentBookings.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No bookings yet</div>
            ) : (
              recentBookings.map((b) => (
                <div key={b._id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50/50 transition">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {b.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800 truncate">{b.name}</span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[b.status] || "bg-gray-100 text-gray-600"}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400 truncate">
                        {b.packageTitle || b.destinationTitle || "General Inquiry"}
                      </span>
                      <span className="text-gray-200">|</span>
                      <span className="text-xs text-gray-400">{b.travelers} travelers</span>
                      {b.totalPrice > 0 && (
                        <>
                          <span className="text-gray-200">|</span>
                          <span className="text-xs font-medium text-gray-500">&#8377;{b.totalPrice?.toLocaleString("en-IN")}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div>
              <h3 className="text-base font-semibold text-gray-800">Recent Messages</h3>
              <p className="text-xs text-gray-400 mt-0.5">Latest customer inquiries</p>
            </div>
            <Link to="/admin/contacts" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
              View All <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentContacts.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No messages yet</div>
            ) : (
              recentContacts.map((c) => (
                <div key={c._id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50/50 transition">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {c.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800 truncate">{c.name}</span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[c.status] || "bg-gray-100 text-gray-600"}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{c.subject || c.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
