import axios from "axios";

const messagingApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/messages/",
  headers: {
    "Content-Type": "application/json",
  },
});

messagingApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default messagingApi;
