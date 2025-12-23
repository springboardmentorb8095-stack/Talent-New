import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { currentUser } = useAuth();

    return (
        <div className="container">
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <h1>Welcome to Freelance Marketplace</h1>
                <p style={{ fontSize: '18px', marginBottom: '30px' }}>
                    Connect with talented freelancers or find your next project
                </p>

                {!currentUser ? (
                    <div>
                        <Link to="/register" className="btn" style={{ marginRight: '10px', display: 'inline-block', width: 'auto' }}>
                            Get Started
                        </Link>
                        <Link to="/login" className="btn" style={{ backgroundColor: '#6c757d', display: 'inline-block', width: 'auto' }}>
                            Login
                        </Link>
                    </div>
                ) : (
                    <div>
                        <h2>Welcome back, {currentUser.first_name}!</h2>
                        <p>You are logged in as a {currentUser.user_type}</p>
                        <Link to="/dashboard" className="btn" style={{ display: 'inline-block', width: 'auto' }}>
                            Go to Dashboard
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;