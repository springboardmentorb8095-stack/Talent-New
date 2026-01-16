import axios from "axios";

// Get base URL
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  return 'http://127.0.0.1:8000/api';
};

// Create axios instance
const API = axios.create({
  baseURL: getBaseURL(),
});

// Attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getUnreadCount = () =>
  API.get("/notifications/unread-count/");

export const getNotifications = () =>
  API.get("/notifications/");

export const markAsRead = (notificationId) =>
  API.patch(`/notifications/${notificationId}/`, {
    is_read: true,
  });