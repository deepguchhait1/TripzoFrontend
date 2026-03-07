import { useState, useEffect, useCallback } from "react";
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getTestimonials } from "../../services/api";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials()
      .then((res) => setTestimonials(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const next = useCallback(
    () => setActive((prev) => (prev + 1) % testimonials.length),
    [testimonials.length]
  );
  const prev = useCallback(
    () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length),
    [testimonials.length]
  );

  // Auto-advance
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next, testimonials.length]);

  if (loading) {
    return (
      <section className="py-24">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  const t = testimonials[active];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            What Travelers <span className="text-emerald-600">Say</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            Real stories from real travelers who explored India with Tripzo.
          </p>
        </div>

        {/* Testimonial card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gray-50 rounded-3xl border border-gray-100 p-8 md:p-12 lg:p-14">
            {/* Quote icon */}
            <div className="absolute -top-5 left-10 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <FaQuoteLeft className="text-white text-sm" />
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-base ${
                    i < t.rating ? "text-amber-400" : "text-gray-200"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-400 ml-2 font-medium">{t.rating}.0</span>
            </div>

            {/* Quote text */}
            <blockquote
              key={`quote-${active}`}
              className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8 min-h-[80px] animate-[fadeIn_0.5s_ease-out]"
            >
              &ldquo;{t.text}&rdquo;
            </blockquote>

            {/* Author + nav */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div
                key={`author-${active}`}
                className="flex items-center gap-4 animate-[fadeIn_0.5s_ease-out]"
              >
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-100"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-base">
                    {t.name}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {t.location} &bull; {t.tour}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={prev}
                  className="w-11 h-11 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-200 transition-all active:scale-95"
                >
                  <FaChevronLeft className="text-gray-500 text-sm" />
                </button>
                <span className="text-sm text-gray-400 font-mono min-w-[48px] text-center">
                  {String(active + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                </span>
                <button
                  onClick={next}
                  className="w-11 h-11 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-200 transition-all active:scale-95"
                >
                  <FaChevronRight className="text-gray-500 text-sm" />
                </button>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="relative h-1.5 rounded-full overflow-hidden transition-all"
                style={{ width: i === active ? 40 : 20 }}
              >
                <div className="absolute inset-0 bg-gray-200 rounded-full" />
                {i === active && (
                  <div className="absolute inset-0 bg-emerald-500 rounded-full animate-[progressBar_7s_linear]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
