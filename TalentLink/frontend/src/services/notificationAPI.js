import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const notificationAPI = {
  getAll: () => api.get('/auth/notifications/'),
  get: (id) => api.get(`/auth/notifications/${id}/`),
  markAsRead: (id) => api.patch(`/auth/notifications/${id}/mark-as-read/`),
  getUnreadCount: () => api.get('/auth/notifications/unread-count/'),
  delete: (id) => api.delete(`/auth/notifications/${id}/`),
};