import { useEffect, useRef, useState } from "react";
import API from "../services/api";

function NotificationsBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  /* ================= LOAD NOTIFICATIONS ================= */
  const loadNotifications = async () => {
    try {
      const res = await API.get("notifications/");
      setNotifications(res.data);
    } catch {
      console.error("Failed to load notifications");
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= MARK AS READ ================= */
  const markAsRead = async (id) => {
    try {
      await API.put(`notifications/${id}/read/`);
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch {
      alert("Failed to mark notification as read");
    }
  };

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      {/* 🔔 BELL */}
      <button
        className="notification-bell"
        title="Notifications"
        onClick={() => setOpen(prev => !prev)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount}</span>
        )}
      </button>

      {/* 📜 DROPDOWN */}
      {open && (
        <div className="notification-dropdown fade">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h4 style={{ margin: 0 }}>Notifications</h4>
            {unreadCount > 0 && (
              <span className="badge">
                {unreadCount} new
              </span>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="muted">You’re all caught up 🎉</p>
          ) : (
            <div style={{ maxHeight: "320px", overflowY: "auto" }}>
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`notification-item ${
                    n.is_read ? "read" : "unread"
                  }`}
                  onClick={() => markAsRead(n.id)}
                >
                  <p style={{ margin: 0 }}>{n.text}</p>
                  <small className="muted">
                    {new Date(n.created_at).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationsBell;
