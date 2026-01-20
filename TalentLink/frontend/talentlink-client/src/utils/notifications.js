import axios from "axios";

const API = "http://127.0.0.1:8000/api/notifications/";

/* =========================
   GET ALL NOTIFICATIONS
========================= */
export const getNotifications = async () => {
  const token = localStorage.getItem("access");

  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

/* =========================
   MARK ALL AS READ
========================= */
export const markAllNotificationsRead = async () => {
  const token = localStorage.getItem("access");

  await axios.post(
    `${API}mark-read/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

/* =========================
   MARK SINGLE AS READ ✅
========================= */
export const markNotificationRead = async (id) => {
  const token = localStorage.getItem("access");

  await axios.post(
    `${API}mark-read/${id}/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
