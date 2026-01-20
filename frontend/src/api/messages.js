import axiosInstance from "./axiosInstance";

export const getMessages = (contractId) =>
  axiosInstance.get(`/messages/${contractId}/`);

export const sendMessage = (contractId, content) =>
  axiosInstance.post(`/messages/${contractId}/send/`, { content });
