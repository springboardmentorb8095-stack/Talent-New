import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications/");
      setNotifications(res.data);
      setUnreadCount(
        res.data.filter((n) => !n.is_read).length
      );
    } catch (err) {
      console.error("Failed to load notifications");
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read/`);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read");
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // 🔄 polling
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
