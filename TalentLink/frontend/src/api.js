import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? (process.env.REACT_APP_API_URL_PROD || 'https://talentlink-7pqy.onrender.com/api')
  : (process.env.REACT_APP_API_URL_LOCAL || 'http://localhost:8000/api');

// Log API URL for debugging
console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Enhanced error logging for debugging
    if (error.response) {
      console.error('API Response Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: originalRequest.url,
        method: originalRequest.method
      });
    } else if (error.request) {
      console.error('API Network Error:', {
        message: 'Network error - please check your connection',
        url: originalRequest.url,
        method: originalRequest.method,
        baseURL: API_BASE_URL
      });
    } else {
      console.error('API Setup Error:', error.message);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh_token = localStorage.getItem('refresh_token');
      if (refresh_token) {
        try {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refresh_token,
          });
          localStorage.setItem('access_token', response.data.access);
          return api(originalRequest);
        } catch (error) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register/', userData),
  login: (credentials) => {
    console.log('authAPI.login called with:', credentials);
    console.log('API base URL:', api.defaults.baseURL);
    return api.post('/auth/login/', credentials);
  },
  getProfile: () => api.get('/auth/profile/'),
  getPublicProfile: (userId) => api.get(`/auth/profile/${userId}/`),  
  updateProfile: (profileData) => api.patch('/auth/profile/update/', profileData),
  updateUser: (userData) => api.patch('/auth/user/update/', userData),
  getSkills: () => api.get('/auth/skills/'),
  createSkill: (skillData) => api.post('/auth/skills/', skillData),
  changePassword: (passwordData) => api.post('/auth/change-password/', passwordData),
};

export const projectAPI = {
  getAll: (params) => api.get('/projects/', { params }),
  get: (id) => api.get(`/projects/${id}/`),
  create: (data) => api.post('/projects/', data),
  update: (id, data) => api.patch(`/projects/${id}/`, data),
  delete: (id) => api.delete(`/projects/${id}/`),
  getMyProjects: () => api.get('/projects/my/'),
};

export const proposalAPI = {
  create: (projectId, data) => api.post(`/projects/${projectId}/proposals/`, data),
  getByProject: (projectId) => api.get(`/projects/${projectId}/proposals/`),
  getMyProposals: () => api.get('/projects/proposals/'),
  updateStatus: (id, status) => api.patch(`/projects/proposals/${id}/`, { status }),
};

export const userAPI = {
  getUserByUsername: (username) => api.get(`/auth/users/${username}/`),
};

export default api;
