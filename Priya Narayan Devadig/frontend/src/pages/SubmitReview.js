import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SubmitReview = () => {
    const { contractId } = useParams();
    const navigate = useNavigate();
    const [contract, setContract] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchContract();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractId]);

    const fetchContract = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractId}/`);
            setContract(response.data);
        } catch (error) {
            setError('Contract not found');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await axios.post('http://127.0.0.1:8000/api/reviews/', {
                contract: contractId,
                rating,
                comment
            });

            alert('Review submitted successfully!');
            navigate('/contracts');
        } catch (error) {
            const errorData = error.response?.data;
            if (typeof errorData === 'object') {
                const errorMessages = Object.entries(errorData)
                    .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                    .join('\n');
                setError(errorMessages);
            } else {
                setError('Error submitting review');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!contract) return <div className="container">Contract not found</div>;

    return (
        <div className="container">
            <div style={{ marginBottom: '20px' }}>
                <Link to="/contracts" style={{ color: '#667eea', textDecoration: 'none' }}>
                    ← Back to Contracts
                </Link>
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1>Leave a Review</h1>

                <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '30px'
                }}>
                    <h3 style={{ marginTop: 0 }}>{contract.project_title}</h3>
                    <p><strong>Client:</strong> {contract.client_name}</p>
                    <p><strong>Freelancer:</strong> {contract.freelancer_name}</p>
                    <p><strong>Budget:</strong> ${contract.agreed_budget}</p>
                </div>

                <form onSubmit={handleSubmit} style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0'
                }}>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '15px', fontSize: '18px', fontWeight: '500' }}>
                            Rating *
                        </label>
                        <div style={{ display: 'flex', gap: '10px', fontSize: '40px' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    style={{
                                        cursor: 'pointer',
                                        color: star <= (hoverRating || rating) ? '#f59e0b' : '#e0e0e0',
                                        transition: 'color 0.2s'
                                    }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
                            {rating === 0 && 'Click to rate'}
                            {rating === 1 && '⭐ Poor'}
                            {rating === 2 && '⭐⭐ Fair'}
                            {rating === 3 && '⭐⭐⭐ Good'}
                            {rating === 4 && '⭐⭐⭐⭐ Very Good'}
                            {rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
                        </p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '16px', fontWeight: '500' }}>
                            Comment *
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            rows="6"
                            placeholder="Share your experience working on this project..."
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '16px',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    {error && (
                        <div style={{
                            padding: '12px',
                            backgroundColor: '#fee',
                            color: '#c00',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                flex: 1,
                                padding: '14px',
                                backgroundColor: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '500',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                opacity: submitting ? 0.6 : 1
                            }}
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                        <Link
                            to="/contracts"
                            style={{
                                padding: '14px 24px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '500',
                                display: 'inline-block'
                            }}
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitReview;