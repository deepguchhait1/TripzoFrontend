import { useEffect, useState, useMemo } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaSearch,
  FaBlog,
  FaEye,
  FaClock,
  FaUser,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa";
import { getBlogsAdmin, createBlog, updateBlog, deleteBlog } from "../../services/api";
import toast from "react-hot-toast";

const emptyForm = {
  title: "", excerpt: "", content: "", image: "",
  author: "Tripzo Team", authorAvatar: "", authorBio: "",
  category: "", readTime: "5 min read", active: true,
};

const AdminBlogs = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchData = () => {
    setLoading(true);
    getBlogsAdmin()
      .then((res) => setItems(res.data))
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (item) => {
    setForm({ title: item.title, excerpt: item.excerpt, content: item.content || "", image: item.image, author: item.author, authorAvatar: item.authorAvatar || "", authorBio: item.authorBio || "", category: item.category, readTime: item.readTime, active: item.active });
    setEditId(item._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) { await updateBlog(editId, form); toast.success("Updated"); }
      else { await createBlog(form); toast.success("Created"); }
      setShowForm(false);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    try { await deleteBlog(id); toast.success("Deleted"); fetchData(); }
    catch { toast.error("Failed"); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // Get unique categories
  const allCategories = useMemo(() => [...new Set(items.map((b) => b.category).filter(Boolean))], [items]);
  const activeCount = useMemo(() => items.filter((b) => b.active).length, [items]);

  const filteredItems = useMemo(() => items
    .filter((b) => categoryFilter === "all" || b.category === categoryFilter)
    .filter((b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase())
    ), [items, categoryFilter, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 p-2.5 rounded-xl"><FaBlog className="text-orange-600" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{items.length}</div>
              <div className="text-xs text-gray-500">Total Posts</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 p-2.5 rounded-xl"><FaEye className="text-emerald-600" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{activeCount}</div>
              <div className="text-xs text-gray-500">Published</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-2.5 rounded-xl"><FaEye className="text-red-600" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{items.length - activeCount}</div>
              <div className="text-xs text-gray-500">Drafts</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-2.5 rounded-xl"><FaTag className="text-purple-600" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{allCategories.length}</div>
              <div className="text-xs text-gray-500">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search, Filter & Add */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-gray-600 w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${categoryFilter === "all" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              All ({items.length})
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap capitalize transition ${categoryFilter === cat ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {cat} ({items.filter((b) => b.category === cat).length})
              </button>
            ))}
          </div>
          <button
            onClick={openCreate}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition flex items-center justify-center gap-2 shrink-0"
          >
            <FaPlus className="text-sm" /> New Post
          </button>
        </div>
      </div>

      {/* Blog Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <FaBlog className="text-4xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No blog posts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col">
              <div className="relative">
                <img src={item.image} alt={item.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {item.category && (
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/90 text-gray-700 backdrop-blur-sm">
                      {item.category}
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${item.active ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
                    {item.active ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-gray-800 mb-1.5 line-clamp-2 leading-tight">{item.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{item.excerpt}</p>
                {/* Author Profile */}
                <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-gray-100">
                  {item.authorAvatar ? (
                    <img src={item.authorAvatar} alt={item.author} className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100" />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ring-gray-100">
                      {item.author?.charAt(0)?.toUpperCase() || "T"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-700 truncate">{item.author}</div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      <span className="flex items-center gap-0.5">
                        <FaClock className="text-[9px]" /> {item.readTime}
                      </span>
                      {item.createdAt && (
                        <span className="flex items-center gap-0.5">
                          <FaCalendarAlt className="text-[9px]" />
                          {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100">
                  <button onClick={() => openEdit(item)} className="flex-1 bg-blue-50 text-blue-600 text-xs font-medium py-2 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-1">
                    <FaEdit className="text-[10px]" /> Edit
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="flex-1 bg-red-50 text-red-600 text-xs font-medium py-2 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-1">
                    <FaTrash className="text-[10px]" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{editId ? "Edit" : "New"} Blog Post</h3>
                <p className="text-xs text-gray-400 mt-0.5">{editId ? "Update your blog post" : "Write a new blog post"}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition">
                <FaTimes className="text-lg" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="text-gray-700 p-6 space-y-5">
              {form.image && (
                <div className="rounded-xl overflow-hidden h-32">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Title *</label>
               <input name="title" value={form.title} onChange={handleChange} required className="text-gray-600 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Cover Image URL *</label>
                <input name="image" value={form.image} onChange={handleChange} required className="text-gray-600 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Excerpt *</label>
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} required rows={2} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none transition text-sm" placeholder="A brief summary of the post..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Content</label>
                <textarea name="content" value={form.content} onChange={handleChange} rows={6} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none transition text-sm" placeholder="Write your blog content..." />
              </div>
              {/* Author Profile Section */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FaUser className="text-gray-400" /> Author Profile
                </h4>
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    {form.authorAvatar ? (
                      <img src={form.authorAvatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-sm" />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xl ring-2 ring-white shadow-sm">
                        {form.author?.charAt(0)?.toUpperCase() || "T"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Author Name</label>
                       <input name="author" value={form.author} onChange={handleChange} className="text-gray-600 w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm bg-white" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Avatar URL</label>
                       <input name="authorAvatar" value={form.authorAvatar} onChange={handleChange} placeholder="https://..." className="text-gray-600 w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm bg-white" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Author Bio</label>
                      <input name="authorBio" value={form.authorBio} onChange={handleChange} placeholder="Travel enthusiast & writer..." className="text-gray-600 w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm bg-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Category *</label>
                 <input name="category" value={form.category} onChange={handleChange} required placeholder="Travel Tips" className="text-gray-600 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Read Time</label>
                  <input name="readTime" value={form.readTime} onChange={handleChange} className="text-gray-600 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="w-4 h-4 accent-emerald-600 rounded" />
                <span className="text-sm text-gray-700">Publish immediately</span>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition flex items-center gap-2 disabled:opacity-60 text-sm">
                  {saving ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <FaCheck className="text-xs" />}
                  {editId ? "Update Post" : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
