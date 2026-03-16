import { useEffect, useState, useMemo } from "react";
import {
  FaUserShield,
  FaUserPlus,
  FaUsers,
  FaCrown,
  FaTrash,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaUser,
  FaSearch,
  FaShieldAlt,
  FaCalendarAlt,
  FaEye,
  FaEyeSlash,
  FaChartBar,
  FaHandshake,
  FaTicketAlt,
  FaCommentDots,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getAdmins, createAdmin, deleteAdmin, getAdminActivity, deleteActivityLog, clearAllActivityLogs } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const CHART_COLORS = [
  "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316",
];

const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6366f1"];

const AdminMembers = () => {
  const { admin: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("team");
  const [activity, setActivity] = useState(null);
  const [activityLoading, setActivityLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const isSuperAdmin = currentAdmin?.role === "superadmin";

  const fetchAdmins = () => {
    setLoading(true);
    getAdmins()
      .then((res) => setAdmins(res.data))
      .catch(() => toast.error("Failed to load team members"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdmins();
    fetchActivity();
  }, []);

  const fetchActivity = () => {
    setActivityLoading(true);
    getAdminActivity()
      .then((res) => setActivity(res.data))
      .catch(() => {})
      .finally(() => setActivityLoading(false));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("Name, email, and password are required");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setCreating(true);
    try {
      await createAdmin(form);
      toast.success("Admin member added successfully!");
      setShowModal(false);
      setForm({ name: "", email: "", password: "", phone: "" });
      setShowPassword(false);
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create admin");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from the admin team? This action cannot be undone.`)) return;
    try {
      await deleteAdmin(id);
      toast.success("Admin removed successfully");
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove admin");
    }
  };

  const filteredAdmins = useMemo(() => admins.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase())
  ), [admins, search]);

  const superAdminCount = useMemo(() => admins.filter((a) => a.role === "superadmin").length, [admins]);
  const adminCount = useMemo(() => admins.filter((a) => a.role === "admin").length, [admins]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUsers className="text-emerald-600" />
            Team Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your admin team, track activity & performance</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition shadow-sm shadow-emerald-200"
          >
            <FaUserPlus className="text-sm" />
            Add New Admin
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex gap-1">
        {[
          { id: "team", label: "Team Members", icon: FaUsers },
          { id: "activity", label: "Activity & Stats", icon: FaChartBar },
          ...(isSuperAdmin
            ? [{ id: "handled", label: "Handled Customers", icon: FaHandshake }]
            : []),
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <tab.icon className="text-xs" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== TEAM TAB ===== */}
      {activeTab === "team" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-2.5 rounded-xl">
                  <FaUsers className="text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{admins.length}</div>
                  <div className="text-xs text-gray-500">Total Members</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-amber-50 p-2.5 rounded-xl">
                  <FaCrown className="text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{superAdminCount}</div>
                  <div className="text-xs text-gray-500">Super Admins</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2.5 rounded-xl">
                  <FaShieldAlt className="text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{adminCount}</div>
                  <div className="text-xs text-gray-500">Admins</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-3">
            {filteredAdmins.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                <FaUsers className="text-4xl text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No members found</p>
              </div>
            ) : (
              filteredAdmins.map((member) => {
                const isMe = member._id === currentAdmin?._id || member._id === currentAdmin?.id;
                const isMemberSuperAdmin = member.role === "superadmin";
                const memberActivity = activity?.adminActivity?.find((a) => a._id === member._id);
                return (
                  <div
                    key={member._id}
                    className={`bg-white rounded-2xl shadow-sm border transition-all overflow-hidden ${
                      isMe ? "border-emerald-200 ring-1 ring-emerald-100" : "border-gray-100 hover:border-gray-200 hover:shadow-md"
                    }`}
                  >
                    {/* Role accent */}
                    <div className={`h-1 w-full ${isMemberSuperAdmin ? "bg-gradient-to-r from-amber-400 to-orange-400" : "bg-gradient-to-r from-blue-400 to-indigo-400"}`} />

                    <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-2xl object-cover shadow-lg" />
                        ) : (
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                            isMemberSuperAdmin
                              ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-100"
                              : "bg-gradient-to-br from-blue-400 to-indigo-500 shadow-blue-100"
                          }`}>
                            {member.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                        {isMemberSuperAdmin && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                            <FaCrown className="text-[8px] text-white" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-800 truncate">{member.name}</h3>
                          {isMe && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                              You
                            </span>
                          )}
                        </div>
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          isMemberSuperAdmin
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}>
                          {isMemberSuperAdmin ? <FaCrown className="text-[9px]" /> : <FaShieldAlt className="text-[9px]" />}
                          {isMemberSuperAdmin ? "Super Admin" : "Admin"}
                        </span>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                          <span className="text-xs text-gray-500 flex items-center gap-1.5">
                            <FaEnvelope className="text-gray-400 text-[10px]" />
                            {member.email}
                          </span>
                          {member.phone && (
                            <span className="text-xs text-gray-500 flex items-center gap-1.5">
                              <FaPhone className="text-gray-400 text-[10px]" />
                              {member.phone}
                            </span>
                          )}
                          <span className="text-xs text-gray-400 flex items-center gap-1.5">
                            <FaCalendarAlt className="text-gray-300 text-[10px]" />
                            Joined {new Date(member.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        {/* Handled count badges */}
                        {memberActivity && memberActivity.totalHandled > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <FaTicketAlt className="text-[9px]" />
                              {memberActivity.bookingsHandled} bookings
                            </span>
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 flex items-center gap-1">
                              <FaCommentDots className="text-[9px]" />
                              {memberActivity.contactsHandled} contacts
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isSuperAdmin && !isMemberSuperAdmin && !isMe && (
                          <button
                            onClick={() => handleDelete(member._id, member.name)}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                            title="Remove admin"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        )}
                        {isMemberSuperAdmin && !isMe && (
                          <span className="text-[10px] text-gray-400 font-medium px-2 py-1 bg-gray-50 rounded-lg">
                            Protected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Info Banner for regular admins */}
          {!isSuperAdmin && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
              <FaShieldAlt className="text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">Admin Access</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  You have full admin access to manage content, bookings, and contacts. Only Super Admins can add or remove team members.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ===== ACTIVITY TAB ===== */}
      {activeTab === "activity" && (
        <>
          {activityLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
          ) : activity ? (
            <>
              {/* Performance Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activity.adminActivity?.map((admin, i) => {
                  const topPerformer =
                    activity.adminActivity.length > 1 &&
                    admin.totalHandled ===
                      Math.max(...activity.adminActivity.map((a) => a.totalHandled)) &&
                    admin.totalHandled > 0;
                  return (
                    <div
                      key={admin._id}
                      className={`bg-white rounded-2xl p-4 shadow-sm border overflow-hidden relative ${
                        topPerformer ? "border-emerald-200 ring-1 ring-emerald-100" : "border-gray-100"
                      }`}
                    >
                      {topPerformer && (
                        <div className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          Top
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-3">
                        {admin.avatar ? (
                          <img src={admin.avatar} alt={admin.name} className="w-10 h-10 rounded-xl object-cover shadow" />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow"
                            style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                          >
                            {admin.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-800 text-sm truncate">{admin.name}</div>
                          <div className="text-[11px] text-gray-400 capitalize">{admin.role}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="text-lg font-bold text-gray-800">{admin.totalHandled}</div>
                          <div className="text-[10px] text-gray-500">Total</div>
                        </div>
                        <div className="bg-emerald-50 rounded-lg p-2">
                          <div className="text-lg font-bold text-emerald-700">{admin.bookingsHandled}</div>
                          <div className="text-[10px] text-emerald-600">Bookings</div>
                        </div>
                        <div className="bg-violet-50 rounded-lg p-2">
                          <div className="text-lg font-bold text-violet-700">{admin.contactsHandled}</div>
                          <div className="text-[10px] text-violet-600">Contacts</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Activity Timeline Chart */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <FaChartBar className="text-emerald-600 text-xs" />
                  Activity Timeline (Last 30 Days)
                </h3>
                <p className="text-xs text-gray-400 mb-4">Actions handled by each admin per day</p>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activity.timeline || []}>
                      <defs>
                        {activity.adminNames?.map((name, i) => (
                          <linearGradient key={name} id={`color-${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                        tickFormatter={(d) => {
                          const date = new Date(d);
                          return `${date.getDate()}/${date.getMonth() + 1}`;
                        }}
                        interval="preserveStartEnd"
                      />
                      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e5e7eb",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          fontSize: "12px",
                        }}
                        labelFormatter={(d) =>
                          new Date(d).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        }
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                        iconType="circle"
                        iconSize={8}
                      />
                      {activity.adminNames?.map((name, i) => (
                        <Area
                          key={name}
                          type="monotone"
                          dataKey={name}
                          stroke={CHART_COLORS[i % CHART_COLORS.length]}
                          fill={`url(#color-${i})`}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, strokeWidth: 2 }}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Breakdown Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Booking Status Pie */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaTicketAlt className="text-emerald-600 text-xs" />
                    Booking Status Breakdown
                  </h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Confirmed", value: activity.statusBreakdown?.bookings?.confirmed || 0 },
                            { name: "Pending", value: activity.statusBreakdown?.bookings?.pending || 0 },
                            { name: "Cancelled", value: activity.statusBreakdown?.bookings?.cancelled || 0 },
                            { name: "Completed", value: activity.statusBreakdown?.bookings?.completed || 0 },
                          ].filter((d) => d.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {PIE_COLORS.map((color, i) => (
                            <Cell key={i} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "10px",
                            border: "1px solid #e5e7eb",
                            fontSize: "12px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "11px" }} iconType="circle" iconSize={8} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Admin Comparison Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUsers className="text-blue-600 text-xs" />
                    Admin Performance Comparison
                  </h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={activity.adminActivity?.map((a) => ({
                          name: a.name?.split(" ")[0],
                          Bookings: a.bookingsHandled,
                          Contacts: a.contactsHandled,
                        }))}
                        barCategoryGap="20%"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "10px",
                            border: "1px solid #e5e7eb",
                            fontSize: "12px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "11px" }} iconType="circle" iconSize={8} />
                        <Bar dataKey="Bookings" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Contacts" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <FaChartBar className="text-4xl text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No activity data available</p>
            </div>
          )}
        </>
      )}

      {/* ===== HANDLED CUSTOMERS TAB (Superadmin Only) ===== */}
      {activeTab === "handled" && isSuperAdmin && (
        <>
          {activityLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
          ) : activity?.handledCustomers?.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <FaHandshake className="text-emerald-600" />
                    Customer Handling Log
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Shows which admin handled each customer (most recent first)
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (!window.confirm("Clear ALL handling logs? This will unlink all admins from bookings/contacts.")) return;
                    try {
                      await clearAllActivityLogs();
                      toast.success("All logs cleared");
                      fetchActivity();
                    } catch {
                      toast.error("Failed to clear logs");
                    }
                  }}
                  className="text-xs px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition flex items-center gap-1.5"
                >
                  <FaTrash className="text-[10px]" /> Clear All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/80">
                      <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Detail</th>
                      <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Handled By</th>
                      <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="text-right py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {activity.handledCustomers.map((item) => {
                      const statusColors = {
                        confirmed: "bg-emerald-50 text-emerald-700",
                        pending: "bg-amber-50 text-amber-700",
                        cancelled: "bg-red-50 text-red-700",
                        completed: "bg-blue-50 text-blue-700",
                        new: "bg-gray-50 text-gray-700",
                        read: "bg-blue-50 text-blue-700",
                        replied: "bg-emerald-50 text-emerald-700",
                      };
                      return (
                        <tr key={`${item.type}-${item._id}`} className="hover:bg-gray-50/50 transition">
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-800">{item.customerName}</div>
                            <div className="text-[11px] text-gray-400">{item.customerEmail}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                              item.type === "booking"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-violet-50 text-violet-700 border border-violet-200"
                            }`}>
                              {item.type === "booking" ? (
                                <FaTicketAlt className="text-[9px]" />
                              ) : (
                                <FaCommentDots className="text-[9px]" />
                              )}
                              {item.type === "booking" ? "Booking" : "Contact"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-600 text-xs">{item.detail}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                              statusColors[item.status] || "bg-gray-50 text-gray-700"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {item.handledBy?.avatar ? (
                                <img src={item.handledBy.avatar} alt={item.handledBy.name} className="w-6 h-6 rounded-full object-cover" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-[10px] font-bold">
                                  {item.handledBy?.name?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                              )}
                              <span className="text-xs font-medium text-gray-700">
                                {item.handledBy?.name || "Unknown"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-xs text-gray-400">
                              {new Date(item.date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={async () => {
                                if (!window.confirm("Remove this log entry?")) return;
                                try {
                                  await deleteActivityLog(item.type, item._id);
                                  toast.success("Log entry removed");
                                  fetchActivity();
                                } catch {
                                  toast.error("Failed to remove log");
                                }
                              }}
                              className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition"
                              title="Remove log entry"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <FaHandshake className="text-4xl text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No handled customers yet</p>
              <p className="text-xs text-gray-300 mt-1">
                When admins handle bookings or contacts, they'll appear here
              </p>
            </div>
          )}
        </>
      )}

      {/* Create Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FaUserPlus className="text-emerald-500" />
                    Add New Admin
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    This member will have full admin access but cannot manage other admins
                  </p>
                </div>
                <button
                  onClick={() => { setShowModal(false); setForm({ name: "", email: "", password: "", phone: "" }); setShowPassword(false); }}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCreate} className="text-gray-600 p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name *</label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email Address *</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="admin@tripzo.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password *</label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    minLength={6}
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="relative">
                  <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm"
                  />
                </div>
              </div>

              {/* Role Badge */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 flex items-center gap-2.5">
                <FaShieldAlt className="text-blue-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-blue-800">Role: Admin</p>
                  <p className="text-[11px] text-blue-600">Full access to manage content, bookings, contacts & emails. Cannot manage team members.</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setForm({ name: "", email: "", password: "", phone: "" }); setShowPassword(false); }}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition flex items-center gap-2 disabled:opacity-60 shadow-sm shadow-emerald-200"
                >
                  {creating ? (
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <FaUserPlus className="text-xs" />
                  )}
                  {creating ? "Adding..." : "Add Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMembers;
