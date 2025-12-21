import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

// API.interceptors.request.use(
//  (req) => {
//    const token = localStorage.getItem("access");
//    if (token) {
//      req.headers.Authorization = `Bearer ${token}`;
//    }
//    return req;
//  },
//  (error) => Promise.reject(error)
//);
