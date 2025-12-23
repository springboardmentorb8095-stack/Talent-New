import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProfile();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await axios.put('http://127.0.0.1:8000/api/auth/profile/', profile);
            setSuccess('Profile updated successfully!');
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

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <h1>Profile</h1>
            <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '600px' }}>
                <div className="form-group">
                    <label>Bio:</label>
                    <textarea
                        name="bio"
                        value={profile?.bio || ''}
                        onChange={handleChange}
                        rows="4"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div className="form-group">
                    <label>Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={profile?.location || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={profile?.phone_number || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Website:</label>
                    <input
                        type="url"
                        name="website"
                        value={profile?.website || ''}
                        onChange={handleChange}
                    />
                </div>

                {currentUser?.user_type === 'freelancer' && (
                    <div className="form-group">
                        <label>Hourly Rate ($):</label>
                        <input
                            type="number"
                            name="hourly_rate"
                            value={profile?.hourly_rate || ''}
                            onChange={handleChange}
                            step="0.01"
                        />
                    </div>
                )}

                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}

                <button type="submit" className="btn">
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default Profile;