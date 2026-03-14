import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaArrowRight,
} from "react-icons/fa";
import { subscribeNewsletter } from "../services/api";
import toast from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

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

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const error = validateEmail(email.trim());
    if (error) {
      toast.error(error);
      return;
    }
    setSubscribing(true);
    try {
      const { data } = await subscribeNewsletter({ email: email.trim() });
      toast.success(data.message);
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to subscribe");
    } finally {
      setSubscribing(false);
    }
  };
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400">
      {/* Newsletter */}
      <div className="bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-emerald-100 mt-1">
                Get exclusive deals and travel inspiration delivered to your inbox
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-5 py-3 rounded-full bg-white/20 text-white placeholder-emerald-200 border border-white/30 focus:outline-none focus:bg-white/30 w-full md:w-80"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="bg-white text-emerald-600 px-6 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors whitespace-nowrap flex items-center gap-2 disabled:opacity-60"
              >
                {subscribing ? "Subscribing..." : "Subscribe"} {!subscribing && <FaArrowRight />}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src="/logo.jpeg"
                alt="Tripzo"
                className="h-12 w-12 rounded-full object-cover ring-2 shadow-md"
                style={{ '--tw-ring-color': '#00BC7D' }}
              />
              <span className="text-2xl font-bold text-white">
                Trip<span className="text-emerald-500">zo</span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6">
              Your trusted travel partner for exploring the incredible beauty of India.
              We craft unforgettable journeys with personalized experiences.
            </p>
            <div className="flex gap-3">
              {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-colors"
                  >
                    <Icon className="text-sm" />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "Destinations", path: "/destinations" },
                { label: "Tour Packages", path: "/packages" },
                { label: "About Us", path: "/about" },
                { label: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-emerald-400 transition-colors flex items-center gap-2"
                  >
                    <FaArrowRight className="text-xs text-emerald-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Destinations */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">
              Top Destinations
            </h4>
            <ul className="space-y-3">
              {["Jaipur", "Kerala", "Goa", "Ladakh", "Manali", "Varanasi"].map(
                (dest) => (
                  <li key={dest}>
                    <Link
                      to="/destinations"
                      className="hover:text-emerald-400 transition-colors flex items-center gap-2"
                    >
                      <FaArrowRight className="text-xs text-emerald-500" />
                      {dest}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">
              Contact Info
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-emerald-500 mt-1 shrink-0" />
                <span>123 Travel Tower, Connaught Place, New Delhi, 110001</span>
              </li>
              <li>
                <a
                  href="tel:+911234567890"
                  className="flex items-center gap-3 hover:text-emerald-400 transition"
                >
                  <FaPhoneAlt className="text-emerald-500 shrink-0" />
                  +91 123 456 7890
                </a>
              </li>
              <li>
                <a
                  href="mailto:tripzo.india.01@gmail.com"
                  className="flex items-center gap-3 hover:text-emerald-400 transition"
                >
                  <FaEnvelope className="text-emerald-500 shrink-0" />
                  tripzo.india.01@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            © 2026 Tripzo. All rights reserved. Made with ❤️ in India.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
