import axiosInstance from "./axiosInstance";

// Fetch all contracts for current user (freelancer/client)
export const getMyContracts = () =>
  axiosInstance.get("/contracts/my-contracts/");

// Update status of a contract (complete/cancel)
export const updateContractStatus = (contractId, status) =>
  axiosInstance.patch(`/contracts/${contractId}/status/`, { status });
