import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { proposalAPI } from '../api';
import { contractAPI } from '../services/contractService';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  ChatBubbleLeftRightIcon,
  DocumentPlusIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const Proposals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [contractForm, setContractForm] = useState({
    start_date: '',
    end_date: '',
    deliverables: '',
    payment_schedule: 'Full payment upon completion',
    payment_method: 'fixed'
  });

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await proposalAPI.getMyProposals();
      setProposals(response.data);
    } catch (err) {
      setError('Failed to load proposals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (proposalId, newStatus) => {
    try {
      await proposalAPI.updateStatus(proposalId, newStatus);
      setProposals(proposals.map(p => 
        p.id === proposalId ? { ...p, status: newStatus } : p
      ));
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update proposal status');
    }
  };

  const handleCreateContractClick = (proposal) => {
    setSelectedProposal(proposal);
    setContractForm(prev => ({
      ...prev,
      deliverables: `Deliverables for ${proposal.project}`
    }));
    setShowContractModal(true);
  };

  const handleCreateContract = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...contractForm,
        end_date: contractForm.end_date || null
      };
      await contractAPI.createContractFromProposal(selectedProposal.id, payload);
      setShowContractModal(false);
      navigate('/contracts');
    } catch (err) {
      console.error('Failed to create contract', err);
      alert(err.response?.data?.error || 'Failed to create contract');
    }
  };

  const handleViewFreelancerProfile = (freelancerUsername) => {
    navigate(`/profile/${freelancerUsername}`);
  };

  if (loading) return <div className="p-8 text-center">Loading proposals...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.role === 'client' ? 'Received Proposals' : 'My Proposals'}
        </h1>
      </div>

      {proposals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No proposals found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition hover:shadow-md h-full flex flex-col">
              <div className="flex flex-col md:flex-row justify-between gap-6 flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${proposal.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                        proposal.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {proposal.status}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      {new Date(proposal.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Project: <span className="text-blue-600">{proposal.project}</span>
                  </h3>
                  
                  {user?.role === 'client' && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs">
                        {proposal.freelancer.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Applicant: {proposal.freelancer}
                      </span>
                      <button
                        onClick={() => handleViewFreelancerProfile(proposal.freelancer)}
                        className="ml-2 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <UserIcon className="h-3 w-3" />
                        View Profile
                      </button>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <p className="text-gray-600 text-sm">{proposal.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                    Bid Amount: ₹{proposal.bid_amount}
                  </div>
                </div>

                <div className="flex md:flex-col gap-3 justify-center md:justify-start min-w-[140px]">
                  {user?.role === 'client' && proposal.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(proposal.id, 'accepted')}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(proposal.id, 'rejected')}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <XCircleIcon className="h-4 w-4" />
                        Reject
                      </button>
                    </>
                  )}
                  
                  {user?.role === 'client' && proposal.status === 'accepted' && !proposal.contract && (
                    <button
                      onClick={() => handleCreateContractClick(proposal)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <DocumentPlusIcon className="h-4 w-4" />
                      Create Contract
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Contract Modal */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowContractModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateContract}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                    Create Contract
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="date"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={contractForm.start_date}
                        onChange={(e) => setContractForm({...contractForm, start_date: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
                      <input
                        type="date"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={contractForm.end_date}
                        onChange={(e) => setContractForm({...contractForm, end_date: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Deliverables</label>
                      <textarea
                        required
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={contractForm.deliverables}
                        onChange={(e) => setContractForm({...contractForm, deliverables: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Schedule</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={contractForm.payment_schedule}
                        onChange={(e) => setContractForm({...contractForm, payment_schedule: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowContractModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proposals;
