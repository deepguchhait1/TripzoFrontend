import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaUsers,
  FaGlobeAsia,
  FaAward,
  FaHandshake,
  FaHeart,
  FaShieldAlt,
  FaPlane,
} from "react-icons/fa";

const team = [
  {
    name: "Arjun Mehta",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
  },
  {
    name: "Sneha Kapoor",
    role: "Head of Operations",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
  },
  {
    name: "Rohan Gupta",
    role: "Senior Tour Planner",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
  },
  {
    name: "Priya Singh",
    role: "Customer Experience",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
  },
];

const values = [
  {
    icon: FaHeart,
    title: "Passion for Travel",
    description: "We live and breathe travel. Every trip we plan comes from a place of genuine love for exploration.",
  },
  {
    icon: FaShieldAlt,
    title: "Trust & Safety",
    description: "Your safety is our priority. We ensure every aspect of your journey is secure and reliable.",
  },
  {
    icon: FaHandshake,
    title: "Customer First",
    description: "We go above and beyond to ensure every traveler has an exceptional experience.",
  },
  {
    icon: FaGlobeAsia,
    title: "Sustainable Tourism",
    description: "We're committed to responsible travel that respects local cultures and environments.",
  },
];

const About = () => {
  const yearsExperience = new Date().getFullYear() - 2018;

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-72 md:h-80 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600"
          alt="About Us"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              About Tripzo
            </h1>
            <p className="text-gray-200 text-lg max-w-xl mx-auto">
              Your trusted partner for exploring the beauty of incredible India
            </p>
            <div className="flex items-center gap-2 text-gray-300 text-sm justify-center mt-4">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-emerald-400">About Us</span>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-wider">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mt-2 mb-6">
                Making Travel Dreams Come True Since 2018
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Tripzo was born from a simple idea - that every person deserves to experience the
                incredible diversity and beauty that India has to offer. Founded in 2018, we started
                as a small team of passionate travelers who wanted to share our love for India's
                hidden gems with the world.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Today, we've grown into one of India's most trusted travel companies, having
                helped over 10,000 travelers create unforgettable memories. From the snowy peaks
                of the Himalayas to the tropical beaches of Goa, from the royal palaces of
                Rajasthan to the serene backwaters of Kerala, we curate experiences that go
                beyond ordinary tourism.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: FaPlane, value: "500+", label: "Destinations" },
                  { icon: FaUsers, value: "10,000+", label: "Happy Travelers" },
                  { icon: FaAward, value: "15+", label: "Awards Won" },
                  { icon: FaGlobeAsia, value: `${yearsExperience}+`, label: "Years Experience" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 dark:bg-gray-800 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                      <stat.icon className="text-emerald-600 text-xl" />
                    </div>
                    <div>
                      <div className="font-bold dark:text-gray-400 text-gray-800 text-xl">{stat.value}</div>
                      <div className="text-gray-500 text-sm">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://s7ap1.scene7.com/is/image/incredibleindia/manikarnika-ghat-city-hero?qlt=82&ts=1727959374496"
                alt="About Tripzo"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-emerald-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-4xl font-bold">{yearsExperience}+</div>
                <div className="text-emerald-100 text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-100/30 dark:bg-gray-700/30 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-emerald-100 dark:border-gray-700 mb-4">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Our Values
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mt-3">
              What Drives Us
            </h2>
            <p className="text-gray-500 dark:text-gray-300 mt-4 max-w-xl mx-auto">
              The principles that guide every journey we craft and every experience we deliver
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <div
                key={i}
                className="group relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-gray-800 rounded-bl-[4rem] rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 dark:bg-gradient-to-br dark:from-emerald-700 dark:to-teal-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-200/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <val.icon className="text-white text-xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{val.title}</h3>
                  <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed">{val.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 group-hover:border-emerald-100 dark:group-hover:border-emerald-700 transition-colors">
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
            <div>
             
              <span className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-emerald-100 dark:border-gray-700 mb-4">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Our Team
            </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3">
                Meet the Experts
              </h2>
              <p className="text-gray-500 mt-4 max-w-lg">
                Our passionate team of travel experts is dedicated to crafting the
                perfect journey for you.
              </p>
            </div>
            <Link
              to="/contact"
              className="self-start lg:self-auto inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-emerald-600 transition-colors duration-300 shrink-0"
            >
              Join Our Team
              <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px]">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div
                key={i}
                className="group"
              >
                <div className="relative overflow-hidden rounded-3xl mb-5 aspect-[3/4]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Hover overlay info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex gap-3">
                      {["#", "#", "#"].map((_, si) => (
                        <div key={si} className="w-9 h-9 dark:bg-gray-900 dark:border-[#00BC7D] bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-xs hover:bg-emerald-500 transition-colors cursor-pointer border border-white/10">
                          {["in", "tw", "ig"][si]}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Number badge */}
                  <div className="absolute top-4 left-4 w-8 h-8 dark:border-[#00BC7D] dark:border dark:bg-gray-900 dark:text-gray-400 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-xs font-bold text-gray-900 shadow-sm">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300 dark:text-[#00BC7D]">{member.name}</h3>
                <p className="text-gray-500 text-sm font-medium mt-0.5 dark:text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Our Mission
          </h2>
          <p className="text-emerald-100 text-lg leading-relaxed mb-8">
            To make travel accessible, enjoyable, and meaningful for every Indian.
            We believe that travel has the power to transform perspectives, create
            lasting memories, and bring people closer to the incredible diversity
            of our nation. Every journey we plan is a step towards making that
            vision a reality.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            {[
              "Personalized Itineraries",
              "Local Experiences",
              "Sustainable Tourism",
              "Affordable Pricing",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white">
                <FaCheckCircle className="text-emerald-300" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
