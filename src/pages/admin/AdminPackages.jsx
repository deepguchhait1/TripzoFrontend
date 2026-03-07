import { useEffect, useState, useMemo } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaSearch,
  FaSuitcase,
  FaStar,
  FaEye,
  FaFilter,
  FaClock,
  FaTag,
  FaPercent,
  FaImages,
  FaTags,
} from "react-icons/fa";
import {
  getPackagesAdmin,
  createPackage,
  updatePackage,
  deletePackage,
} from "../../services/api";
import toast from "react-hot-toast";
import ImageUploader from "../../components/ImageUploader";

const emptyForm = {
  title: "", destinations: "", image: "", images: [], duration: "",
  price: 0, originalPrice: 0, rating: 0, reviews: 0,
  highlights: "", included: "", tags: [], category: "popular",
  featured: false, active: true,
};

const categories = ["popular", "adventure", "luxury", "honeymoon", "budget", "family"];

const categoryColors = {
  popular: "bg-blue-50 text-blue-700",
  adventure: "bg-orange-50 text-orange-700",
  luxury: "bg-purple-50 text-purple-700",
  honeymoon: "bg-pink-50 text-pink-700",
  budget: "bg-emerald-50 text-emerald-700",
  family: "bg-cyan-50 text-cyan-700",
};

const AdminPackages = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newTag, setNewTag] = useState("");

  const fetchData = () => {
    setLoading(true);
    getPackagesAdmin()
      .then((res) => setItems(res.data))
      .catch(() => toast.error("Failed to load packages"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setNewImageUrl(""); setNewTag(""); setShowForm(true); };

  const openEdit = (item) => {
    setForm({
      title: item.title, destinations: item.destinations.join(", "),
      image: item.image, images: item.images || [], duration: item.duration,
      price: item.price, originalPrice: item.originalPrice,
      rating: item.rating, reviews: item.reviews,
      highlights: item.highlights.join(", "), included: item.included.join(", "),
      tags: item.tags || [],
      category: item.category, featured: item.featured, active: item.active,
    });
    setEditId(item._id);
    setNewImageUrl("");
    setNewTag("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      destinations: form.destinations.split(",").map((s) => s.trim()).filter(Boolean),
      highlights: form.highlights.split(",").map((s) => s.trim()).filter(Boolean),
      included: form.included.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editId) { await updatePackage(editId, payload); toast.success("Package updated"); }
      else { await createPackage(payload); toast.success("Package created"); }
      setShowForm(false);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Error saving"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this package?")) return;
    try { await deletePackage(id); toast.success("Deleted"); fetchData(); }
    catch { toast.error("Delete failed"); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value }));
  };

  const filteredItems = useMemo(() => items
    .filter((p) => categoryFilter === "all" || p.category === categoryFilter)
    .filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.destinations?.some((d) => d.toLowerCase().includes(search.toLowerCase()))
    ), [items, categoryFilter, search]);

  const activeCount = useMemo(() => items.filter((p) => p.active).length, [items]);
  const featuredCount = useMemo(() => items.filter((p) => p.featured).length, [items]);
  const avgPrice = useMemo(() => items.length > 0 ? Math.round(items.reduce((s, p) => s + p.price, 0) / items.length) : 0, [items]);

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
            <div className="bg-emerald-50 p-2.5 rounded-xl"><FaSuitcase className="text-emerald-600" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{items.length}</div>
              <div className="text-xs text-gray-500">Total Packages</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-xl"><FaEye className="text-blue-600" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{activeCount}</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 p-2.5 rounded-xl"><FaStar className="text-amber-600" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{featuredCount}</div>
              <div className="text-xs text-gray-500">Featured</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-2.5 rounded-xl"><FaTag className="text-purple-600" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-800">&#8377;{avgPrice.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Avg. Price</div>
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
              placeholder="Search packages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${categoryFilter === "all" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              All ({items.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap capitalize transition ${categoryFilter === cat ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {cat} ({items.filter((p) => p.category === cat).length})
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

      {/* Packages Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <FaSuitcase className="text-4xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No packages found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const discount = item.originalPrice > item.price
              ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
              : 0;
            return (
              <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                <div className="relative">
                  <img src={item.image} alt={item.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full capitalize ${categoryColors[item.category] || "bg-gray-50 text-gray-700"}`}>
                      {item.category}
                    </span>
                    {discount > 0 && (
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-red-500 text-white flex items-center gap-0.5">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${item.active ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {item.featured && (
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-400 text-amber-900 flex items-center gap-1">
                        <FaStar className="text-[9px]" /> Featured
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{item.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <FaClock className="text-[10px]" /> {item.duration}
                    </span>
                    <span className="text-gray-200">|</span>
                    <span className="text-xs text-gray-400">{item.destinations?.length || 0} destinations</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-emerald-600">&#8377;{item.price.toLocaleString()}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-xs text-gray-400 line-through">&#8377;{item.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaStar className="text-amber-400 text-xs" />
                      <span className="text-xs font-semibold text-gray-700">{item.rating}</span>
                      <span className="text-xs text-gray-400">({item.reviews})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={() => openEdit(item)} className="flex-1 bg-blue-50 text-blue-600 text-xs font-medium py-2 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-1">
                      <FaEdit className="text-[10px]" /> Edit
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="flex-1 bg-red-50 text-red-600 text-xs font-medium py-2 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-1">
                      <FaTrash className="text-[10px]" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{editId ? "Edit Package" : "Add New Package"}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{editId ? "Update package details" : "Create a new tour package"}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition">
                <FaTimes className="text-lg" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Main image */}
              <ImageUploader
                value={form.image}
                onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
                folder="tripzo/packages"
                label="Main Image"
                required
              />
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
              </div>

              {/* Multiple Images */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FaImages className="text-emerald-500" /> Additional Images
                </label>
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.images.map((url, idx) => (
                      <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                        <img src={url} alt={`img-${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL and click Add"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newImageUrl.trim()) {
                        setForm((prev) => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
                        setNewImageUrl("");
                      }
                    }}
                    className="bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-200 transition shrink-0"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Destinations (comma-separated) *</label>
                <input name="destinations" value={form.destinations} onChange={handleChange} required placeholder="Delhi, Agra, Jaipur" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Price *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Original Price</label>
                  <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Rating</label>
                  <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Duration *</label>
                  <input name="duration" value={form.duration} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Highlights (comma-separated)</label>
                <input name="highlights" value={form.highlights} onChange={handleChange} placeholder="Taj Mahal, Amber Fort" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Included (comma-separated)</label>
                <input name="included" value={form.included} onChange={handleChange} placeholder="Hotels, Meals, Transport" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FaTags className="text-emerald-500" /> Tags
                </label>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {form.tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full">
                        {tag}
                        <button type="button" onClick={() => setForm((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => i !== idx) }))} className="text-emerald-400 hover:text-red-500 transition">
                          <FaTimes className="text-[9px]" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newTag.trim() && !form.tags.includes(newTag.trim())) {
                          setForm((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
                          setNewTag("");
                        }
                      }
                    }}
                    placeholder="Type tag and press Enter or click Add"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newTag.trim() && !form.tags.includes(newTag.trim())) {
                        setForm((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
                        setNewTag("");
                      }
                    }}
                    className="bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-200 transition shrink-0"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none capitalize transition text-sm">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-emerald-600 rounded" />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="w-4 h-4 accent-emerald-600 rounded" />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition flex items-center gap-2 disabled:opacity-60 text-sm">
                  {saving ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <FaCheck className="text-xs" />}
                  {editId ? "Update Package" : "Create Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPackages;
