import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaRocket, FaMapMarkedAlt, FaSuitcase, FaTicketAlt } from "react-icons/fa";
import { setupFirstAdmin } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const AdminSetup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = form;

    if (!name.trim()) return toast.error("Name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
      return toast.error("Please enter a valid email");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const { data } = await setupFirstAdmin({ name: name.trim(), email: email.trim(), password });
      login(data.token, data.admin);
      toast.success("Super Admin created! Welcome to Tripzo.");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-800 items-center justify-center p-12 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-125 h-125 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/5 rounded-[50%] blur-xl" />

        <div className="relative z-10 max-w-md text-center">
          <img
            src="/logo.jpeg"
            alt="Tripzo"
            className="h-24 w-24 rounded-full object-cover mx-auto mb-8 shadow-lg ring-4 bg-white/90 mix-blend-multiply"
            style={{ "--tw-ring-color": "#00BC7D" }}
          />
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Trip<span className="text-emerald-200">zo</span> Setup
          </h1>
          <p className="text-emerald-100 text-lg leading-relaxed mb-10">
            Welcome! Create your first Super Admin account to get started with the Tripzo admin panel.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Destinations", icon: <FaMapMarkedAlt className="text-2xl text-white/90" /> },
              { label: "Packages", icon: <FaSuitcase className="text-2xl text-white/90" /> },
              { label: "Bookings", icon: <FaTicketAlt className="text-2xl text-white/90" /> },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center"
              >
                <span className="block mb-2 flex justify-center">{item.icon}</span>
                <span className="text-white/80 text-xs font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Setup Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center gap-2.5 mb-2">
              <img
                src="/logo.jpeg"
                alt="Tripzo"
                className="h-12 w-12 rounded-full object-cover ring-2 shadow-md bg-white mix-blend-multiply"
                style={{ "--tw-ring-color": "#00BC7D" }}
              />
              <span className="text-2xl font-extrabold text-gray-900">
                Trip<span className="text-emerald-600">zo</span>
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <FaRocket className="text-[10px]" /> First-Time Setup
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Create Super Admin
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Set up your first admin account to manage Tripzo
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-emerald-100 mt-2"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <FaRocket /> Create & Get Started
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-8">
            This setup is available only once &bull; First Super Admin account
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
