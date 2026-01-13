import React, { useState, useEffect } from 'react';
import { StarIcon, ChartBarIcon, UsersIcon } from '@heroicons/react/24/outline';
import StarRating from './StarRating';
import api from '../api';

const ReviewStats = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(`/reviews/user/${userId}/stats/`);
        setStats(response.data);
      } catch (err) {
        setError('Failed to load review statistics');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchStats();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const { average_rating, total_reviews, rating_distribution } = stats;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Reviews & Ratings</h3>
        <UsersIcon className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="text-3xl font-bold text-gray-900">
            {average_rating.toFixed(1)}
          </div>
          <div className="flex-1">
            <StarRating rating={Math.round(average_rating)} readonly />
            <p className="text-sm text-gray-500 mt-1">
              {total_reviews} {total_reviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = rating_distribution[rating.toString()] || 0;
            const percentage = total_reviews > 0 ? (count / total_reviews) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 w-4">{rating}</span>
                <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>

        {total_reviews > 0 && (
          <div className="flex items-center justify-center pt-2 border-t border-gray-200">
            <ChartBarIcon className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">
              {average_rating >= 4 ? 'Excellent' : average_rating >= 3 ? 'Good' : 'Fair'} rating
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewStats;
