import { useEffect, useState, useMemo } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaStar,
  FaSearch,
  FaComments,
  FaEye,
  FaQuoteLeft,
  FaUser,
} from "react-icons/fa";
import {
  getTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../../services/api";
import toast from "react-hot-toast";

const emptyForm = {
  name: "", location: "", avatar: "", rating: 5,
  text: "", tour: "", active: true,
};

const AdminTestimonials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const fetchData = () => {
    setLoading(true);
    getTestimonialsAdmin()
      .then((res) => setItems(res.data))
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (item) => {
    setForm({ name: item.name, location: item.location, avatar: item.avatar, rating: item.rating, text: item.text, tour: item.tour, active: item.active });
    setEditId(item._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) { await updateTestimonial(editId, form); toast.success("Updated"); }
      else { await createTestimonial(form); toast.success("Created"); }
      setShowForm(false);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try { await deleteTestimonial(id); toast.success("Deleted"); fetchData(); }
    catch { toast.error("Failed"); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value }));
  };

  const avgRating = useMemo(() => items.length > 0 ? (items.reduce((s, t) => s + t.rating, 0) / items.length).toFixed(1) : 0, [items]);
  const activeCount = useMemo(() => items.filter((t) => t.active).length, [items]);
  const fiveStarCount = useMemo(() => items.filter((t) => t.rating === 5).length, [items]);

  const filteredItems = useMemo(() => items
    .filter((t) => ratingFilter === "all" || t.rating === Number(ratingFilter))
    .filter((t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.tour?.toLowerCase().includes(search.toLowerCase()) ||
      t.text?.toLowerCase().includes(search.toLowerCase())
    ), [items, ratingFilter, search]);

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
            <div className="bg-purple-50 p-2.5 rounded-xl"><FaComments className="text-purple-600" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{items.length}</div>
              <div className="text-xs text-gray-500">Total Reviews</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 p-2.5 rounded-xl"><FaStar className="text-amber-600" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{avgRating}</div>
              <div className="text-xs text-gray-500">Avg. Rating</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 p-2.5 rounded-xl"><FaEye className="text-emerald-600" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{activeCount}</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-50 p-2.5 rounded-xl"><FaStar className="text-yellow-500" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{fiveStarCount}</div>
              <div className="text-xs text-gray-500">5-Star Reviews</div>
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
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
            />
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setRatingFilter("all")}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${ratingFilter === "all" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((r) => (
              <button
                key={r}
                onClick={() => setRatingFilter(String(r))}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1 ${ratingFilter === String(r) ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {r} <FaStar className="text-[10px]" />
              </button>
            ))}
          </div>
          <button
            onClick={openCreate}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition flex items-center justify-center gap-2 shrink-0"
          >
            <FaPlus className="text-sm" /> Add New
          </button>
        </div>
      </div>

      {/* Testimonials Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <FaComments className="text-4xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No reviews found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button onClick={() => openEdit(item)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                  <FaEdit className="text-xs" />
                </button>
                <button onClick={() => handleDelete(item._id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                  <FaTrash className="text-xs" />
                </button>
              </div>
              <FaQuoteLeft className="text-emerald-100 text-2xl mb-3" />
              <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-4">
                {item.text}
              </p>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={`text-sm ${i < item.rating ? "text-amber-400" : "text-gray-200"}`} />
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2.5">
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {item.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-[11px] text-gray-400">{item.location} {item.tour && `| ${item.tour}`}</p>
                  </div>
                </div>
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${item.active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {item.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{editId ? "Edit" : "Add"} Testimonial</h3>
                <p className="text-xs text-gray-400 mt-0.5">{editId ? "Update review details" : "Add a new customer review"}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition">
                <FaTimes className="text-lg" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Location *</label>
                  <input name="location" value={form.location} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Avatar URL</label>
                <input name="avatar" value={form.avatar} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Tour Name *</label>
                  <input name="tour" value={form.tour} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Rating *</label>
                  <div className="flex items-center gap-1 pt-1">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, rating: r }))}
                        className="p-1"
                      >
                        <FaStar className={`text-xl ${r <= form.rating ? "text-amber-400" : "text-gray-200"} hover:text-amber-300 transition`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Review Text *</label>
                <textarea name="text" value={form.text} onChange={handleChange} required rows={4} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none transition text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="w-4 h-4 accent-emerald-600 rounded" />
                <span className="text-sm text-gray-700">Active (visible on website)</span>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition flex items-center gap-2 disabled:opacity-60 text-sm">
                  {saving ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <FaCheck className="text-xs" />}
                  {editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
