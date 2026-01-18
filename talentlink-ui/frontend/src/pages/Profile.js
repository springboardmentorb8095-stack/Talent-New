import { useEffect, useState } from "react";
import API from "../services/api";

function Profile({ setPage }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get("profile/");
        setProfile(res.data);
      } catch {
        alert("Failed to load profile");
        setPage("dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [setPage]);

  if (loading) {
    return <div className="loading-screen">Loading profile...</div>;
  }

  const {
    user,
    title,
    bio,
    location,
    hourly_rate,
    availability,
    skills,
    average_rating,
    reviews_count,
  } = profile;

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        {/* ================= HEADER ================= */}
        <header className="dashboard-topbar">
          <div>
            <h2>Profile</h2>
            <p className="muted">Manage your personal information</p>
          </div>

          <button
            className="secondary-btn"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>
        </header>

        {/* ================= PROFILE CARD ================= */}
        <div className="card fade" style={{ maxWidth: "900px", margin: "auto" }}>
          {/* ================= USER HEADER ================= */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                margin: "0 auto 12px",
                background:
                  "linear-gradient(135deg, var(--primary), var(--secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>

            <h2>{user.username}</h2>
            <p className="muted">{user.email}</p>
          </div>

          {/* ================= RATING ================= */}
          <div className="rating-row" style={{ justifyContent: "center" }}>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    star <= Math.round(average_rating)
                      ? "star active"
                      : "star"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span className="rating-text">
              {average_rating || 0} / 5 ({reviews_count || 0} reviews)
            </span>
          </div>

          {/* ================= INFO GRID ================= */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
              marginTop: "30px",
            }}
          >
            <div>
              <h4>Professional Title</h4>
              <p className="muted">{title || "Not specified"}</p>
            </div>

            <div>
              <h4>Location</h4>
              <p className="muted">{location || "Not specified"}</p>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <h4>Bio</h4>
              <p className="muted">{bio || "No bio added yet."}</p>
            </div>

            {user.role === "FREELANCER" && (
              <>
                <div>
                  <h4>Hourly Rate</h4>
                  <p className="muted">
                    ₹{hourly_rate ? hourly_rate : "Not specified"}
                  </p>
                </div>

                <div>
                  <h4>Availability</h4>
                  <p className="muted">{availability || "Not specified"}</p>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <h4>Skills</h4>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "8px",
                    }}
                  >
                    {skills && skills.length > 0 ? (
                      skills.map((s) => (
                        <span
                          key={s.id}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "999px",
                            background:
                              "linear-gradient(135deg, rgba(139,92,246,.25), rgba(6,182,212,.25))",
                            border: "1px solid var(--border-glass)",
                            fontSize: "13px",
                          }}
                        >
                          {s.name}
                        </span>
                      ))
                    ) : (
                      <span className="muted">No skills added</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ================= ACTIONS ================= */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "40px",
              justifyContent: "center",
            }}
          >
            <button
              className="primary-btn"
              onClick={() => setPage("edit-profile")}
            >
              ✏️ Edit Profile
            </button>

            <button
              className="secondary-btn"
              onClick={() => setPage("dashboard")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
