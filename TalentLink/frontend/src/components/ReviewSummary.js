import React from 'react';
import StarRating from './StarRating';

const ReviewSummary = ({ averageRating, totalReviews, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const starSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';

  return (
    <div className="flex items-center space-x-2">
      <StarRating rating={Math.round(averageRating)} readonly size={starSize} />
      <span className={`${sizeClasses[size]} font-medium text-gray-900`}>
        {averageRating.toFixed(1)}
      </span>
      <span className={`${sizeClasses[size]} text-gray-500`}>
        ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  );
};

export default ReviewSummary;