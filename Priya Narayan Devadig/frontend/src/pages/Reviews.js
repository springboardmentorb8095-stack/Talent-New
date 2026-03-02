import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Reviews.css';

const Reviews = () => {
    const { currentUser: user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [userRating, setUserRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('received'); // 'received' or 'given'
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [contracts, setContracts] = useState([]);
    const [newReview, setNewReview] = useState({
        contract: '',
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        if (user) {
            fetchReviews();
            fetchUserRating();
            fetchContracts();
        }
    }, [activeTab, user]);

    const fetchReviews = async () => {
        if (!user) return;

        try {
            const token = localStorage.getItem('access_token');
            const params = activeTab === 'received'
                ? `reviewee=${user.id}`
                : `reviewer=${user.id}`;

            const response = await fetch(`http://127.0.0.1:8000/api/reviews/?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setReviews(data.results || data);
            } else {
                setError('Failed to fetch reviews');
            }
        } catch (err) {
            setError('Error loading reviews');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserRating = async () => {
        if (!user) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/reviews/user-rating/${user.id}/`);
            if (response.ok) {
                const data = await response.json();
                setUserRating(data);
            }
        } catch (err) {
            console.error('Error fetching user rating:', err);
        }
    };

    const fetchContracts = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/contracts/?status=completed', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Filter contracts where user hasn't given a review yet
                const contractsWithoutReview = data.results?.filter(contract => {
                    return !reviews.some(review =>
                        review.contract === contract.id && review.reviewer === user.id
                    );
                }) || [];
                setContracts(contractsWithoutReview);
            }
        } catch (err) {
            console.error('Error fetching contracts:', err);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/reviews/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newReview),
            });

            if (response.ok) {
                setShowReviewForm(false);
                setNewReview({ contract: '', rating: 5, comment: '' });
                fetchReviews();
                fetchContracts();
                alert('Review submitted successfully!');
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Failed to submit review');
            }
        } catch (err) {
            setError('Error submitting review');
        }
    };

    const renderStars = (rating) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    const renderRatingDistribution = () => {
        if (!userRating || !userRating.rating_distribution) return null;

        return (
            <div className="rating-distribution">
                <h4>Rating Distribution</h4>
                {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="rating-bar">
                        <span>{star}⭐</span>
                        <div className="bar">
                            <div
                                className="bar-fill"
                                style={{
                                    width: `${(userRating.rating_distribution[star] / userRating.review_count) * 100}%`
                                }}
                            ></div>
                        </div>
                        <span>{userRating.rating_distribution[star]}</span>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) return <div className="loading">Loading reviews...</div>;
    if (!user) return <div className="loading">Please log in to view reviews.</div>;

    return (
        <div className="reviews-page">
            <div className="reviews-header">
                <h1>Reviews & Ratings</h1>

                {userRating && (
                    <div className="user-rating-summary">
                        <div className="rating-overview">
                            <div className="average-rating">
                                <span className="rating-number">{userRating.average_rating}</span>
                                <div className="stars">{renderStars(Math.round(userRating.average_rating))}</div>
                                <p>{userRating.review_count} reviews</p>
                            </div>
                            {renderRatingDistribution()}
                        </div>
                    </div>
                )}
            </div>

            <div className="reviews-tabs">
                <button
                    className={`tab ${activeTab === 'received' ? 'active' : ''}`}
                    onClick={() => setActiveTab('received')}
                >
                    Reviews Received ({reviews.filter(r => r.reviewee === user.id).length})
                </button>
                <button
                    className={`tab ${activeTab === 'given' ? 'active' : ''}`}
                    onClick={() => setActiveTab('given')}
                >
                    Reviews Given ({reviews.filter(r => r.reviewer === user.id).length})
                </button>
            </div>

            <div className="reviews-actions">
                <button
                    className="btn btn-primary"
                    onClick={() => setShowReviewForm(true)}
                    disabled={contracts.length === 0}
                >
                    Write a Review
                </button>
                {contracts.length === 0 && (
                    <p className="no-contracts">No completed contracts available for review</p>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <div className="no-reviews">
                        <p>No reviews {activeTab === 'received' ? 'received' : 'given'} yet.</p>
                    </div>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <h4>
                                        {activeTab === 'received'
                                            ? review.reviewer_name
                                            : review.reviewee_name}
                                    </h4>
                                    <div className="rating">{renderStars(review.rating)}</div>
                                </div>
                                <div className="review-date">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="project-info">
                                <p><strong>Project:</strong> {review.project_title}</p>
                            </div>

                            <div className="review-comment">
                                <p>"{review.comment}"</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showReviewForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Write a Review</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowReviewForm(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmitReview} className="review-form">
                            <div className="form-group">
                                <label>Contract:</label>
                                <select
                                    value={newReview.contract}
                                    onChange={(e) => setNewReview({ ...newReview, contract: e.target.value })}
                                    required
                                >
                                    <option value="">Select a completed contract</option>
                                    {contracts.map(contract => (
                                        <option key={contract.id} value={contract.id}>
                                            {contract.project_title} - {contract.client_name || contract.freelancer_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Rating:</label>
                                <div className="rating-input">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={`star ${star <= newReview.rating ? 'active' : ''}`}
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                        >
                                            ⭐
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Comment:</label>
                                <textarea
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    placeholder="Share your experience working with this person..."
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={() => setShowReviewForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reviews;