import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaArrowRight } from "react-icons/fa";
import { getBlogs } from "../../services/api";

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const showSkeleton = loading || blogPosts.length === 0;

  useEffect(() => {
    getBlogs({ limit: 3 })
      .then((res) => setBlogPosts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (showSkeleton) {
    return (
      <section className="py-24 bg-gray-50/60 dark:bg-gray-900/80 relative overflow-hidden transition-colors">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-50 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-40 translate-x-1/3 translate-y-1/3" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative animate-pulse">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div className="space-y-4 max-w-2xl w-full">
              <div className="h-7 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-12 w-2/3 rounded-2xl bg-gray-200 dark:bg-gray-700" />
              <div className="h-6 w-5/6 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div style={{ height: 480 }} className="rounded-3xl bg-gray-100 dark:bg-gray-800" />
            <div className="flex flex-col gap-6">
              {[0, 1].map((i) => (
                <div key={i} className="h-40 rounded-2xl bg-gray-100 dark:bg-gray-800" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const [featured, ...rest] = blogPosts;

  return (
    <section className="py-24 bg-gray-50/60 dark:bg-gray-900/80 relative overflow-hidden transition-colors">
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-50 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-40 translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Travel Blog
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Tips & <span className="text-emerald-600 dark:text-emerald-400">Stories</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-lg text-lg">
              Expert advice, destination guides, and inspiring stories from fellow travelers.
            </p>
          </div>
        </div>

        {/* Magazine layout: featured + side cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured post */}
          <article className="group relative rounded-3xl overflow-hidden" style={{ height: 480 }}>
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(3,7,18,0.9), rgba(3,7,18,0.3), transparent)" }} />
            <div className="absolute top-5 left-5">
              <span className="bg-emerald-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl">
                {featured.category}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <div className="flex items-center gap-4 text-white/60 text-sm mb-3">
                <span className="flex items-center gap-1.5">
                  <FaCalendarAlt className="text-xs" /> {new Date(featured.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaClock className="text-xs" /> {featured.readTime}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-snug group-hover:text-emerald-300 transition-colors">
                {featured.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-4">
                {featured.excerpt}
              </p>
              <Link
                to={`/blog/${featured._id}`}
                className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-sm hover:gap-3 transition-all"
              >
                Read Article <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </article>

          {/* Side cards */}
          <div className="flex flex-col gap-6">
            {(Array.isArray(rest) ? rest : []).map((post) => (
              <article
                key={post._id || post.id}
                className="group flex gap-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-xl hover:shadow-emerald-100/30 dark:hover:shadow-emerald-900/20 transition-all duration-500 overflow-hidden h-full"
              >
                <div className="relative w-44 shrink-0 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {post.category}
                  </span>
                </div>
                <div className="py-5 pr-5 flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500 text-xs mb-2">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-[10px]" /> {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock className="text-[10px]" /> {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                  <Link
                    to={`/blog/${post._id}`}
                    className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:gap-2.5 transition-all"
                  >
                    Read More <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
