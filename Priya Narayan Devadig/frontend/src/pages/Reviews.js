import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Reviews = () => {
    const { currentUser } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [userRating, setUserRating] = useState(null);
    const [filter, setFilter] = useState('received');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
        fetchUserRating();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const fetchReviews = async () => {
        try {
            let url = 'http://127.0.0.1:8000/api/reviews/?my_reviews=true';
            if (filter === 'received') {
                url = `http://127.0.0.1:8000/api/reviews/?reviewee=${currentUser?.id}`;
            } else if (filter === 'given') {
                url = `http://127.0.0.1:8000/api/reviews/?reviewer=${currentUser?.id}`;
            }

            const response = await axios.get(url);
            setReviews(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserRating = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/reviews/user/${currentUser?.id}/rating/`);
            setUserRating(response.data);
        } catch (error) {
            console.error('Error fetching rating:', error);
        }
    };

    const renderStars = (rating) => {
        return (
            <div style={{ display: 'inline-flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                    <span
                        key={star}
                        style={{
                            color: star <= rating ? '#f59e0b' : '#e0e0e0',
                            fontSize: '20px'
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <h1>Reviews & Ratings</h1>

            {/* User Rating Summary */}
            {userRating && filter === 'received' && (
                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                    marginBottom: '30px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ margin: '0 0 20px 0' }}>Your Rating</h2>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
                        {userRating.average_rating || 0}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        {renderStars(Math.round(userRating.average_rating || 0))}
                    </div>
                    <p style={{ color: '#666', margin: 0 }}>
                        Based on {userRating.review_count} {userRating.review_count === 1 ? 'review' : 'reviews'}
                    </p>

                    {/* Rating Distribution */}
                    {userRating.review_count > 0 && (
                        <div style={{ marginTop: '30px', maxWidth: '400px', margin: '30px auto 0' }}>
                            <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>Rating Distribution</h3>
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = userRating.rating_distribution[star.toString()] || 0;
                                const percentage = userRating.review_count > 0
                                    ? (count / userRating.review_count) * 100
                                    : 0;

                                return (
                                    <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                        <span style={{ width: '60px', fontSize: '14px' }}>
                                            {star} ★
                                        </span>
                                        <div style={{
                                            flex: 1,
                                            height: '20px',
                                            backgroundColor: '#f0f0f0',
                                            borderRadius: '10px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${percentage}%`,
                                                height: '100%',
                                                backgroundColor: '#f59e0b',
                                                transition: 'width 0.3s'
                                            }} />
                                        </div>
                                        <span style={{ width: '40px', fontSize: '14px', color: '#666' }}>
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Filter Tabs */}
            <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => setFilter('received')}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: filter === 'received' ? '#667eea' : '#f8f9fa',
                        color: filter === 'received' ? 'white' : '#333',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}
                >
                    Reviews Received
                </button>
                <button
                    onClick={() => setFilter('given')}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: filter === 'given' ? '#667eea' : '#f8f9fa',
                        color: filter === 'given' ? 'white' : '#333',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}
                >
                    Reviews Given
                </button>
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '60px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px'
                }}>
                    <p style={{ fontSize: '48px', margin: '0 0 10px 0' }}>⭐</p>
                    <p style={{ color: '#666' }}>
                        {filter === 'received'
                            ? 'No reviews received yet'
                            : 'No reviews given yet'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {reviews.map(review => (
                        <div
                            key={review.id}
                            style={{
                                backgroundColor: 'white',
                                padding: '25px',
                                borderRadius: '12px',
                                border: '1px solid #e0e0e0'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>
                                        {filter === 'received' ? review.reviewer_name : review.reviewee_name}
                                    </h3>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
                                        Project: {review.project_title}
                                    </p>
                                    {renderStars(review.rating)}
                                </div>
                                <span style={{ fontSize: '14px', color: '#666' }}>
                                    {new Date(review.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            <p style={{
                                margin: 0,
                                padding: '15px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {review.comment}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reviews;