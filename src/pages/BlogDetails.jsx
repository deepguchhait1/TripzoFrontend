import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { getBlog } from "../services/api";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlog(id)
      .then((res) => setBlog(res.data))
      .catch(() => setBlog(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Blog not found</h2>
          <Link to="/" className="text-emerald-600 hover:underline">Back to Home</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 hover:underline mb-6">
          <FaArrowLeft /> Back to Home
        </Link>
        <div className="rounded-3xl shadow-lg overflow-hidden mb-8">
          <img src={blog.image} alt={blog.title} className="w-full h-80 object-cover" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{blog.title}</h1>
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-6">
          <FaCalendarAlt />
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="prose dark:prose-invert max-w-none text-justify" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    </section>
  );
};

export default BlogDetails;
