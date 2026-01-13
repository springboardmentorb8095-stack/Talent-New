import React, { useState, useEffect } from 'react';
import { contractAPI } from '../services/contractService';
import { useNavigate } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { conversationAPI } from '../services/chatService';
import { useAuth } from '../contexts/AuthContext';
import ContractReviewSection from './ContractReviewSection';

const Contracts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProgress, setEditingProgress] = useState(null);
  const [progressValue, setProgressValue] = useState('');

  useEffect(() => {
    fetchContracts();
  }, [user]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await contractAPI.getContracts();
      setContracts(response.data);
    } catch (err) {
      setError('Failed to load contracts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = async (contractId) => {
    try {
      // Create or get conversation
      await conversationAPI.createConversation(contractId);
      // Navigate to chats with contractId
      navigate('/chats', { state: { contractId } });
    } catch (err) {
      console.error('Failed to start conversation', err);
      // If error is because it exists, we can still navigate (API should return existing or we handle it)
      navigate('/chats', { state: { contractId } });
    }
  };

  const handleProgressEdit = (contractId, currentProgress) => {
    setEditingProgress(contractId);
    setProgressValue(currentProgress || 0);
  };

  const handleProgressUpdate = async (contractId) => {
    try {
      const progress = parseInt(progressValue);
      if (progress < 0 || progress > 100) {
        setError('Progress must be between 0 and 100');
        return;
      }
      
      console.log('Updating progress:', { contractId, progress });
      
      const response = await contractAPI.updateProgress(contractId, progress);
      
      console.log('Update response:', response);
      
      // Update the contract in the local state
      setContracts(contracts.map(contract => 
        contract.id === contractId 
          ? { ...contract, progress: response.data.progress, progress_updated_at: response.data.progress_updated_at }
          : contract
      ));
      
      setEditingProgress(null);
      setProgressValue('');
      setError(null);
    } catch (err) {
      console.error('Update progress error details:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      const errorMessage = err.response?.data?.error || err.response?.data?.detail || 'Failed to update progress';
      setError(errorMessage);
    }
  };

  const handleProgressCancel = () => {
    setEditingProgress(null);
    setProgressValue('');
    setError(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'terminated': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contracts</h1>
          <p className="text-gray-500 mt-2">Manage your active and past contracts</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {contracts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Contracts Found</h3>
          <p className="text-gray-500">You don't have any active contracts yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contracts.map((contract) => (
            <div key={contract.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(contract.status)}`}>
                    {contract.status.toUpperCase()}
                  </span>
                  <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                    <DocumentTextIcon className="h-6 w-6" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{contract.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{contract.description}</p>

                {/* Progress Display - Show for all contracts */}
                {contract.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      {user?.role === 'freelancer' && contract.freelancer === user.id ? (
                        editingProgress === contract.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={progressValue}
                              onChange={(e) => setProgressValue(e.target.value)}
                              className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-500"
                              autoFocus
                            />
                            <button
                              onClick={() => handleProgressUpdate(contract.id)}
                              className="text-green-600 hover:text-green-700 text-xs"
                            >
                              ✓
                            </button>
                            <button
                              onClick={handleProgressCancel}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleProgressEdit(contract.id, contract.progress)}
                            className="flex items-center gap-1 text-brand-600 hover:text-brand-700 text-xs font-medium"
                          >
                            <PencilIcon className="h-3 w-3" />
                            {contract.progress || 0}%
                          </button>
                        )
                      ) : (
                        <span className="text-sm font-semibold text-brand-600">{contract.progress || 0}%</span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${contract.progress || 0}%` }}
                      ></div>
                    </div>
                    {contract.progress_updated_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        Updated {new Date(contract.progress_updated_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">${contract.amount || contract.agreed_amount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span>{new Date(contract.start_date).toLocaleDateString()} - {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'Ongoing'}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-end">
                   <button
                     onClick={() => handleMessage(contract.id)}
                     className="inline-flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors"
                   >
                     <ChatBubbleLeftRightIcon className="h-4 w-4" />
                     Message
                   </button>
                </div>
              </div>

              {/* Review Section for Completed Contracts */}
              {contract.status === 'completed' && (
                <ContractReviewSection contract={contract} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contracts;