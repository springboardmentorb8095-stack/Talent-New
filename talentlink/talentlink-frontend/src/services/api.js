import axios from 'axios';
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/auth/', // Your Django backend
  headers: { 'Content-Type': 'application/json' },
});
// Interceptor to add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Interceptor to handle token refresh on 401 error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        const response = await api.post('token/refresh/', { refresh: refreshToken });
        localStorage.setItem('access_token', response.data.access);
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);
export default api; 