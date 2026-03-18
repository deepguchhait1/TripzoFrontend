import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaCheckCircle,
} from "react-icons/fa";
import { submitContact } from "../services/api";
import toast from "react-hot-toast";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

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
      await submitContact(form);
      toast.success("Thank you! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setEmailTouched(false);
      setEmailError("");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-72 md:h-80 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600"
          alt="Contact Us"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Contact Us
            </h1>
            <p className="text-gray-200 text-lg max-w-xl mx-auto">
              Have questions? We'd love to hear from you. Get in touch with us!
            </p>
            <div className="flex items-center gap-2 text-gray-300 text-sm justify-center mt-4">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-emerald-400">Contact</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-24 relative z-10">
            {[
              {
                icon: FaPhoneAlt,
                title: "Call Us",
                info: "+91 123 456 7890",
                sub: "+91 987 654 3210",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: FaEnvelope,
                title: "Email Us",
                info: "tripzo.india.01@gmail.com",
                sub: "tripzo.india.01@gmail.com",
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                icon: FaMapMarkerAlt,
                title: "Visit Us",
                info: "123 Travel Tower",
                sub: "Connaught Place, New Delhi",
                color: "bg-purple-50 text-purple-600",
              },
              {
                icon: FaClock,
                title: "Working Hours",
                info: "Mon - Sat: 9AM - 7PM",
                sub: "Sunday: 10AM - 5PM",
                color: "bg-orange-50 text-orange-600",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center hover:shadow-xl transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-xl ${card.color} flex items-center dark:bg-gray-700 justify-center mx-auto mb-4`}
                >
                  <card.icon className="text-xl" />
                </div>
                <h3 className="font-bold dark:text-gray-300 text-gray-800 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm">{card.info}</p>
                <p className="text-gray-400 text-sm">{card.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
                Get in Touch
              </span>
              <h2 className="dark:text-gray-300 text-3xl font-bold text-gray-800 mt-2 mb-2">
                Send Us a Message
              </h2>
              <p className="text-gray-500 mb-8">
                Fill out the form below and our travel experts will get back to
                you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="dark:text-gray-400 text-sm font-medium text-gray-700 mb-1 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="dark:text-gray-400 text-sm font-medium text-gray-700 mb-1 block">
                      Email Address *
                    </label>
                    <div className="relative">
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
                        placeholder="john@example.com"
                        className={`w-full px-4 pr-10 py-3 rounded-xl border outline-none transition ${
                          emailTouched && form.email
                            ? emailError
                              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                              : "border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="dark:text-gray-400 text-sm font-medium text-gray-700 mb-1 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="dark:text-gray-400 text-sm font-medium text-gray-700 mb-1 block">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition text-gray-700"
                    >
                      <option value="">Select a topic</option>
                      <option value="booking">Booking Inquiry</option>
                      <option value="custom">Custom Package</option>
                      <option value="support">General Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="dark:text-gray-400 text-sm font-medium text-gray-700 mb-1 block">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your travel plans or questions..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-emerald-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-200 flex items-center gap-2 disabled:opacity-60"
                >
                  {sending ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <FaPaperPlane />
                  )}
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Map + Quick Connect */}
            <div>
              <div className="bg-gray-100 rounded-2xl overflow-hidden h-80 mb-8">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.695755994671!2d77.21714887549752!3d28.632892275664975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b741d057%3A0xcdee88e47393c3f1!2sConnaught%20Place%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Tripzo Location"
                />
              </div>

              {/* Quick Connect */}
              <div className="bg-emerald-600 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Quick Connect</h3>
                <p className="text-emerald-100 mb-6 text-sm">
                  Need immediate assistance? Reach out through any of these channels.
                </p>
                <div className="space-y-4">
                  <a
                    href="https://wa.me/911234567890"
                    className="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-3 hover:bg-white/20 transition"
                  >
                    <FaWhatsapp className="text-xl" />
                    <span>Chat on WhatsApp</span>
                  </a>
                  <a
                    href="tel:+911234567890"
                    className="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-3 hover:bg-white/20 transition"
                  >
                    <FaPhoneAlt />
                    <span>Call Us Now</span>
                  </a>
                </div>
                <div className="flex gap-3 mt-6">
                  {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
