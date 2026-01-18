import { useEffect, useState } from "react";
import API from "../services/api";

function Notifications({ setPage }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD NOTIFICATIONS ================= */
  const loadNotifications = async () => {
    try {
      const res = await API.get("notifications/");
      setNotifications(res.data);
    } catch {
      alert("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  /* ================= MARK AS READ ================= */
  const markAsRead = async (id) => {
    try {
      await API.put(`notifications/${id}/read/`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch {
      alert("Failed to mark notification as read");
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading notifications...</div>;
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        {/* ================= HEADER ================= */}
        <header className="dashboard-topbar">
          <div>
            <h2>Notifications</h2>
            <p className="muted">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${
                    unreadCount > 1 ? "s" : ""
                  }`
                : "You're all caught up 🎉"}
            </p>
          </div>

          <button
            className="secondary-btn"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>
        </header>

        {/* ================= CONTENT ================= */}
        {notifications.length === 0 ? (
          <div className="card fade" style={{ textAlign: "center" }}>
            <h3>No Notifications</h3>
            <p className="muted">
              Updates, messages, and alerts will appear here.
            </p>
          </div>
        ) : (
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.is_read && markAsRead(n.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "18px 22px",
                  borderRadius: 16,
                  cursor: n.is_read ? "default" : "pointer",
                  background: n.is_read
                    ? "rgba(255,255,255,0.04)"
                    : "linear-gradient(135deg, rgba(139,92,246,.18), rgba(6,182,212,.18))",
                  border: "1px solid var(--border-glass)",
                  boxShadow: n.is_read
                    ? "none"
                    : "0 10px 30px rgba(139,92,246,.25)",
                  transition: "all .3s ease",
                }}
              >
                {/* LEFT INDICATOR */}
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: n.is_read
                      ? "transparent"
                      : "var(--primary)",
                    boxShadow: n.is_read
                      ? "none"
                      : "0 0 12px var(--primary)",
                  }}
                />

                {/* CONTENT */}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: n.is_read ? 400 : 600,
                    }}
                  >
                    {n.text}
                  </p>

                  <span
                    style={{
                      fontSize: 12,
                      opacity: 0.7,
                    }}
                  >
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>

                {/* BADGE */}
                {!n.is_read && (
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      background:
                        "linear-gradient(135deg, var(--primary), var(--secondary))",
                      color: "#fff",
                    }}
                  >
                    NEW
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
