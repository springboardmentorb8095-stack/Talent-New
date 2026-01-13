import React, { useState, useEffect } from 'react';
import { contractAPI } from '../services/contractService';
import { useAuth } from '../contexts/AuthContext';

const ContractManager = ({ proposal, onContractCreated }) => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    deliverables: '',
    milestones: '',
    payment_schedule: '',
    payment_method: 'fixed'
  });

  useEffect(() => {
    if (proposal && proposal.status === 'accepted') {
      loadContractForProposal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal]);

  const loadContractForProposal = async () => {
    try {
      setLoading(true);
      const response = await contractAPI.getContracts();
      const proposalContract = response.data.find(
        contract => contract.proposal === proposal.id
      );
      if (proposalContract) {
        setContracts([proposalContract]);
      }
    } catch (err) {
      setError('Failed to load contracts');
      console.error('Error loading contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContract = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await contractAPI.createContractFromProposal(proposal.id, {
        ...formData,
        milestones: formData.milestones ? JSON.parse(formData.milestones) : [],
        start_date: formData.start_date,
        end_date: formData.end_date || null
      });
      
      setContracts([response.data]);
      setShowCreateForm(false);
      if (onContractCreated) {
        onContractCreated(response.data);
      }
    } catch (err) {
      setError('Failed to create contract');
      console.error('Error creating contract:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignContract = async (contractId, action, reason = '') => {
    try {
      setLoading(true);
      const response = await contractAPI.signContract(contractId, action, reason);
      
      setContracts(contracts.map(contract => 
        contract.id === contractId ? response.data : contract
      ));
    } catch (err) {
      setError('Failed to sign contract');
      console.error('Error signing contract:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      terminated: 'bg-red-100 text-red-800',
      disputed: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!proposal) {
    return null;
  }

  // Only show for accepted proposals and for the client
  if (proposal.status !== 'accepted' || user.id !== proposal.project.client) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Contract</h3>
        {contracts.length === 0 && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Contract
          </button>
        )}
      </div>

      {contracts.length === 0 && !showCreateForm && (
        <p className="text-gray-600">No contract created yet for this proposal.</p>
      )}

      {showCreateForm && (
        <form onSubmit={handleCreateContract} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              rows="3"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Deliverables</label>
            <textarea
              value={formData.deliverables}
              onChange={(e) => setFormData({...formData, deliverables: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              value={formData.payment_method}
              onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly</option>
              <option value="milestone">Milestone Based</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Schedule</label>
            <textarea
              value={formData.payment_schedule}
              onChange={(e) => setFormData({...formData, payment_schedule: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              rows="2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Milestones (JSON format)</label>
            <textarea
              value={formData.milestones}
              onChange={(e) => setFormData({...formData, milestones: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              rows="3"
              placeholder='[{"title": "Milestone 1", "amount": 500, "due_date": "2024-01-15"}]'
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create Contract'}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {contracts.map((contract) => (
        <div key={contract.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">{contract.title}</h4>
              <p className="text-sm text-gray-600">{contract.description}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
              {contract.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
            <div>
              <strong>Amount:</strong> ${contract.agreed_amount}
            </div>
            <div>
              <strong>Start Date:</strong> {contract.start_date}
            </div>
            <div>
              <strong>Payment:</strong> {contract.payment_method}
            </div>
            <div>
              <strong>End Date:</strong> {contract.end_date || 'Not specified'}
            </div>
          </div>

          {contract.status === 'draft' && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleSignContract(contract.id, 'sign')}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Sign Contract
              </button>
              <button
                onClick={() => {
                  const reason = prompt('Please provide a reason for rejection:');
                  if (reason !== null) {
                    handleSignContract(contract.id, 'reject', reason);
                  }
                }}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Reject Contract
              </button>
            </div>
          )}

          {contract.status === 'active' && (
            <div className="text-sm text-green-600">
              ✓ Contract is active and signed by both parties
            </div>
          )}

          {contract.status === 'terminated' && (
            <div className="text-sm text-red-600">
              ✗ Contract has been terminated
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContractManager;