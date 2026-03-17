import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaChevronRight,
  FaCompass,
  FaStar,
  FaSearch,
  FaRegClock,
  FaPlay,
} from "react-icons/fa";
import {
  HiArrowLongRight,
  HiOutlineTicket,
  HiOutlineGlobeAlt,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { getDestinations, getPublicStats } from "../../services/api";
import SearchSuggestions from "../SearchSuggestions";

/* ───── fallback slides ───── */
const fallbackSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600",
    title: "Discover Incredible India",
    subtitle:
      "Explore ancient heritage, breathtaking landscapes, and vibrant cultures",
    location: "Taj Mahal, Agra",
    tag: "Heritage",
  },
  {
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1600",
    title: "Royal Rajasthan Awaits",
    subtitle:
      "Experience the grandeur of palaces, forts, and desert safaris",
    location: "Hawa Mahal, Jaipur",
    tag: "Culture",
  },
  {
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600",
    title: "God's Own Country",
    subtitle:
      "Cruise through serene backwaters and lush tropical paradise",
    location: "Backwaters, Kerala",
    tag: "Nature",
  },
];

/* ───── component ───── */
const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const [slides, setSlides] = useState(fallbackSlides);
  const [stats, setStats] = useState({
    destinations: 0,
    packages: 0,
    happyCustomers: 0,
    testimonials: 0,
  });
  const [searchDest, setSearchDest] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  /* fetch data */
  useEffect(() => {
    getDestinations({ limit: 4 })
      .then((res) => {
        if (res.data.length >= 2) {
          setSlides(
            res.data.map((d) => ({
              image: d.image,
              title: d.name,
              subtitle: d.description,
              location: `${d.name}, ${d.state}`,
              tag: d.category || "Explore",
            }))
          );
        }
      })
      .catch(() => {});
    getPublicStats()
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  /* subtle parallax on mouse move */
  useEffect(() => {
    const handleMouse = (e) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    };
    const el = sectionRef.current;
    el?.addEventListener("mousemove", handleMouse);
    return () => el?.removeEventListener("mousemove", handleMouse);
  }, []);

  /* slide navigation */
  const goTo = useCallback(
    (idx) => {
      if (idx === current) return;
      setPrevSlide(current);
      setCurrent(idx);
      setProgress(0);
      setTimeout(() => setPrevSlide(null), 1100);
    },
    [current]
  );

  const nextSlide = useCallback(
    () => goTo((current + 1) % slides.length),
    [current, slides.length, goTo]
  );

  /* progress bar — 7s per slide */
  useEffect(() => {
    const SLIDE_MS = 7000;
    const TICK = 50;
    const inc = (TICK / SLIDE_MS) * 100;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          nextSlide();
          return 0;
        }
        return p + inc;
      });
    }, TICK);
    return () => clearInterval(id);
  }, [nextSlide]);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchDest.trim())
      navigate(`/search?q=${encodeURIComponent(searchDest.trim())}`);
    else navigate("/destinations");
  };

  const handleSuggestionSelect = (item) => {
    setShowSuggestions(false);
    const path = item.type === "destination" ? `/destinations/${item._id}` : `/packages/${item._id}`;
    navigate(path);
  };

  const nextIndex = (current + 1) % slides.length;

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-190 overflow-hidden bg-gray-950 select-none"
    >
      {/* ══════ BACKGROUND IMAGES ══════ */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-1400 ease-in-out"
          style={{
            opacity: index === current ? 1 : 0,
            zIndex: index === current ? 2 : index === prevSlide ? 1 : 0,
          }}
        >
          <div
            className="w-full h-full"
            style={{
              transform: `translate(${mousePos.x * -8}px, ${mousePos.y * -8}px) scale(1.06)`,
              transition: "transform 0.6s cubic-bezier(.25,.46,.45,.94)",
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover will-change-transform transition-transform duration-9000 ease-out ${
                index === current ? "scale-[1.12]" : "scale-100"
              }`}
            />
          </div>
        </div>
      ))}

      {/* ══════ OVERLAYS ══════ */}
      <div className="absolute inset-0 z-3 bg-linear-to-b from-gray-950/70 via-gray-950/25 to-gray-950" />
      <div className="absolute inset-0 z-3 bg-linear-to-r from-gray-950/80 via-gray-950/30 to-transparent" />
      <div className="absolute inset-0 z-3 bg-[radial-gradient(ellipse_at_70%_20%,rgba(16,185,129,0.08),transparent_60%)]" />

      {/* film-grain */}
      <div
        className="absolute inset-0 z-4 opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ══════ LEFT VERTICAL SLIDE NAV ══════ */}
      <div className="hidden lg:flex absolute left-6 xl:left-10 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-6">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
              className={`group flex items-center gap-3 text-white dark:text-gray-200`}
          >
            {/* number */}
            <span
                className={`text-xs font-mono font-bold transition-all duration-500 ${
                  i === current
                    ? "text-emerald-400 dark:text-emerald-400 scale-110"
                    : "text-white/25 dark:text-gray-400 group-hover:text-white/50 dark:group-hover:text-gray-200"
                }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {/* bar */}
            <div
                className={`rounded-full overflow-hidden transition-all duration-500 ${
                  i === current ? "w-1.5 h-12 bg-white/15 dark:bg-gray-700" : "w-1 h-5 bg-white/15 dark:bg-gray-700 group-hover:bg-white/25 dark:group-hover:bg-gray-500"
                }`}
            >
              {i === current && (
                <div
                  className="w-full bg-emerald-400 dark:bg-emerald-400 rounded-full transition-none"
                  style={{ height: `${progress}%` }}
                />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* ══════ MAIN CONTENT ══════ */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 w-full">
          <div className="grid lg:grid-cols-[1fr_420px] gap-10 xl:gap-16 items-center">
            {/* ─── LEFT COL ─── */}
            <div>
              {/* Tag badge */}
              <div
                key={`tag-${current}`}
                className="inline-flex items-center gap-2.5 mb-8 animate-[heroFadeUp_0.6s_ease-out]"
              >
                <span className="flex items-center gap-2 bg-white/7 backdrop-blur-xl border border-white/10 rounded-full pl-3 pr-4 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    {slides[current].tag || "Explore"}
                  </span>
                </span>
                <span className="text-white/30 text-xs">|</span>
                  <span className="text-white/50 dark:text-gray-400 text-xs font-medium flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-[10px] text-emerald-400/70 dark:text-emerald-400" />
                  {slides[current].location}
                </span>
              </div>

              {/* Title — split first two words normal, rest outlined */}
              <h1
                 key={`title-${current}`}
                 className="mb-6 animate-[heroFadeUp_0.75s_ease-out] text-white dark:text-gray-200"
              >
                {slides[current].title.split(" ").map((word, wi, arr) => {
                  if (wi < Math.min(2, arr.length - 1)) {
                    return (
                      <span
                        key={wi}
                        className="text-[2.75rem] sm:text-6xl lg:text-[4.25rem] xl:text-[5rem] font-extrabold text-white dark:text-gray-200 leading-[1.1] tracking-tight"
                      >
                        {word}{" "}
                      </span>
                    );
                  }
                  return (
                    <span
                      key={wi}
                      className="hero-text-outline text-[2.75rem] sm:text-6xl lg:text-[4.25rem] xl:text-[5rem] font-extrabold leading-[1.1] tracking-tight text-white dark:text-gray-200"
                    >
                      {word}{wi < arr.length - 1 ? " " : ""}
                    </span>
                  );
                })}
              </h1>

              {/* Accent line */}
              <div className="flex items-center gap-3 mb-6 animate-[heroFadeUp_0.75s_0.08s_ease-out_both]">
                <div className="h-0.75 w-12 rounded-full bg-linear-to-r from-emerald-400 to-teal-400" />
                <span className="text-white/30 dark:text-gray-400 text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Travel with Tripzo
                </span>
              </div>

              {/* Subtitle */}
              <p
                 key={`sub-${current}`}
                 className="text-base sm:text-lg text-white/50 dark:text-gray-400 max-w-md leading-relaxed mb-10 animate-[heroFadeUp_0.8s_0.15s_ease-out_both]"
              >
                {slides[current].subtitle}
              </p>

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-4 mb-10 animate-[heroFadeUp_0.8s_0.25s_ease-out_both]">
                <Link
                  to="/packages"
                  className="group relative bg-emerald-500 dark:bg-emerald-700 text-white dark:text-gray-200 pl-7 pr-5 py-3.5 rounded-full font-semibold text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(16,185,129,.3)] hover:-translate-y-0.5 active:scale-[.97]"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Explore Packages
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                       <HiArrowLongRight className="text-lg group-hover:translate-x-0.5 transition-transform text-white dark:text-gray-200" />
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                <Link
                  to="/destinations"
                  className="group flex items-center gap-2.5 text-white/80 dark:text-gray-200 px-6 py-3.5 rounded-full border border-white/10 dark:border-gray-700 bg-white/4 dark:bg-gray-800 backdrop-blur-xl hover:bg-white/8 dark:hover:bg-gray-900 hover:border-white/20 dark:hover:border-gray-500 transition-all duration-300 font-medium text-sm"
                >
                  <FaCompass className="text-emerald-400 text-xs group-hover:rotate-180 transition-transform duration-700" />
                    {/* Only one FaCompass needed, merge classes */}
                    Destinations
                  {/* Only one FaChevronRight needed, merge classes */}
                    <FaChevronRight className="text-[9px] text-white/40 dark:text-gray-400 group-hover:text-white/70 dark:group-hover:text-gray-200 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>

              {/* Search */}
              <form
                onSubmit={handleSearch}
                className="relative z-50 max-w-md animate-[heroFadeUp_0.8s_0.35s_ease-out_both]"
              >
                <div className="relative flex items-center bg-white/6 backdrop-blur-2xl border border-white/8 rounded-2xl pl-4 pr-1.5 py-1.5 hover:border-white/15 focus-within:border-emerald-500/30 transition-colors shadow-[0_4px_24px_rgba(0,0,0,.2)]">
                  <FaSearch className="text-white/30 mr-3 text-xs shrink-0" />
                    {/* Only one FaSearch needed, merge classes */}
                    <FaSearch className="text-white/30 dark:text-gray-400 mr-3 text-xs shrink-0" />
                  <input
                    type="text"
                    value={searchDest}
                    onChange={(e) => { setSearchDest(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search destinations, packages..."
                    className="flex-1 bg-transparent text-white dark:text-gray-200 placeholder-white/25 dark:placeholder-gray-400 focus:outline-none text-sm font-medium py-2"
                  />
                  <button
                    type="submit"
                    className="shrink-0 bg-emerald-500 dark:bg-emerald-700 hover:bg-emerald-400 dark:hover:bg-emerald-500 text-white dark:text-gray-200 rounded-xl font-semibold px-5 py-2.5 text-xs transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
                  >
                    Search
                  </button>
                  <SearchSuggestions
                    query={searchDest}
                    visible={showSuggestions}
                    onSelect={handleSuggestionSelect}
                    onClose={() => setShowSuggestions(false)}
                    variant="dark"
                  />
                </div>
              </form>
            </div>

            {/* ─── RIGHT COL — Stacked destination cards ─── */}
            <div className="hidden lg:block relative h-120 animate-[heroFadeUp_1s_0.2s_ease-out_both]">
              {/* Background card (next slide) */}
              <div className="absolute top-6 left-6 right-0 bottom-0 rounded-[28px] overflow-hidden border border-white/6 opacity-40 blur-[1px]">
                <img
                  src={slides[nextIndex].image}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gray-950/60" />
              </div>

              {/* Main card */}
              <div
                key={`card-${current}`}
                className="relative w-full h-full rounded-[28px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,.5)] border border-white/10 animate-[heroCardIn_0.7s_ease-out]"
              >
                <img
                  src={slides[current].image}
                  alt={slides[current].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/30 to-transparent" />

                {/* Card top badge */}
                <div className="absolute top-5 left-5 flex items-center gap-2">
                  <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {slides[current].tag}
                  </span>
                  <span className="bg-black/40 backdrop-blur-md text-white/80 text-[10px] font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <FaStar className="text-amber-400 text-[8px]" /> 4.9
                  </span>
                </div>

                {/* Play button overlay */}
                <button
                  onClick={() => goTo(nextIndex)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
                >
                  <FaPlay className="text-sm ml-0.5 group-hover:text-emerald-300 transition-colors" />
                </button>

                {/* Card bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-xl leading-snug mb-1">
                    {slides[current].title}
                  </h3>
                  <p className="text-white/45 text-sm flex items-center gap-1.5 mb-4">
                    <FaMapMarkerAlt className="text-emerald-400 text-[10px]" />
                    {slides[current].location}
                  </p>

                  {/* Mini image strip of other slides */}
                  <div className="flex items-center gap-2">
                    {slides.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`relative w-10 h-10 rounded-xl overflow-hidden transition-all duration-300 ${
                          i === current
                            ? "ring-2 ring-emerald-400 scale-110"
                            : "ring-1 ring-white/10 opacity-50 hover:opacity-80"
                        }`}
                      >
                        <img
                          src={s.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                    <span className="text-white/30 text-[10px] font-mono ml-2">
                      {String(current + 1).padStart(2, "0")}/
                      {String(slides.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ BOTTOM STATS BAR ══════ */}
      <div className="absolute bottom-0 right-0 z-20 w-auto max-w-max">
        <div className="bg-linear-to-t from-gray-950/90 to-transparent pt-16 pb-0 pr-4 sm:pr-6 lg:pr-20 xl:pr-24">
          <div className="bg-white/4 backdrop-blur-2xl border border-white/8 rounded-tl-2xl rounded-tr-2xl px-6 sm:px-8 py-4">
            <div className="flex items-center gap-6 sm:gap-8">
              {[
                {
                  icon: HiOutlineGlobeAlt,
                  value: stats.destinations || 0,
                  label: "Destinations",
                },
                {
                  icon: HiOutlineTicket,
                  value: stats.packages || 0,
                  label: "Packages",
                },
                {
                  icon: HiOutlineUserGroup,
                  value: stats.happyCustomers || 0,
                  label: "Travelers",
                },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <s.icon className="text-emerald-400 text-base" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-none tabular-nums">
                      {s.value.toLocaleString()}
                      <span className="text-emerald-400 text-xs">+</span>
                    </p>
                    <p className="text-white/35 text-[9px] uppercase tracking-widest font-semibold mt-0.5">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}

              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
