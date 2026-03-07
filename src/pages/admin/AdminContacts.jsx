import { useEffect, useState, useMemo } from "react";
import {
  FaEnvelope,
  FaUser,
  FaPhone,
  FaTrash,
  FaReply,
  FaEye,
  FaTimes,
  FaSearch,
  FaClock,
  FaCheckCircle,
  FaInbox,
  FaPaperPlane,
  FaExclamationCircle,
} from "react-icons/fa";
import { getContacts, updateContact, deleteContact, replyContact } from "../../services/api";
import toast from "react-hot-toast";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [replyModal, setReplyModal] = useState(false);
  const [replyForm, setReplyForm] = useState({ subject: "", body: "" });
  const [replySending, setReplySending] = useState(false);
  const [activePreset, setActivePreset] = useState(null);

  const getPresetTemplates = (name) => [
    {
      id: "thank_you",
      label: "Thank You",
      icon: "🙏",
      subject: `Thank You for Contacting Tripzo`,
      body: `Hi ${name},\n\nThank you so much for reaching out to us! We truly appreciate your interest in Tripzo.\n\nOur team has reviewed your message and we're happy to assist you. If you have any further questions, please don't hesitate to reach out.\n\nWe look forward to helping you plan your perfect trip!\n\nWarm regards,\nTeam Tripzo`,
    },
    {
      id: "booking_info",
      label: "Booking Info",
      icon: "📋",
      subject: `Booking Information — Tripzo`,
      body: `Hi ${name},\n\nThank you for your interest in booking with Tripzo!\n\nTo proceed with your booking, here are the next steps:\n\n1. Browse our packages at our website\n2. Select your preferred travel dates and destination\n3. Fill in the booking form with your details\n4. Our travel expert will contact you within 24 hours with a customized itinerary and pricing\n\nIf you need any help choosing the right package, feel free to call us at +91 123 456 7890.\n\nBest regards,\nTeam Tripzo`,
    },
    {
      id: "custom_package",
      label: "Custom Package",
      icon: "✨",
      subject: `Your Custom Package Request — Tripzo`,
      body: `Hi ${name},\n\nThank you for your interest in a custom travel package!\n\nWe'd love to create a personalized itinerary just for you. To get started, could you please share:\n\n• Your preferred destinations\n• Travel dates (or flexible range)\n• Number of travelers\n• Budget range\n• Any special requirements or preferences\n\nOnce we have these details, our travel experts will craft a tailor-made package for you within 48 hours.\n\nLooking forward to hearing from you!\n\nBest regards,\nTeam Tripzo`,
    },
    {
      id: "followup",
      label: "Follow Up",
      icon: "🔔",
      subject: `Following Up on Your Inquiry — Tripzo`,
      body: `Hi ${name},\n\nWe hope this message finds you well! We're following up on your recent inquiry to Tripzo.\n\nWe wanted to make sure all your questions have been answered. If there's anything else we can help you with, or if you're ready to proceed with booking, please let us know.\n\nOur team is here to make your travel experience seamless and memorable.\n\nWarm regards,\nTeam Tripzo`,
    },
    {
      id: "support",
      label: "Support",
      icon: "🛠️",
      subject: `Support Response — Tripzo`,
      body: `Hi ${name},\n\nThank you for bringing this to our attention. We take all feedback and concerns seriously.\n\nWe've looked into the matter you raised and here's what we can share:\n\n[Please add your response here]\n\nIf you need any further assistance, please don't hesitate to reach out. You can also call our support line at +91 123 456 7890 for immediate help.\n\nBest regards,\nTeam Tripzo`,
    },
    {
      id: "partnership",
      label: "Partnership",
      icon: "🤝",
      subject: `Partnership Inquiry Response — Tripzo`,
      body: `Hi ${name},\n\nThank you for your interest in partnering with Tripzo! We're always excited to explore collaboration opportunities.\n\nWe'd love to learn more about your proposal. Could we schedule a call to discuss this further? Please share your availability and we'll set something up.\n\nLooking forward to a great partnership!\n\nBest regards,\nTeam Tripzo`,
    },
  ];

  const fetchContacts = () => {
    setLoading(true);
    getContacts()
      .then((res) => setContacts(res.data))
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleMarkReplied = async (id) => {
    try {
      await updateContact(id, { status: "replied" });
      toast.success("Marked as replied");
      fetchContacts();
      if (selected?._id === id) setSelected({ ...selected, status: "replied" });
    } catch {
      toast.error("Update failed");
    }
  };

  const openReplyModal = (contact) => {
    setReplyForm({
      subject: `Re: ${contact.subject || "Your Inquiry"} | Tripzo`,
      body: `Hi ${contact.name},\n\nThank you for reaching out to Tripzo!\n\n\n\nBest regards,\nTeam Tripzo`,
    });
    setActivePreset(null);
    setReplyModal(true);
  };

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setReplyForm({ subject: preset.subject, body: preset.body });
  };

  const handleSendReply = async () => {
    if (!replyForm.subject.trim() || !replyForm.body.trim()) {
      toast.error("Subject and message body are required");
      return;
    }
    setReplySending(true);
    try {
      await replyContact(selected._id, replyForm);
      toast.success("Reply sent successfully!");
      setReplyModal(false);
      setSelected({ ...selected, status: "replied" });
      fetchContacts();
    } catch {
      toast.error("Failed to send reply. Please try again.");
    } finally {
      setReplySending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      await deleteContact(id);
      toast.success("Message deleted");
      if (selected?._id === id) setSelected(null);
      fetchContacts();
    } catch {
      toast.error("Delete failed");
    }
  };

  const statusColors = {
    new: "bg-blue-100 text-blue-700",
    replied: "bg-emerald-100 text-emerald-700",
  };

  const statusTabs = [
    { key: "all", label: "All Messages" },
    { key: "new", label: "New" },
    { key: "replied", label: "Replied" },
  ];

  const filteredContacts = useMemo(() => contacts
    .filter((c) => statusFilter === "all" || c.status === statusFilter)
    .filter(
      (c) =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.subject?.toLowerCase().includes(search.toLowerCase()) ||
        c.message?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [contacts, statusFilter, search]);

  const getStatusCount = (status) =>
    status === "all" ? contacts.length : contacts.filter((c) => c.status === status).length;

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

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
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-xl">
              <FaInbox className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{contacts.length}</div>
              <div className="text-xs text-gray-500">Total Messages</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 p-2.5 rounded-xl">
              <FaExclamationCircle className="text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {contacts.filter((c) => c.status === "new").length}
              </div>
              <div className="text-xs text-gray-500">Unread</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 p-2.5 rounded-xl">
              <FaCheckCircle className="text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {contacts.filter((c) => c.status === "replied").length}
              </div>
              <div className="text-xs text-gray-500">Replied</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
            />
          </div>
          <div className="flex gap-1.5">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  statusFilter === tab.key
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label} ({getStatusCount(tab.key)})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 space-y-2">
          {filteredContacts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <FaInbox className="text-4xl text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No messages found</p>
            </div>
          ) : (
            filteredContacts.map((c) => (
              <div
                key={c._id}
                onClick={() => setSelected(c)}
                className={`bg-white rounded-xl p-4 shadow-sm border transition-all cursor-pointer hover:shadow-md ${
                  selected?._id === c._id
                    ? "border-emerald-300 ring-2 ring-emerald-100"
                    : "border-gray-100 hover:border-gray-200"
                } ${c.status === "new" ? "border-l-4 border-l-blue-500" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                    c.status === "new"
                      ? "bg-gradient-to-br from-blue-400 to-blue-600"
                      : "bg-gradient-to-br from-gray-300 to-gray-400"
                  }`}>
                    {c.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm truncate ${c.status === "new" ? "font-bold text-gray-800" : "font-medium text-gray-600"}`}>
                        {c.name}
                      </span>
                      <span className="text-[11px] text-gray-400 shrink-0">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${c.status === "new" ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                      {c.subject || "No subject"}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{c.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-20">
              {/* Detail Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusColors[selected.status] || "bg-gray-100 text-gray-600"}`}>
                    {selected.status === "new" ? "Unread" : "Replied"}
                  </span>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {selected.subject || "No Subject"}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {selected.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{selected.name}</div>
                    <div className="text-xs text-gray-500">{selected.email}</div>
                  </div>
                  <div className="ml-auto text-xs text-gray-400">
                    {new Date(selected.createdAt).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-5">
                <div className="bg-gray-50 rounded-xl p-5 mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <div className="text-xs text-blue-600 mb-0.5">Email</div>
                    <div className="text-sm font-medium text-blue-800 truncate">{selected.email}</div>
                  </div>
                  {selected.phone && (
                    <div className="bg-emerald-50 rounded-xl p-3">
                      <div className="text-xs text-emerald-600 mb-0.5">Phone</div>
                      <div className="text-sm font-medium text-emerald-800">{selected.phone}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-100 flex items-center gap-2">
                {selected.status === "new" && (
                  <button
                    onClick={() => handleMarkReplied(selected._id)}
                    className="flex-1 bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle className="text-xs" /> Mark as Replied
                  </button>
                )}
                <button
                  onClick={() => openReplyModal(selected)}
                  className="flex-1 bg-blue-50 text-blue-600 text-sm font-medium py-2.5 rounded-xl hover:bg-blue-100 transition flex items-center justify-center gap-2"
                >
                  <FaReply className="text-xs" /> Reply via Email
                </button>
                <button
                  onClick={() => handleDelete(selected._id)}
                  className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center sticky top-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-2xl text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium mb-1">No Message Selected</p>
              <p className="text-gray-400 text-sm">Click on a message to read it</p>
            </div>
          )}
        </div>
      </div>
      {/* Reply Modal */}
      {replyModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FaPaperPlane className="text-emerald-500" />
                  Send Reply
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  To: {selected.name} &lt;{selected.email}&gt;
                </p>
              </div>
              <button
                onClick={() => setReplyModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Preset Templates */}
            <div className="px-5 pt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Quick Templates</label>
                {activePreset && (
                  <button
                    onClick={() => {
                      setActivePreset(null);
                      setReplyForm({
                        subject: `Re: ${selected.subject || "Your Inquiry"} | Tripzo`,
                        body: `Hi ${selected.name},\n\nThank you for reaching out to Tripzo!\n\n\n\nBest regards,\nTeam Tripzo`,
                      });
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600 transition"
                  >
                    Clear template
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {getPresetTemplates(selected.name).map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                      activePreset === preset.id
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <span>{preset.icon}</span>
                    {preset.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setActivePreset("custom");
                    setReplyForm({
                      subject: `Re: ${selected.subject || "Your Inquiry"} | Tripzo`,
                      body: `Hi ${selected.name},\n\n`,
                    });
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                    activePreset === "custom"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                  }`}
                >
                  <span>✏️</span>
                  Custom Message
                </button>
              </div>
            </div>

            {/* Original Message Preview */}
            <div className="px-5 pt-4">
              <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-1">Original Message</div>
                <p className="text-xs text-gray-600 line-clamp-3">{selected.message}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="px-5 pb-2 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Subject</label>
                <input
                  type="text"
                  value={replyForm.subject}
                  onChange={(e) => setReplyForm({ ...replyForm, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Message Body</label>
                <textarea
                  value={replyForm.body}
                  onChange={(e) => setReplyForm({ ...replyForm, body: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-5 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setReplyModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={replySending}
                className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition flex items-center gap-2 disabled:opacity-60"
              >
                {replySending ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <FaPaperPlane className="text-xs" />
                )}
                {replySending ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;

