import axiosInstance from "./axiosInstance";

export const getCurrentUser = async () => {
  const res = await axiosInstance.get("/users/me/");
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axiosInstance.post("/users/login/", data);
  return res.data;
};

// import api from "./axios";

// export const loginUser = async (credentials) => {
//   const response = await api.post("/users/login/", credentials);
//   return response.data;
// };

// export const getCurrentUser = async (token) => {
//   const response = await api.get("/users/me/", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };

