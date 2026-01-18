import { useEffect, useState } from "react";
import API from "../services/api";

function EditProfile({ setPage }) {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [saving, setSaving] = useState(false);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await API.get("profile/");
        setProfile(res.data);
        setUser({
          username: res.data.user.username,
          email: res.data.user.email,
          password: "",
        });
      } catch {
        localStorage.clear();
        setPage("login");
      }
    };

    loadData();
  }, [setPage]);

  /* ================= HANDLERS ================= */
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUserChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      setSaving(true);

      await API.put("auth/update-user/", {
        username: user.username,
        email: user.email,
        password: user.password || undefined,
      });

      await API.put("profile/", profile);

      alert("Profile updated successfully");
      setPage("profile");
    } catch {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return <div className="loading-screen">Loading profile...</div>;
  }

  const role = profile.user.role;

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        {/* ================= HEADER ================= */}
        <header className="dashboard-topbar">
          <div>
            <h2>Edit Profile</h2>
            <p className="muted">Update your personal & professional details</p>
          </div>

          <button
            className="secondary-btn"
            onClick={() => setPage("profile")}
          >
            ← Back
          </button>
        </header>

        {/* ================= FORM CARD ================= */}
        <div
          className="card fade"
          style={{ maxWidth: "900px", margin: "auto" }}
        >
          {/* ================= ACCOUNT ================= */}
          <h3 style={{ marginBottom: "16px" }}>Account Information</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
              marginBottom: "32px",
            }}
          >
            <input
              name="username"
              placeholder="Username"
              value={user.username}
              onChange={handleUserChange}
            />

            <input
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleUserChange}
            />

            <input
              name="password"
              type="password"
              placeholder="New Password (optional)"
              value={user.password}
              onChange={handleUserChange}
            />
          </div>

          {/* ================= PROFILE ================= */}
          <h3 style={{ marginBottom: "16px" }}>Profile Information</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            <input
              name="title"
              placeholder="Professional Title"
              value={profile.title || ""}
              onChange={handleProfileChange}
            />

            <input
              name="location"
              placeholder="Location"
              value={profile.location || ""}
              onChange={handleProfileChange}
            />

            <textarea
              name="bio"
              placeholder="Short bio about you"
              rows={4}
              value={profile.bio || ""}
              onChange={handleProfileChange}
              style={{ gridColumn: "1 / -1" }}
            />

            {/* FREELANCER */}
            {role === "FREELANCER" && (
              <>
                <input
                  name="hourly_rate"
                  placeholder="Hourly Rate (₹)"
                  value={profile.hourly_rate || ""}
                  onChange={handleProfileChange}
                />

                <input
                  name="availability"
                  placeholder="Availability (e.g. Full-time)"
                  value={profile.availability || ""}
                  onChange={handleProfileChange}
                />
              </>
            )}

            {/* CLIENT */}
            {role === "CLIENT" && (
              <>
                <input
                  name="company_name"
                  placeholder="Company Name"
                  value={profile.company_name || ""}
                  onChange={handleProfileChange}
                />

                <input
                  name="company_website"
                  placeholder="Company Website"
                  value={profile.company_website || ""}
                  onChange={handleProfileChange}
                />
              </>
            )}
          </div>

          {/* ================= ACTIONS ================= */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              marginTop: "40px",
            }}
          >
            <button
              className="primary-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              className="secondary-btn"
              onClick={() => setPage("profile")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
