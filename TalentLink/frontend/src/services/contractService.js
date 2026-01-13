import api from '../api';

// Contract API calls
export const contractAPI = {
  // Get all contracts for the current user
  getContracts: () => api.get('/contracts/contracts/'),
  
  // Get a specific contract
  getContract: (id) => api.get(`/contracts/contracts/${id}/`),
  
  // Create a contract from a proposal
  createContract: (proposalId, contractData) => 
    api.post('/contracts/contracts/', { proposal_id: proposalId, ...contractData }),
  
  // Create a contract from a specific proposal (alternative endpoint)
  createContractFromProposal: (proposalId, contractData) => 
    api.post(`/contracts/proposals/${proposalId}/create-contract/`, contractData),
  
  // Sign or reject a contract
  signContract: (id, action, reason = '') => 
    api.post(`/contracts/contracts/${id}/sign/`, { action, reason }),
  
  // Get contract status history
  getContractStatusHistory: (id) => 
    api.get(`/contracts/contracts/${id}/status_history/`),
  
  // Get active contracts
  getActiveContracts: () => api.get('/contracts/contracts/active/'),
  
  // Update contract status
  updateContractStatus: (id, status, reason = '') => 
    api.patch(`/contracts/contracts/${id}/`, { status, reason }),
  
  // Update contract progress (for freelancers)
  updateProgress: (id, progress) => 
    api.post(`/contracts/contracts/${id}/update_progress/`, { progress })
};

export default contractAPI;