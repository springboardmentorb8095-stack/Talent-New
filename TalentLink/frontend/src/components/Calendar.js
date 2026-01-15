import React, { useState, useEffect } from 'react';
import { contractAPI } from '../services/contractService';
import { CalendarIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const Calendar = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await contractAPI.getContracts();
      // Filter for active or draft contracts with an end date
      const activeContracts = response.data.filter(
        c => (c.status === 'active' || c.status === 'draft') && c.end_date
      );
      
      activeContracts.sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
      
      setContracts(activeContracts);
    } catch (err) {
      setError('Failed to load contract deadlines');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (days) => {
    if (days < 0) return 'bg-red-50 border-red-200 text-red-700';
    if (days <= 3) return 'bg-orange-50 border-orange-200 text-orange-700';
    if (days <= 7) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    return 'bg-white border-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {user?.role === 'freelancer' ? 'Freelancer Calendar & Deadlines' : 'Calendar & Deadlines'}
        </h1>
        <p className="text-gray-500 mt-2">
          {user?.role === 'freelancer' 
            ? 'Track your contract deadlines, progress, and payments' 
            : 'Track your contract deadlines and remaining time'
          }
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {contracts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {user?.role === 'freelancer' ? 'No Active Contracts' : 'No Upcoming Deadlines'}
          </h3>
          <p className="text-gray-500">
            {user?.role === 'freelancer' 
              ? "You don't have any active contracts with deadlines. Start bidding on projects to get contracts." 
              : "You don't have any active contracts with deadlines."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => {
            const daysLeft = getDaysRemaining(contract.end_date);
            const isOverdue = daysLeft < 0;
            
            return (
              <div 
                key={contract.id} 
                className={`p-6 rounded-xl border shadow-sm transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${getUrgencyColor(daysLeft)}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{contract.title}</h3>
                    {isOverdue && (
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase">
                        Overdue
                      </span>
                    )}
                  </div>
                  <p className="text-sm opacity-80 mb-1">Project: {contract.project_title || 'Untitled Project'}</p>
                  <div className="flex items-center gap-4 text-sm mt-2">
                    <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Deadline: {new Date(contract.end_date).toLocaleDateString()}</span>
                    </div>
                    {contract.client_name && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Client: {contract.client_name}</span>
                      </div>
                    )}
                    {contract.agreed_amount && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-green-600">
                          ₹{parseFloat(contract.agreed_amount).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {contract.progress !== null && contract.progress !== undefined && (
                      <div className="flex items-center gap-1">
                        <span className="text-blue-600 font-medium">
                          Progress: {contract.progress}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 border-l pl-0 md:pl-6 border-gray-200/50">
                  <div className="text-center min-w-[100px]">
                    <div className={`text-2xl font-bold ${isOverdue ? 'text-red-600' : 'text-blue-600'}`}>
                      {Math.abs(daysLeft)}
                    </div>
                    <div className="text-xs uppercase tracking-wide font-medium opacity-60">
                      {isOverdue ? 'Days Overdue' : 'Days Left'}
                    </div>
                  </div>
                  <ClockIcon className={`h-8 w-8 opacity-20 ${isOverdue ? 'text-red-500' : 'text-blue-500'}`} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Calendar;
