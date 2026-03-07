import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaMapMarkerAlt,
  FaSuitcase,
  FaComments,
  FaBlog,
  FaEnvelope,
  FaCalendarCheck,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaChevronRight,
  FaUserCog,
  FaUsers,
  FaRegNewspaper,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const sidebarLinks = [
  { path: "/admin", icon: FaTachometerAlt, label: "Dashboard", exact: true },
  { path: "/admin/destinations", icon: FaMapMarkerAlt, label: "Destinations" },
  { path: "/admin/packages", icon: FaSuitcase, label: "Packages" },
  { path: "/admin/testimonials", icon: FaComments, label: "Testimonials" },
  { path: "/admin/blogs", icon: FaBlog, label: "Blogs" },
  { path: "/admin/contacts", icon: FaEnvelope, label: "Contacts" },
  { path: "/admin/bookings", icon: FaCalendarCheck, label: "Bookings" },
  { path: "/admin/subscribers", icon: FaRegNewspaper, label: "Subscribers" },
  { path: "/admin/team", icon: FaUsers, label: "Team" },
  { path: "/admin/profile", icon: FaUserCog, label: "My Profile" },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const isActive = (link) =>
    link.exact
      ? location.pathname === link.path
      : location.pathname.startsWith(link.path);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-gray-800 flex items-center justify-between shrink-0">
          <Link to="/admin" className="flex items-center gap-2">
            <img
              src="/logo.jpeg"
              alt="Tripzo"
              className="h-11 w-11 rounded-full object-cover ring-2 shadow-md"
              style={{ "--tw-ring-color": "#00BC7D" }}
            />
            <span className="text-xl font-bold">
              Trip<span className="text-emerald-500">zo</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(link)
                  ? "bg-emerald-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <link.icon className="text-lg" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-1 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <FaHome className="text-lg" />
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-white hover:bg-red-600/20 transition"
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/60 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 text-xl hover:text-gray-800 transition"
            >
              <FaBars />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <Link to="/admin" className="text-gray-400 hover:text-emerald-600 transition">
                Admin
              </Link>
              <FaChevronRight className="text-gray-300 text-[10px]" />
              <span className="text-gray-700 font-medium capitalize">
                {location.pathname === "/admin"
                  ? "Dashboard"
                  : location.pathname.split("/").pop()}
              </span>
            </div>
            <h1 className="sm:hidden text-lg font-semibold text-gray-800 capitalize">
              {location.pathname === "/admin"
                ? "Dashboard"
                : location.pathname.split("/").pop()}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/profile" className="flex items-center gap-2.5 pl-1 hover:opacity-80 transition">
              {admin?.avatar ? (
                <img src={admin.avatar} alt={admin.name} className="w-9 h-9 rounded-full object-cover shadow-sm" />
              ) : (
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">
                    {admin?.name?.charAt(0) || "A"}
                  </span>
                </div>
              )}
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-gray-800 leading-tight">
                  {admin?.name || "Admin"}
                </div>
                <div className="text-[11px] text-gray-400 leading-tight">{admin?.role === "superadmin" ? "Super Admin" : "Administrator"}</div>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
