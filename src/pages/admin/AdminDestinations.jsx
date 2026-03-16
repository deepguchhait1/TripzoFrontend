import { useEffect, useState, useMemo } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaEye,
  FaEyeSlash,
  FaFilter,
  FaImages,
  FaTags,
} from "react-icons/fa";
import {
  getDestinationsAdmin,
  createDestination,
  updateDestination,
  deleteDestination,
} from "../../services/api";
import toast from "react-hot-toast";
import ImageUploader from "../../components/ImageUploader";

const emptyForm = {
  name: "", state: "", image: "", images: [], description: "",
  rating: 0, reviews: 0, price: 0, duration: "",
  tags: [], category: "heritage", featured: false, active: true,
};

const categories = ["heritage", "beach", "mountain", "nature", "spiritual", "adventure"];

const categoryColors = {
  heritage: "bg-amber-50 text-amber-700",
  beach: "bg-cyan-50 text-cyan-700",
  mountain: "bg-emerald-50 text-emerald-700",
  nature: "bg-green-50 text-green-700",
  spiritual: "bg-purple-50 text-purple-700",
  adventure: "bg-orange-50 text-orange-700",
};

const AdminDestinations = () => {
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
    getDestinationsAdmin()
      .then((res) => setItems(res.data))
      .catch(() => toast.error("Failed to load destinations"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setNewImageUrl(""); setNewTag(""); setShowForm(true); };

  const openEdit = (item) => {
    setForm({
      name: item.name, state: item.state, image: item.image,
      images: item.images || [],
      description: item.description, rating: item.rating, reviews: item.reviews,
      price: item.price, duration: item.duration, category: item.category,
      tags: item.tags || [],
      featured: item.featured, active: item.active,
    });
    setEditId(item._id);
    setNewImageUrl("");
    setNewTag("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) { await updateDestination(editId, form); toast.success("Destination updated"); }
      else { await createDestination(form); toast.success("Destination created"); }
      setShowForm(false);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Error saving"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this destination?")) return;
    try { await deleteDestination(id); toast.success("Deleted"); fetchData(); }
    catch { toast.error("Delete failed"); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value }));
  };

  const filteredItems = useMemo(() => items
    .filter((d) => categoryFilter === "all" || d.category === categoryFilter)
    .filter((d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.state?.toLowerCase().includes(search.toLowerCase())
    ), [items, categoryFilter, search]);

  const activeCount = useMemo(() => items.filter((d) => d.active).length, [items]);
  const featuredCount = useMemo(() => items.filter((d) => d.featured).length, [items]);

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
            <div className="bg-blue-50 p-2.5 rounded-xl"><FaMapMarkerAlt className="text-blue-600" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{items.length}</div>
              <div className="text-xs text-gray-500">Total Destinations</div>
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
            <div className="bg-amber-50 p-2.5 rounded-xl"><FaStar className="text-amber-600" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{featuredCount}</div>
              <div className="text-xs text-gray-500">Featured</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-2.5 rounded-xl"><FaFilter className="text-purple-600" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{categories.length}</div>
              <div className="text-xs text-gray-500">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search, Filter & Add */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 text-gray-600">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search destinations..."
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
                {cat} ({items.filter((d) => d.category === cat).length})
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

      {/* Destinations Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <FaMapMarkerAlt className="text-4xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No destinations found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="relative">
                <img src={item.image} alt={item.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full capitalize ${categoryColors[item.category] || "bg-gray-50 text-gray-700"}`}>
                    {item.category}
                  </span>
                  {item.featured && (
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 flex items-center gap-1">
                      <FaStar className="text-[9px]" /> Featured
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${item.active ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
                    {item.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-0.5">{item.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <FaMapMarkerAlt className="text-gray-400 text-[10px]" />
                      {item.state}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-600">&#8377;{item.price.toLocaleString()}</div>
                    <div className="text-[11px] text-gray-400">{item.duration}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      <FaStar className="text-amber-400 text-xs" />
                      <span className="text-xs font-semibold text-gray-700">{item.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">({item.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <FaEdit className="text-sm" />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
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
                <h3 className="text-lg font-bold text-gray-800">
                  {editId ? "Edit Destination" : "Add New Destination"}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editId ? "Update destination details" : "Fill in the details to create a new destination"}
                </p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition">
                <FaTimes className="text-lg" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-gray-600">
              {/* Main Image */}
              <ImageUploader
                value={form.image}
                onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
                folder="tripzo/destinations"
                label="Main Image"
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="text-gray-600 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">State *</label>
                  <input name="state" value={form.state} onChange={handleChange} required className="text-gray-600 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
                </div>
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
                <div className="flex gap-2 text-gray-600">
                  <input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL and click Add"
                    className="text-gray-600 flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm"
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
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="text-gray-600 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none transition text-sm" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Price *</label>
                 <input name="price" type="number" value={form.price} onChange={handleChange} required className="text-gray-600 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Rating</label>
                  <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} className="text-gray-600 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Reviews</label>
                 <input name="reviews" type="number" value={form.reviews} onChange={handleChange} className="text-gray-600 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Duration *</label>
                 <input name="duration" value={form.duration} onChange={handleChange} required placeholder="3D / 2N" className="text-gray-600 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
                </div>
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
                    className="text-gray-600 flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm"
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
                  <select name="category" value={form.category} onChange={handleChange} className="text-gray-600 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none capitalize transition text-sm">
                    {categories.map((c) => <option key={c} className="text-gray-600" value={c}>{c}</option>)}
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
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition flex items-center gap-2 disabled:opacity-60 text-sm">
                  {saving ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <FaCheck className="text-xs" />}
                  {editId ? "Update Destination" : "Create Destination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDestinations;
