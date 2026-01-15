import React, { useState, useEffect } from 'react';
import { StarIcon, ChatBubbleLeftRightIcon, ClockIcon } from '@heroicons/react/24/outline';
import ReviewCard from './ReviewCard';
import ReviewModal from './ReviewModal';
import ReviewStats from './ReviewStats';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const ReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewableContracts, setReviewableContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [activeTab, setActiveTab] = useState('received');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
    fetchReviewableContracts();
  }, []);

  useEffect(() => {
    if (user?.role === 'client') {
      setActiveTab('given');
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews/');
      setReviews(response.data);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewableContracts = async () => {
    try {
      const response = await api.get('/reviews/reviewable-contracts/');
      setReviewableContracts(response.data.filter(contract => contract.can_review));
    } catch (err) {
      console.error('Failed to fetch reviewable contracts:', err);
    }
  };

  const handleReviewSubmitted = (newReview) => {
    setReviews([newReview, ...reviews]);
    setReviewableContracts(reviewableContracts.filter(
      contract => contract.contract_id !== selectedContract.contract_id
    ));
  };

  const openReviewModal = (contract) => {
    setSelectedContract(contract);
    setShowReviewModal(true);
  };

  const receivedReviews = reviews.filter((review) => {
    if (!user) return false;
    const contract = review.contract_details;
    if (!contract) return false;
    if (user.role === 'freelancer') {
      return contract.freelancer === user.id;
    }
    if (user.role === 'client') {
      return contract.client === user.id;
    }
    return false;
  });
  
  const givenReviews = reviews.filter(review => 
    review.reviewer === user?.id // Both clients and freelancers see reviews they wrote
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {user?.role === 'freelancer' && <div className="h-32 bg-gray-200 rounded"></div>}
              <div className={user?.role === 'client' ? "lg:col-span-3" : "lg:col-span-2"}>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user?.role === 'client' ? 'Your Reviews' : 'Reviews & Ratings'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'client' 
              ? 'View reviews you\'ve given and rate completed contracts' 
              : 'Manage your reviews and rate your completed contracts'
            }
          </p>
        </div>

        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            {user && user.role === 'freelancer' && <ReviewStats userId={user.id} />}
          </div>

          <div className={user?.role === 'client' ? "lg:col-span-3" : "lg:col-span-2"}>
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {user?.role === 'freelancer' && (
                    <button
                      onClick={() => setActiveTab('received')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'received'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Reviews ({receivedReviews.length})
                    </button>
                  )}
                  {user?.role === 'client' && (
                    <>
                      <button
                        onClick={() => setActiveTab('given')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === 'given'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Given ({givenReviews.length})
                      </button>
                      {reviewableContracts.length > 0 && (
                        <button
                          onClick={() => setActiveTab('pending')}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'pending'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          To Review ({reviewableContracts.length})
                        </button>
                      )}
                    </>
                  )}
                </nav>
              </div>

              <div className="p-6">
                {user?.role === 'freelancer' && activeTab === 'received' && (
                  <div className="space-y-4">
                    {receivedReviews.length > 0 ? (
                      receivedReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} showContractInfo />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <StarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No reviews yet
                        </h3>
                        <p className="text-gray-500">
                          Complete contracts to start receiving reviews from clients.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {user?.role === 'client' && activeTab === 'given' && (
                  <div className="space-y-4">
                    {givenReviews.length > 0 ? (
                      givenReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} showContractInfo />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No reviews given yet
                        </h3>
                        <p className="text-gray-500">
                          Rate your experience with completed contracts to help other clients.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {user?.role === 'client' && activeTab === 'pending' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Contracts to Review
                    </h3>
                    {reviewableContracts.length > 0 ? (
                      reviewableContracts.map((contract) => (
                        <div key={contract.contract_id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {contract.other_party_avatar ? (
                                <img
                                  src={contract.other_party_avatar}
                                  alt={contract.other_party_name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-gray-600 font-medium">
                                    {contract.other_party_name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {contract.other_party_name}
                                </h4>
                                <p className="text-sm text-gray-500">{contract.contract_title}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => openReviewModal(contract)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                            >
                              <StarIcon className="w-4 h-4" />
                              <span>Rate</span>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No contracts to review
                        </h3>
                        <p className="text-gray-500">
                          All your completed contracts have been reviewed.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        contract={selectedContract}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default ReviewsPage;
