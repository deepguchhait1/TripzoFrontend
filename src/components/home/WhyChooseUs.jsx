import {
  FaShieldAlt,
  FaHandshake,
  FaHeadset,
  FaTag,
  FaMapMarkedAlt,
  FaAward,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { getPublicStats } from "../../services/api";

const features = [
  {
    icon: FaShieldAlt,
    title: "Safe & Secure",
    description: "All tours come with comprehensive travel insurance and 24/7 emergency support.",
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    icon: FaTag,
    title: "Best Price Guarantee",
    description: "Most competitive prices guaranteed. Found lower? We'll match it instantly!",
    gradient: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    icon: FaMapMarkedAlt,
    title: "Handpicked Hotels",
    description: "Premium accommodations carefully selected for comfort, location, and value.",
    gradient: "from-violet-500 to-violet-600",
    bg: "bg-violet-50",
    iconColor: "text-violet-500",
  },
  {
    icon: FaHeadset,
    title: "24/7 Support",
    description: "Dedicated support team always available to assist before and during travel.",
    gradient: "from-orange-500 to-orange-600",
    bg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    icon: FaHandshake,
    title: "Trusted by 10K+",
    description: "Over 10,000 happy travelers trust us for their journey across India.",
    gradient: "from-pink-500 to-pink-600",
    bg: "bg-pink-50",
    iconColor: "text-pink-500",
  },
  {
    icon: FaAward,
    title: "Award Winning",
    description: "Recognized as one of India's best travel companies, 3 years running.",
    gradient: "from-amber-500 to-amber-600",
    bg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
];

/* Animated counter hook */
const useCounter = (end, duration = 2000, trigger = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger || !end) return;
    let start = 0;
    const step = Math.max(1, Math.floor(end / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, trigger]);
  return count;
};

const WhyChooseUs = () => {
  const [stats, setStats] = useState(null);
  const [visible, setVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    getPublicStats()
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const destCount = useCounter(stats?.destinations || 0, 1800, visible);
  const pkgCount = useCounter(stats?.packages || 0, 1800, visible);
  const custCount = useCounter(stats?.happyCustomers || 0, 2200, visible);
  const revCount = useCounter(stats?.testimonials || 0, 1400, visible);

  return (
    <section className="py-24 bg-gray-50/60 relative overflow-hidden">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Why Tripzo
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Why Travelers <span className="text-emerald-600">Choose Us</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            We're committed to making your travel dreams come true with
            unmatched service and expertise.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl p-7 border border-gray-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/30 transition-all duration-500 relative overflow-hidden"
            >
              {/* Hover accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feat.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />

              <div
                className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <feat.icon className={`text-xl ${feat.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feat.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div
          ref={statsRef}
          className="mt-16 relative rounded-3xl overflow-hidden"
        >
          {/* BG image */}
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-emerald-900/85 backdrop-blur-sm" />

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 p-10 md:p-14">
            {[
              { value: destCount, suffix: "+", label: "Destinations" },
              { value: pkgCount, suffix: "+", label: "Tour Packages" },
              { value: custCount, suffix: "+", label: "Happy Customers" },
              { value: revCount, suffix: "+", label: "Traveler Reviews" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-emerald-300/80 mt-2 text-sm font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
