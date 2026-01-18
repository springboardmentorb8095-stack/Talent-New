import { useEffect, useState } from "react";
import API from "../services/api";

function Settings({ setPage }) {
  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get("profile/");
        setProfile(res.data);
      } catch {
        localStorage.clear();
        setPage("login");
      }
    };
    loadProfile();
  }, [setPage]);

  /* ================= THEME ================= */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.clear();
    setPage("login");
  };

  if (!profile) {
    return <div className="loading-screen">Loading settings...</div>;
  }

  const { user } = profile;

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">

        {/* ===== HEADER ===== */}
        <header className="dashboard-topbar">
          <div>
            <h2>Settings</h2>
            <p className="muted">
              Manage your account, preferences and security
            </p>
          </div>

          <button
            className="secondary-btn"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>
        </header>

        {/* ===== SETTINGS GRID ===== */}
        <div className="settings-grid">

          {/* ===== PROFILE ===== */}
          <div className="card">
            <h3>👤 Profile</h3>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>

            <button
              className="primary-btn small"
              onClick={() => setPage("edit-profile")}
            >
              Edit Profile
            </button>
          </div>

          {/* ===== APPEARANCE ===== */}
          <div className="card">
            <h3>🎨 Appearance</h3>
            <p className="muted">
              Choose how TalentLink looks for you
            </p>

            <button className="secondary-btn" onClick={toggleTheme}>
              {theme === "light" ? "🌙 Switch to Dark Mode" : "☀️ Switch to Light Mode"}
            </button>
          </div>

          {/* ===== SECURITY ===== */}
          <div className="card">
            <h3>🔐 Security</h3>
            <p className="muted">
              Protect your account and credentials
            </p>

            <button
              className="secondary-btn"
              onClick={() => setPage("forgot")}
            >
              Change Password
            </button>
          </div>

          {/* ===== NOTIFICATIONS ===== */}
          <div className="card">
            <h3>🔔 Notifications</h3>
            <p className="muted">
              Control how you receive updates
            </p>

            <div className="settings-toggle">
              <span>Email notifications</span>
              <input type="checkbox" defaultChecked />
            </div>

            <div className="settings-toggle">
              <span>In-app notifications</span>
              <input type="checkbox" defaultChecked />
            </div>
          </div>

          {/* ===== LOGOUT ===== */}
          <div className="card danger-zone">
            <h3>🚪 Logout</h3>
            <p className="muted">
              You will be signed out from this device
            </p>

            <button className="danger" onClick={handleLogout}>
              Logout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;
