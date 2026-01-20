import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notifications/my/");
      setNotifications(res.data.results ?? []);
    } catch (err) {
      console.error(err);
      setNotifications([]);
    }
  };


  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 style={{ paddingLeft: "38px" }}>Notifications</h2>
      {notifications.length === 0 && <p>No notifications yet.</p>}

      <ul>
        {notifications.map((n) => (
          <div key={n.id} className="list-card" style={{ width: "96%" }}>
            {n.message}
            <small> — {new Date(n.created_at).toLocaleString()}</small>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;
