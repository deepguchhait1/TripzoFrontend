import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaInfoCircle,
  FaLock,
  FaCamera,
  FaShieldAlt,
  FaClock,
  FaSave,
  FaKey,
  FaEdit,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { updateAdminProfile, changeAdminPassword } from "../../services/api";
import ImageUploader from "../../components/ImageUploader";

const AdminProfile = () => {
  const { admin, setAdmin } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [form, setForm] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
    phone: admin?.phone || "",
    bio: admin?.bio || "",
    avatar: admin?.avatar || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSaving(true);
    try {
      const res = await updateAdminProfile(form);
      setAdmin(res.data);
      localStorage.setItem("adminUser", JSON.stringify(res.data));
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSavingPassword(true);
    try {
      await changeAdminPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully");
      setChangingPassword(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  const cancelEdit = () => {
    setForm({
      name: admin?.name || "",
      email: admin?.email || "",
      phone: admin?.phone || "",
      bio: admin?.bio || "",
      avatar: admin?.avatar || "",
    });
    setEditing(false);
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover */}
        <div className="h-36 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHYyaC0ydjRoLTJ2Mmg0djJoMnYtMmg0di0yaC0ydi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        </div>

        {/* Avatar + Info */}
        <div className="px-6 pb-6 -mt-16 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            {/* Avatar */}
            <div className="relative group">
              {admin?.avatar || form.avatar ? (
                <img
                  src={admin?.avatar || form.avatar}
                  alt={admin?.name}
                  className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">
                    {getInitials(admin?.name)}
                  </span>
                </div>
              )}
              {editing && (
                <label className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition">
                  <FaCamera className="text-white text-xl" />
                </label>
              )}
            </div>

            {/* Name & Role */}
            <div className="flex-1 text-center sm:text-left pb-1">
              <h2 className="text-xl font-bold text-gray-800">
                {admin?.name || "Admin"}
              </h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                  <FaShieldAlt className="text-[10px]" />
                  {admin?.role || "admin"}
                </span>
                <span className="text-gray-400 text-xs">
                  {admin?.email}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex gap-2">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition shadow-sm"
                >
                  <FaEdit className="text-xs" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-200 transition"
                  >
                    <FaTimes className="text-xs" />
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
                  >
                    <FaSave className="text-xs" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FaUser className="text-emerald-600 text-sm" />
              </div>
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                    placeholder="Your full name"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl">
                    <FaUser className="text-gray-400 text-xs" />
                    <span className="text-sm text-gray-800">
                      {admin?.name || "—"}
                    </span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Email Address
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                    placeholder="admin@example.com"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl">
                    <FaEnvelope className="text-gray-400 text-xs" />
                    <span className="text-sm text-gray-800">
                      {admin?.email || "—"}
                    </span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Phone Number
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                    placeholder="+1 (555) 000-0000"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl">
                    <FaPhone className="text-gray-400 text-xs" />
                    <span className="text-sm text-gray-800">
                      {admin?.phone || "Not set"}
                    </span>
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Avatar
                </label>
                {editing ? (
                  <ImageUploader
                    value={form.avatar}
                    onChange={(url) => setForm({ ...form, avatar: url })}
                    folder="tripzo/avatars"
                    rounded="full"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl">
                    <FaCamera className="text-gray-400 text-xs" />
                    <span className="text-sm text-gray-800 truncate">
                      {admin?.avatar || "Not set"}
                    </span>
                  </div>
                )}
              </div>

              {/* Bio - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Bio
                </label>
                {editing ? (
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className="flex items-start gap-2 px-4 py-2.5 bg-gray-50 rounded-xl min-h-[60px]">
                    <FaInfoCircle className="text-gray-400 text-xs mt-1" />
                    <span className="text-sm text-gray-800">
                      {admin?.bio || "No bio added yet"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FaLock className="text-amber-600 text-sm" />
                </div>
                Security
              </h3>
              {!changingPassword && (
                <button
                  onClick={() => setChangingPassword(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded-xl hover:bg-amber-100 transition"
                >
                  <FaKey className="text-xs" />
                  Change Password
                </button>
              )}
            </div>

            {changingPassword ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                      placeholder="At least 6 characters"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setChangingPassword(false);
                      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    }}
                    className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordSave}
                    disabled={savingPassword}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-xl hover:bg-amber-600 transition shadow-sm disabled:opacity-50"
                  >
                    <FaLock className="text-xs" />
                    {savingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <FaCheckCircle className="text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Password is set
                  </p>
                  <p className="text-xs text-gray-400">
                    Click "Change Password" to update your password
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Account Info */}
        <div className="space-y-6">
          {/* Account Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaShieldAlt className="text-blue-600 text-sm" />
              </div>
              Account Details
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-500">Role</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full capitalize">
                  <FaShieldAlt className="text-[10px]" />
                  {admin?.role || "admin"}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-500">
                  Account ID
                </span>
                <span className="text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
                  {admin?._id?.slice(-8) || admin?.id?.slice(-8) || "—"}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-500">
                  Member Since
                </span>
                <span className="text-xs text-gray-600">
                  {admin?.createdAt
                    ? new Date(admin.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-xs font-medium text-gray-500">
                  Last Updated
                </span>
                <span className="text-xs text-gray-600">
                  {admin?.updatedAt
                    ? new Date(admin.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaClock className="text-purple-600 text-sm" />
              </div>
              Activity
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                <div className="text-[11px] text-emerald-600 font-medium">
                  Status
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-gray-800">
                    Active
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="text-[11px] text-blue-600 font-medium">
                  Session
                </div>
                <div className="text-sm font-semibold text-gray-800 mt-1">
                  Logged In
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
