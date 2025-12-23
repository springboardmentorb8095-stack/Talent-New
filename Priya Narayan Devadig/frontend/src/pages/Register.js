import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        user_type: 'freelancer',
        password: '',
        password_confirm: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.password_confirm) {
            setError("Passwords don't match");
            setLoading(false);
            return;
        }

        const result = await register(formData);

        if (result.success) {
            navigate('/dashboard');
        } else {
            // Better error handling
            if (typeof result.error === 'object') {
                const errorMessages = Object.entries(result.error)
                    .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                    .join('\n');
                setError(errorMessages);
            } else {
                setError(result.error);
            }
        }

        setLoading(false);
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Register</h2>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>User Type:</label>
                    <select
                        name="user_type"
                        value={formData.user_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="freelancer">Freelancer</option>
                        <option value="client">Client</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="password_confirm"
                        value={formData.password_confirm}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <div className="error" style={{ whiteSpace: 'pre-wrap' }}>{error}</div>}

                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '20px' }}>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;