import { useEffect, useState } from "react";
import api from "../api/api";

export default function NotificationsDropdown({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications/");
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read/`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-80 bg-white shadow-lg rounded border">
      <div className="p-3 font-semibold border-b">
        Notifications
      </div>

      {notifications.length === 0 ? (
        <div className="p-4 text-sm text-gray-500">
          No notifications
        </div>
      ) : (
        <ul className="max-h-80 overflow-y-auto">
          {notifications.map((n) => (
            <li
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-3 text-sm cursor-pointer border-b hover:bg-gray-100 ${
                n.is_read
                  ? "text-gray-500"
                  : "bg-indigo-50 font-medium"
              }`}
            >
              {n.message}
              <div className="text-xs text-gray-400 mt-1">
                {new Date(n.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="p-2 text-center border-t">
        <button
          onClick={onClose}
          className="text-sm text-indigo-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
