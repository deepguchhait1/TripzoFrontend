import { Link } from "react-router-dom";
import { FaArrowRight, FaPlay } from "react-icons/fa";

const CTASection = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2rem] overflow-hidden min-h-[480px]">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1400"
            alt="Travel CTA"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Multi-layer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/70 to-gray-950/40" />
          <div className="absolute inset-0 bg-emerald-900/30" />

          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-400/15 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10 flex items-center min-h-[480px] p-8 md:p-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md rounded-full px-4 py-1.5 text-sm font-semibold text-emerald-300 mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Limited Time Offer
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
                Get <span className="text-emerald-400">25% Off</span> On Your
                First Booking
              </h2>

              <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl">
                Sign up today and unlock exclusive discounts on premium tour
                packages. Your dream vacation is just a click away.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/booking"
                  className="group relative bg-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Book Now
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
                <Link
                  to="/contact"
                  className="group flex items-center gap-3 text-white/90 px-8 py-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 font-medium hover:-translate-y-0.5"
                >
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <FaPlay className="text-[10px] ml-0.5" />
                  </span>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
