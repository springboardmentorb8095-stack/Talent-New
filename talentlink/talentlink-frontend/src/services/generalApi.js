// services/generalApi.js
import axios from 'axios';

const generalApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: { 'Content-Type': 'application/json' },
});

// Token interceptor
generalApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token refresh on 401
generalApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await generalApi.post('auth/token/refresh/', { refresh: refreshToken });
          localStorage.setItem('access_token', response.data.access);
          return generalApi(originalRequest);
        } catch (refreshErr) {
          // Optional: logout on refresh failure
          console.error("Token refresh failed:", refreshErr);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default generalApi;