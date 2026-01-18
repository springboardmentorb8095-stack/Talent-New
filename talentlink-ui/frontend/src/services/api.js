import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

/* ================= JWT INTERCEPTOR ================= */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= AUTH APIs ================= */
export const login = (data) => API.post("auth/login/", data);
export const register = (data) => API.post("auth/register/", data);
export const verifyOTP = (data) => API.post("auth/verify-otp/", data);
export const forgotPassword = (data) => API.post("auth/forgot-password/", data);

/* ================= USER UPDATE ================= */
export const updateUser = (data) =>
  API.put("auth/update-user/", data);

/* ================= PROFILE APIs ================= */
export const getProfile = () => API.get("profile/");
export const updateProfile = (data) => API.put("profile/", data);

/* ================= PROJECT APIs ================= */

// Project feed + filters
export const getProjects = (params = {}) =>
  API.get("projects/", { params });

// Project details
export const getProjectById = (id) =>
  API.get(`projects/${id}/`);

// Client creates project
export const createProject = (data) =>
  API.post("projects/", data);

// Client updates project
export const updateProject = (id, data) =>
  API.put(`projects/${id}/`, data);

// Client deletes project
export const deleteProject = (id) =>
  API.delete(`projects/${id}/`);

/* ================= PROPOSAL APIs ================= */

// Freelancer submits proposal
export const submitProposal = (data) =>
  API.post("proposals/", data);

// Client views proposals for a project
export const getProjectProposals = (projectId) =>
  API.get(`projects/${projectId}/proposals/`);

// Client accepts / rejects proposal
export const updateProposalStatus = (proposalId, status) =>
  API.put(`proposals/${proposalId}/status/`, { status });

export default API;
