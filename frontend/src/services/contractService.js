import axios from "axios";

// Get base URL - use relative path in production, localhost in development
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

// Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Get contracts for logged-in user
export const getMyContracts = () =>
  API.get("/contracts/my/");

// Update contract status
export const updateContractStatus = (contractId, status) =>
  API.patch(`/contracts/${contractId}/status/`, {
    status: status,
  });