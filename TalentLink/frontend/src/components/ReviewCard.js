import React from 'react';
import StarRating from './StarRating';

const ReviewCard = ({ review, showContractInfo = false }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {review.reviewer_avatar ? (
            <img
              src={review.reviewer_avatar}
              alt={review.reviewer_name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">
                {review.reviewer_name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h4 className="font-medium text-gray-900">{review.reviewer_name}</h4>
            <p className="text-sm text-gray-500">{formatDate(review.review_date)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} readonly />
      </div>

      {showContractInfo && review.contract_details && (
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Contract:</span> {review.contract_details.title}
          </p>
        </div>
      )}

      {review.comments && (
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700">{review.comments}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;