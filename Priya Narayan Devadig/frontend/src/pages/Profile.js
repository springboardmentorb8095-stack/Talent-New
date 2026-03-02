import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [stats, setStats] = useState({
        projects: 0,
        contracts: 0,
        reviews: 0
    });

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/auth/profile/');
            setProfile(response.data);
        } catch (error) {
            setError('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('access_token');

            // Fetch projects based on user type
            let projectsRes;
            if (currentUser?.user_type === 'client') {
                // For clients: fetch their own projects
                projectsRes = await axios.get('http://127.0.0.1:8000/api/projects/?my_projects=true', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } else {
                // For freelancers: fetch their proposals count instead
                projectsRes = await axios.get('http://127.0.0.1:8000/api/proposals/?my_proposals=true', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }

            // Fetch contracts
            const contractsRes = await axios.get('http://127.0.0.1:8000/api/contracts/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Fetch reviews
            const reviewsRes = await axios.get(`http://127.0.0.1:8000/api/reviews/?reviewee=${currentUser?.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setStats({
                projects: projectsRes.data.results?.length || projectsRes.data.length || 0,
                contracts: contractsRes.data.results?.length || contractsRes.data.length || 0,
                reviews: reviewsRes.data.results?.length || reviewsRes.data.length || 0
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const calculateProfileCompletion = () => {
        if (!profile) return 0;

        const fields = [
            profile.bio,
            profile.location,
            profile.phone_number,
            profile.website,
            currentUser?.user_type === 'freelancer' ? profile.hourly_rate : true
        ];

        const filledFields = fields.filter(field => field && field !== '').length;
        return Math.round((filledFields / fields.length) * 100);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await axios.put('http://127.0.0.1:8000/api/auth/profile/', profile);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Failed to update profile');
        }
    };

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const getInitials = () => {
        return '👤'; // User profile icon
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // TODO: Implement avatar upload to backend
            console.log('Avatar file selected:', file);
            setSuccess('Avatar upload feature coming soon!');
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    const completionPercentage = calculateProfileCompletion();

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>My Professional Profile</h1>
                <p className="profile-subtitle">
                    Manage your information and showcase your expertise
                </p>
                {currentUser?.user_type && (
                    <span className="user-type-badge">
                        {currentUser.user_type.charAt(0).toUpperCase() + currentUser.user_type.slice(1)}
                    </span>
                )}

                {/* Stats Section */}
                <div className="profile-stats">
                    <div className="stat-card">
                        <span className="stat-number">{stats.projects}</span>
                        <span className="stat-label">
                            {currentUser?.user_type === 'client' ? 'Projects Posted' : 'Proposals Submitted'}
                        </span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{stats.contracts}</span>
                        <span className="stat-label">Total Contracts</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{stats.reviews}</span>
                        <span className="stat-label">Reviews Received</span>
                    </div>
                </div>
            </div>

            <div className="profile-card">
                {/* Profile Completion */}
                <div className="profile-completion">
                    <div className="completion-header">
                        <span className="completion-label">Profile Completion</span>
                        <span className="completion-percentage">{completionPercentage}%</span>
                    </div>
                    <div className="completion-bar">
                        <div
                            className="completion-fill"
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Avatar Section */}
                <div className="profile-avatar-section">
                    <div className="avatar-container">
                        <div className="avatar-placeholder">
                            {getInitials()}
                        </div>
                        <label htmlFor="avatar-upload" className="avatar-upload-btn" title="Upload avatar">
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="avatar-upload-input"
                        />
                    </div>
                    <div className="avatar-info">
                        <h2>{currentUser?.first_name} {currentUser?.last_name}</h2>
                        <p>{currentUser?.email}</p>
                        <p style={{ color: '#667eea', fontWeight: 600, marginTop: '8px' }}>
                            {currentUser?.user_type === 'freelancer' ? '💼 Freelancer' : '🏢 Client'}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-error">
                        ⚠️ {error}
                    </div>
                )}
                {success && (
                    <div className="alert alert-success">
                        ✓ {success}
                    </div>
                )}

                {/* Profile Information Display */}
                {profile && (
                    <div style={{ marginBottom: '40px' }}>
                        <h3 className="profile-section-title">Profile Information</h3>

                        {profile.bio && (
                            <div style={{
                                background: '#f9fafb',
                                padding: '20px',
                                borderRadius: '12px',
                                marginBottom: '24px',
                                borderLeft: '4px solid #667eea'
                            }}>
                                <p style={{ margin: 0, lineHeight: '1.7', color: '#374151' }}>
                                    {profile.bio}
                                </p>
                            </div>
                        )}

                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">📍 Location</span>
                                <span className={`info-value ${!profile.location ? 'empty' : ''}`}>
                                    {profile.location || 'Not specified'}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">📞 Phone</span>
                                <span className={`info-value ${!profile.phone_number ? 'empty' : ''}`}>
                                    {profile.phone_number || 'Not specified'}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">🌐 Website</span>
                                <span className={`info-value ${!profile.website ? 'empty' : ''}`}>
                                    {profile.website ? (
                                        <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                                            {profile.website}
                                        </a>
                                    ) : 'Not specified'}
                                </span>
                            </div>
                            {currentUser?.user_type === 'freelancer' && (
                                <div className="info-item">
                                    <span className="info-label">💰 Hourly Rate</span>
                                    <span className={`info-value ${!profile.hourly_rate ? 'empty' : ''}`}>
                                        {profile.hourly_rate ? `$${profile.hourly_rate}/hr` : 'Not specified'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Edit Form */}
                <div>
                    <h3 className="profile-section-title">Edit Profile</h3>

                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group form-group-full">
                            <label>Professional Bio</label>
                            <textarea
                                name="bio"
                                value={profile?.bio || ''}
                                onChange={handleChange}
                                placeholder="Tell us about yourself, your skills, and experience..."
                                rows="5"
                            />
                        </div>

                        <div className="form-section">
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={profile?.location || ''}
                                    onChange={handleChange}
                                    placeholder="City, Country"
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={profile?.phone_number || ''}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <div className="form-group">
                                <label>Website / Portfolio</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={profile?.website || ''}
                                    onChange={handleChange}
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>

                            {currentUser?.user_type === 'freelancer' && (
                                <div className="form-group">
                                    <label>Hourly Rate (USD)</label>
                                    <input
                                        type="number"
                                        name="hourly_rate"
                                        value={profile?.hourly_rate || ''}
                                        onChange={handleChange}
                                        step="0.01"
                                        placeholder="50.00"
                                        min="0"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="profile-actions">
                            <button type="submit" className="btn-primary">
                                💾 Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;