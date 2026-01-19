// import axios from "axios";

// const notificationApi = axios.create({
//   baseURL: "http://127.0.0.1:8000/api/notifications/",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // 🔐 Attach JWT token to every request
// notificationApi.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // 📥 Get all notifications for logged-in user
// export const fetchNotifications = async () => {
//   const response = await notificationApi.get("/");
//   return response.data;
// };

// // ✅ Mark notification as read
// export const markNotificationRead = async (notificationId) => {
//   const response = await notificationApi.patch(
//     `${notificationId}/read/`
//   );
//   return response.data;
// };

// export default notificationApi;


import axios from "axios";

// 🔹 Axios instance for notifications API
const notificationApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/notifications/",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach JWT token to every request automatically
notificationApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // or "refresh_token" if needed
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 📥 Get all notifications for logged-in user
export const fetchNotifications = async () => {
  try {
    const response = await notificationApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
};

// 🔔 Get unread notifications count
export const fetchNotificationCount = async () => {
  try {
    const response = await notificationApi.get("/count/");
    return response.data.count;
  } catch (error) {
    console.error("Failed to fetch notification count:", error);
    return 0;
  }
};

// ✅ Mark a notification as read
export const markNotificationRead = async (notificationId) => {
  try {
    const response = await notificationApi.patch(`${notificationId}/read/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to mark notification ${notificationId} as read:`, error);
    throw error;
  }
};

// 🗑 Delete a notification
export const deleteNotification = async (notificationId) => {
  try {
    const response = await notificationApi.delete(`${notificationId}/delete/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete notification ${notificationId}:`, error);
    throw error;
  }
};

export default notificationApi;
