import React, { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import StarRating from './StarRating';
import ReviewModal from './ReviewModal';
import api from '../api';

const ContractReviewSection = ({ contract }) => {
  const [existingReview, setExistingReview] = useState(null);
  const [reviewableContract, setReviewableContract] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contract.status === 'completed') {
      fetchContractReview();
    }
  }, [contract.id, contract.status]);

  const fetchContractReview = async () => {
    try {
      // Check if current user has reviewed this contract
      const response = await api.get(`/reviews/contract/${contract.id}/`);
      if (response.status === 200) {
        const review = response.data;
        setExistingReview(review);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // No review found, check if contract is reviewable
        try {
          const reviewableResponse = await api.get('/reviews/reviewable-contracts/');
          const reviewableContracts = reviewableResponse.data;
          const thisContract = reviewableContracts.find(
            rc => rc.contract_id === contract.id
          );
          if (thisContract && thisContract.can_review) {
            setReviewableContract(thisContract);
          }
        } catch (err) {
          console.error('Failed to fetch reviewable contracts:', err);
        }
      } else {
        console.error('Failed to fetch contract review:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = (newReview) => {
    setExistingReview(newReview);
    setReviewableContract(null);
    setShowReviewModal(false);
  };

  if (contract.status !== 'completed' || loading) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      {existingReview ? (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Your Review</h4>
            <StarRating rating={existingReview.rating} readonly />
          </div>
          {existingReview.comments && (
            <p className="text-gray-700 text-sm">{existingReview.comments}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Reviewed on {new Date(existingReview.review_date).toLocaleDateString()}
          </p>
        </div>
      ) : reviewableContract ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-900">Rate this contract</h4>
                <p className="text-blue-700 text-sm">
                  Share your experience working with {reviewableContract.other_party_name}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Write Review
            </button>
          </div>
        </div>
      ) : null}

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        contract={reviewableContract}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default ContractReviewSection;