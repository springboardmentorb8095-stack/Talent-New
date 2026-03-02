import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        password_confirm: '',
        user_type: '',
        first_name: '',
        last_name: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const result = await register(formData);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setErrors(result.error);
        }

        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '2rem 0' }}>
            <div className="auth-container">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                        Join Our Community
                    </h2>
                    <p style={{ color: '#666', fontSize: '1rem' }}>Create your Freelance Marketplace account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="user_type">I am a</label>
                        <select
                            id="user_type"
                            name="user_type"
                            value={formData.user_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select your role</option>
                            <option value="client">Client - I want to hire freelancers</option>
                            <option value="freelancer">Freelancer - I want to offer my services</option>
                        </select>
                        {errors.user_type && <div className="error">{errors.user_type}</div>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label htmlFor="first_name">First Name</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                            {errors.first_name && <div className="error">{errors.first_name}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name">Last Name</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                            {errors.last_name && <div className="error">{errors.last_name}</div>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <div className="error">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        {errors.username && <div className="error">{errors.username}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone (Optional)</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        {errors.phone && <div className="error">{errors.phone}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <div className="error">{errors.password}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password_confirm">Confirm Password</label>
                        <input
                            type="password"
                            id="password_confirm"
                            name="password_confirm"
                            value={formData.password_confirm}
                            onChange={handleChange}
                            required
                        />
                        {errors.password_confirm && <div className="error">{errors.password_confirm}</div>}
                    </div>

                    {errors.non_field_errors && (
                        <div className="error" style={{ marginBottom: '1rem' }}>
                            {errors.non_field_errors}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginBottom: '1rem', padding: '12px', borderRadius: '10px' }}
                        disabled={loading}
                    >
                        {loading ? '🔄 Creating Account...' : '🚀 Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center' }}>
                    Already have an account? <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;