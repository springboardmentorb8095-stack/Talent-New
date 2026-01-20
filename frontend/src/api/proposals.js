import axiosInstance from "./axiosInstance";

// Freelancer: submit proposal
export const submitProposal = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/proposals/create/",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Backend error:", error.response?.data);
    throw error;
  }
};
  //axiosInstance.post(`/proposals/create/`, data);

// Freelancer: my proposals
export const getMyProposals = () =>
  axiosInstance.get("/proposals/my/");

// Client: accept / reject
export const updateProposalStatus = (proposalId, status) =>
  axiosInstance.patch(`/proposals/update-status/${proposalId}/`, { status });