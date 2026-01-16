// // Import axios for API calls
// import axios from "axios";

// // Create axios instance with backend base URL
// const API = axios.create({
//   baseURL: "http://127.0.0.1:8000/api",
// });

// // Automatically attach token to every request
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("access"); // JWT access token
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// // Get proposals for a specific project (CLIENT USE)
// export const getProjectProposals = (projectId) =>
//   API.get(`/proposals/project/${projectId}/`);

// // Client accepts or rejects a proposal
// export const updateProposalStatus = (proposalId, status) =>
//   API.patch(`/proposals/${proposalId}/status/`, {
//     status: status,
//   });

//   // Get proposals created by logged-in freelancer
// export const getMyProposals = () =>
//   API.get("/proposals/my/");


// Import axios for API calls
import axios from "axios";

// Get base URL - use relative path in production, localhost in development
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/api'; // Use relative path on Render
  }
  return 'http://127.0.0.1:8000/api';
};

// Create axios instance with backend base URL
const API = axios.create({
  baseURL: getBaseURL(),
});

// Automatically attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access"); // JWT access token
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Get proposals for a specific project (CLIENT USE)
export const getProjectProposals = (projectId) =>
  API.get(`/proposals/project/${projectId}/`);

// Client accepts or rejects a proposal
export const updateProposalStatus = (proposalId, status) =>
  API.patch(`/proposals/${proposalId}/status/`, {
    status: status,
  });

// Get proposals created by logged-in freelancer
export const getMyProposals = () =>
  API.get("/proposals/my/");