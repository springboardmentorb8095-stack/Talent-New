import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    // Public endpoints (no token needed)
    const publicEndpoints = [
      "/token/",
      "/register/",
      "/projects/",
      "/projects"
    ];

    const isPublic = publicEndpoints.some((url) =>
      config.url.startsWith(url)
    );

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;


