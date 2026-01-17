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

export const getContractMessages = (contractId) =>
  API.get(`/messages/contract/${contractId}/`);

export const sendMessage = (contractId, content) =>
  API.post("/messages/send/", {
    contract: contractId,
    content: content,
  });