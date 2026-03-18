import { useEffect, useState, useMemo } from "react";
import {
  FaEnvelope,
  FaTrash,
  FaSearch,
  FaToggleOn,
  FaToggleOff,
  FaBell,
  FaUserCheck,
  FaUserTimes,
  FaPaperPlane,
  FaTimes,
  FaCheckSquare,
  FaSquare,
} from "react-icons/fa";
import { getSubscribers, deleteSubscriber, toggleSubscriber, sendSubscriberEmail } from "../../services/api";
import toast from "react-hot-toast";

const EMAIL_PRESETS = [
  {
    name: "Welcome Newsletter",
    subject: "Welcome to Tripzo — Your Next Adventure Awaits!",
    body: `Hi there! 👋

Thank you for being a valued Tripzo subscriber! We're thrilled to have you as part of our travel community.

Here's what you can look forward to:
• Exclusive travel deals and discounts
• Early access to new tour packages
• Curated destination guides and travel tips
• Seasonal offers you won't find anywhere else

Start exploring our latest packages and plan your dream vacation today!

Happy Travels,
Team Tripzo`,
  },
  {
    name: "New Deals / Offers",
    subject: "🔥 Exclusive Deals Just for You — Limited Time!",
    body: `Hello Traveler! 🌍

We have some amazing deals lined up just for our newsletter subscribers!

🎯 What's on offer:
• Up to 30% off on select holiday packages
• Early bird discounts on upcoming tours
• Special group booking offers

These deals won't last forever — head to our website to grab yours before they're gone!

Don't miss out!
Team Tripzo`,
  },
  {
    name: "Seasonal Greetings",
    subject: "🎉 Season's Greetings from Tripzo!",
    body: `Dear Subscriber,

Warm greetings from the Tripzo family! 🌟

As the season changes, so do our travel offerings. Whether you're looking for a serene hill station retreat, a sun-kissed beach getaway, or a cultural exploration — we've got the perfect package for you.

Check out our seasonal specials and make this season unforgettable!

Wishing you joy and wonderful journeys ahead.

Warm regards,
Team Tripzo`,
  },
  {
    name: "Travel Tips",
    subject: "✈️ Top Travel Tips from Tripzo Experts",
    body: `Hey Explorer! 🧭

Planning your next trip? Here are some expert tips from our travel team:

1. 📋 Book early for the best prices and availability
2. 🧳 Pack light — essentials only for a stress-free trip
3. 📱 Download offline maps for your destination
4. 💳 Carry a mix of payment options
5. 📸 Don't forget to capture the memories!

Need help planning? Our travel experts are just a click away. Visit our website to explore curated packages.

Bon voyage!
Team Tripzo`,
  },
  {
    name: "Feedback Request",
    subject: "We'd Love Your Feedback! 💬",
    body: `Dear Valued Subscriber,

At Tripzo, we're always looking to improve your experience. Your feedback means the world to us!

We'd love to hear:
• What destinations are you dreaming about?
• What type of packages interest you most?
• How can we make your travel planning easier?

Simply reply to this email or visit our Contact page to share your thoughts.

Thank you for being part of the Tripzo community!

Best regards,
Team Tripzo`,
  },
  {
    name: "Custom (Blank)",
    subject: "",
    body: "",
  },
];

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailTarget, setEmailTarget] = useState("active");
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [sending, setSending] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("");

  const fetchSubscribers = async () => {
    try {
      const { data } = await getSubscribers();
      setSubscribers(data);
    } catch {
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleToggle = async (id) => {
    try {
      const { data } = await toggleSubscriber(id);
      setSubscribers((prev) => prev.map((s) => (s._id === id ? data : s)));
      toast.success(data.active ? "Subscriber activated" : "Subscriber deactivated");
    } catch {
      toast.error("Failed to update subscriber");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this subscriber permanently?")) return;
    try {
      await deleteSubscriber(id);
      setSubscribers((prev) => prev.filter((s) => s._id !== id));
      toast.success("Subscriber removed");
    } catch {
      toast.error("Failed to delete subscriber");
    }
  };

  const toggleSelectEmail = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const toggleSelectAll = () => {
    const activeEmails = filtered.filter((s) => s.active).map((s) => s.email);
    if (activeEmails.every((e) => selectedEmails.includes(e))) {
      setSelectedEmails((prev) => prev.filter((e) => !activeEmails.includes(e)));
    } else {
      setSelectedEmails((prev) => [...new Set([...prev, ...activeEmails])]);
    }
  };

  const openEmailModal = () => {
    setEmailSubject("");
    setEmailBody("");
    setEmailTarget("active");
    setSelectedPreset("");
    setShowEmailModal(true);
  };

  const applyPreset = (presetName) => {
    const preset = EMAIL_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setEmailSubject(preset.subject);
      setEmailBody(preset.body);
      setSelectedPreset(presetName);
    }
  };

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast.error("Please fill in both subject and body");
      return;
    }
    setSending(true);
    try {
      const payload = {
        subject: emailSubject.trim(),
        body: emailBody.trim(),
      };
      if (emailTarget === "selected") {
        if (selectedEmails.length === 0) {
          toast.error("No subscribers selected");
          setSending(false);
          return;
        }
        payload.recipients = selectedEmails;
      } else {
        payload.recipients = emailTarget;
      }
      const { data } = await sendSubscriberEmail(payload);
      toast.success(data.message);
      setShowEmailModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const filtered = useMemo(() => {
    return subscribers.filter((s) => {
      const matchSearch = s.email.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === "all" || (filter === "active" ? s.active : !s.active);
      return matchSearch && matchFilter;
    });
  }, [subscribers, search, filter]);

  const activeCount = subscribers.filter((s) => s.active).length;
  const inactiveCount = subscribers.length - activeCount;

  const recipientCount =
    emailTarget === "active"
      ? activeCount
      : emailTarget === "selected"
      ? selectedEmails.length
      : subscribers.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBell className="text-emerald-600" /> Newsletter Subscribers
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage newsletter subscribers and send email campaigns
          </p>
        </div>
        <button
          onClick={openEmailModal}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
        >
          <FaPaperPlane /> Send Email
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FaEnvelope className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{subscribers.length}</p>
              <p className="text-xs text-gray-500">Total Subscribers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaUserCheck className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{activeCount}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FaUserTimes className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{inactiveCount}</p>
              <p className="text-xs text-gray-500">Inactive</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 text-gray-600">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "inactive", label: "Inactive" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === f.key
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FaEnvelope className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No subscribers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3 px-4 w-10">
                    <button onClick={toggleSelectAll} className="text-gray-400 hover:text-emerald-600 transition-colors">
                      {filtered.filter((s) => s.active).length > 0 &&
                      filtered.filter((s) => s.active).every((s) => selectedEmails.includes(s.email)) ? (
                        <FaCheckSquare className="text-emerald-600" />
                      ) : (
                        <FaSquare />
                      )}
                    </button>
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Subscribed On
                  </th>
                  <th className="text-right py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub) => (
                  <tr
                    key={sub._id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleSelectEmail(sub.email)}
                        className="text-gray-400 hover:text-emerald-600 transition-colors"
                        disabled={!sub.active}
                      >
                        {selectedEmails.includes(sub.email) && sub.active ? (
                          <FaCheckSquare className="text-emerald-600" />
                        ) : (
                          <FaSquare className={!sub.active ? "opacity-30" : ""} />
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <FaEnvelope className="text-emerald-600 text-xs" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {sub.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          sub.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            sub.active ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        {sub.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-sm text-gray-500">
                      {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggle(sub._id)}
                          className={`p-2 rounded-lg transition-colors ${
                            sub.active
                              ? "text-green-600 hover:bg-green-50"
                              : "text-gray-400 hover:bg-gray-100"
                          }`}
                          title={sub.active ? "Deactivate" : "Activate"}
                        >
                          {sub.active ? (
                            <FaToggleOn className="text-lg" />
                          ) : (
                            <FaToggleOff className="text-lg" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(sub._id)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selected count bar */}
      {selectedEmails.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
          <p className="text-sm text-emerald-800 font-medium">
            {selectedEmails.length} subscriber{selectedEmails.length !== 1 ? "s" : ""} selected
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedEmails([])}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => {
                setEmailTarget("selected");
                setEmailSubject("");
                setEmailBody("");
                setSelectedPreset("");
                setShowEmailModal(true);
              }}
              className="flex items-center gap-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg font-medium transition-colors"
            >
              <FaPaperPlane className="text-xs" /> Send to Selected
            </button>
          </div>
        </div>
      )}

      {/* Email Compose Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaPaperPlane className="text-emerald-600" /> Compose Newsletter
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Send email to your subscribers
                </p>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Preset Templates */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMAIL_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                        selectedPreset === preset.name
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipients */}
              <div className="text-gray-600">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Send To
                </label>
                <div className="flex gap-2">
                  {[
                    { key: "active", label: `Active (${activeCount})` },
                    { key: "all", label: `All (${subscribers.length})` },
                    { key: "selected", label: `Selected (${selectedEmails.length})` },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setEmailTarget(opt.key)}
                      disabled={opt.key === "selected" && selectedEmails.length === 0}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        emailTarget === opt.key
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } ${opt.key === "selected" && selectedEmails.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div className="text-gray-600">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                />
              </div>

              {/* Body */}
              <div className="text-gray-600">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Write your email content..."
                  rows={10}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm resize-y leading-relaxed"
                />
              </div>

              {/* Info bar */}
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2 text-sm text-gray-600">
                <FaEnvelope className="text-emerald-500" />
                <span>
                  This email will be sent to{" "}
                  <strong className="text-gray-800">{recipientCount}</strong>{" "}
                  subscriber{recipientCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={sending || !emailSubject.trim() || !emailBody.trim()}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                {sending ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane /> Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscribers;
