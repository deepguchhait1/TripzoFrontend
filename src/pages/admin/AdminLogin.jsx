import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash, FaSyncAlt, FaShieldAlt, FaMapMarkedAlt, FaSuitcase, FaTicketAlt } from "react-icons/fa";
import { loginAdmin, getSetupStatus } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const generateCaptcha = () => {
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;
  if (op === "+") {
    a = Math.floor(Math.random() * 50) + 1;
    b = Math.floor(Math.random() * 50) + 1;
    answer = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 50) + 10;
    b = Math.floor(Math.random() * a);
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 12) + 1;
    b = Math.floor(Math.random() * 12) + 1;
    answer = a * b;
  }
  return { question: `${a} ${op} ${b}`, answer };
};

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [captcha, setCaptcha] = useState(() => generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // Redirect to setup if no admin exists
  useEffect(() => {
    getSetupStatus()
      .then(({ data }) => {
        if (data.needsSetup) navigate("/admin/setup", { replace: true });
      })
      .catch(() => {})
      .finally(() => setCheckingSetup(false));
  }, [navigate]);

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  }, []);

  useEffect(() => {
    refreshCaptcha();
  }, [refreshCaptcha]);

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(form.email.trim());
    if (emailErr) {
      toast.error(emailErr);
      return;
    }
    if (!form.password) {
      toast.error("Password is required");
      return;
    }
    if (parseInt(captchaInput, 10) !== captcha.answer) {
      toast.error("Incorrect CAPTCHA answer");
      refreshCaptcha();
      return;
    }
    setLoading(true);
    try {
      const { data } = await loginAdmin(form);
      login(data.token, data.admin);
      toast.success("Welcome back, Admin!");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  if (checkingSetup) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-800 items-center justify-center p-12 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-125 h-125 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/5 rounded-[50%] blur-xl" />

        <div className="relative z-10 max-w-md text-center">
          <img
            src="/logo.jpeg"
            alt="Tripzo"
            className="h-24 w-24 rounded-full object-cover mx-auto mb-8 shadow-lg ring-4 bg-white/90 mix-blend-multiply"
            style={{ '--tw-ring-color': '#00BC7D' }}
          />
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Trip<span className="text-emerald-200">zo</span> Admin
          </h1>
          <p className="text-emerald-100 text-lg leading-relaxed mb-10">
            Manage your travel platform, destinations, packages, and customer bookings all in one place.
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

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center gap-2.5 mb-2">
              <img
                src="/logo.jpeg"
                alt="Tripzo"
                className="h-12 w-12 rounded-full object-cover ring-2 shadow-md bg-white mix-blend-multiply"
                style={{ '--tw-ring-color': '#00BC7D' }}
              />
              <span className="text-2xl font-extrabold text-gray-900">
                Trip<span className="text-emerald-600">zo</span>
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Sign in to your admin account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="username"
                    className="text-gray-600 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm"
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
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="text-gray-600 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm"
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

            {/* CAPTCHA */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <FaShieldAlt className="text-emerald-500 text-xs" /> Security Check
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-100 rounded-xl px-4 py-3 flex items-center justify-between select-none">
                  <span className="text-lg font-bold text-gray-800 tracking-widest font-mono">
                    {captcha.question} = ?
                  </span>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="text-gray-400 hover:text-emerald-600 transition-colors p-1"
                    title="New question"
                  >
                    <FaSyncAlt className="text-xs" />
                  </button>
                </div>
                  <input
                    type="number"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    required
                    placeholder="Answer"
                    className="text-gray-600 w-24 px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm text-center font-semibold transition-all"
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
                  <FaSignInAlt /> Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-400 text-xs mt-8">
            Protected area &bull; Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
