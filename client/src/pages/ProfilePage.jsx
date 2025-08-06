import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, isLoggedIn, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [editName, setEditName] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isEdited = editName && name.trim() !== user.name;

  const recentActivity = [
    { id: 1, action: "Completed React quiz", date: "Aug 1, 2025" },
    { id: 2, action: "Commented on State Management article", date: "Jul 30, 2025" },
    { id: 3, action: "Joined Practice Room", date: "Jul 28, 2025" },
  ];

  const preferences = {
    theme: "Light Mode",
    notifications: true,
    language: "English",
  };

  const updateProfile = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/update-profile`, { name }, {
        headers: { Authorization: `Bearer ${user.token}` },
        withCredentials: true,
      });

      await refreshUser();
      setMessage("Profile updated successfully.");
      setEditName(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is irreversible.")) return;

    setDeleting(true);
    setMessage("");
    setError("");

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/auth/delete`, {
        headers: { Authorization: `Bearer ${user.token}` },
        withCredentials: true,
      });

      setMessage("Account deleted. Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setError("Account deletion failed.");
    } finally {
      setDeleting(false);
    }
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Header />
        <p className="text-lg font-semibold text-gray-700 mt-20">Please log in to view your profile.</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800">
      <Header />
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl blur-lg opacity-40"></div>
            <div className="relative z-10 bg-white rounded-3xl shadow-xl p-10">

              <h1 className="text-4xl font-extrabold text-center text-gray-800">Your Profile</h1>

              {/* Avatar */}
              <div className="w-28 h-28 mx-auto mt-6">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover shadow-lg border-4 border-white"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white">
                    {user.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>

              {/* Editable Info */}
              <div className="mt-10 space-y-6 text-gray-700">
                {/* Name */}
                <div className="transition hover:bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-semibold mb-1 block">Name</label>
                  {!editName ? (
                    <div className="flex justify-between items-center">
                      <p className="text-md font-medium">{name}</p>
                      <button
                        onClick={() => setEditName(true)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 transition"
                      >
                        <FaPen className="w-3 h-3" /> Edit
                      </button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
                    />
                  )}
                </div>

                {/* Email */}
                <div className="transition hover:bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-semibold mb-1 block">Email</label>
                  <p className="text-md font-medium">{email}</p>
                </div>

                {/* Preferences & Activity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-indigo-50 rounded-xl p-4 hover:shadow-md transition">
                    <h2 className="text-lg font-semibold mb-2">Preferences</h2>
                    <ul className="text-sm space-y-1">
                      <li>🌈 Theme: {preferences.theme}</li>
                      <li>🔔 Notifications: {preferences.notifications ? "Enabled" : "Disabled"}</li>
                      <li>🗣️ Language: {preferences.language}</li>
                    </ul>
                  </div>

                  <div className="bg-indigo-50 rounded-xl p-4 hover:shadow-md transition">
                    <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
                    <ul className="space-y-2 text-sm">
                      {recentActivity.map((item) => (
                        <li key={item.id} className="flex justify-between items-center hover:bg-white hover:shadow px-3 py-2 rounded-md transition">
                          <span>{item.action}</span>
                          <span className="text-gray-500 text-xs">{item.date}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col gap-3">
                {isEdited && (
                  <button
                    onClick={updateProfile}
                    disabled={saving}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                )}
                <button
                  onClick={deleteAccount}
                  disabled={deleting}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete Account"}
                </button>
              </div>

              {/* Feedback */}
              {(message || error) && (
                <div className="pt-4">
                  {message && <p className="text-sm text-green-600">{message}</p>}
                  {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}