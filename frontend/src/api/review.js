import axiosInstance from "./axiosInstance";

export const createReview = async (contractId, payload) => {
  return axiosInstance.post(`/reviews/${contractId}/`, payload);
};

export const getReviewForContract = (contractId) =>
  axiosInstance.get(`/reviews/${contractId}/view/`);