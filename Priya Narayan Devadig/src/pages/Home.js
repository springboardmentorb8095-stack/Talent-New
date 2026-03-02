import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
            <div className="container">
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <h1 className="gradient-text" style={{
                        fontSize: '3.5rem',
                        marginBottom: '1rem',
                        fontWeight: '700',
                        background: 'linear-gradient(45deg, #fff, #f0f0f0)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Welcome to Freelance Marketplace
                    </h1>
                    <p style={{
                        fontSize: '1.3rem',
                        marginBottom: '3rem',
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: '300',
                        maxWidth: '600px',
                        margin: '0 auto 3rem'
                    }}>
                        The professional platform connecting talented freelancers with amazing clients worldwide
                    </p>

                    {!user && (
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
                            <Link to="/register" className="btn btn-primary" style={{
                                fontSize: '1.2rem',
                                padding: '15px 40px',
                                borderRadius: '50px'
                            }}>
                                🚀 Get Started
                            </Link>
                            <Link to="/login" className="btn btn-secondary" style={{
                                fontSize: '1.2rem',
                                padding: '15px 40px',
                                borderRadius: '50px'
                            }}>
                                Sign In
                            </Link>
                        </div>
                    )}

                    <div style={{
                        marginTop: '4rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '2rem',
                        maxWidth: '1000px',
                        margin: '4rem auto 0'
                    }}>
                        <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                            <div className="feature-icon">👥</div>
                            <h3 className="gradient-text" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>For Clients</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Find skilled freelancers for your projects. Post jobs, review proposals, and manage contracts securely with our advanced platform.
                            </p>
                        </div>

                        <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                            <div className="feature-icon">💼</div>
                            <h3 className="gradient-text" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>For Freelancers</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Showcase your skills, bid on exciting projects, and build lasting relationships with clients from around the globe.
                            </p>
                        </div>
                    </div>

                    <div style={{
                        marginTop: '4rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem',
                        maxWidth: '1200px',
                        margin: '4rem auto 0'
                    }}>
                        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒</div>
                            <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>Secure Payments</h4>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>Protected transactions with escrow system</p>
                        </div>

                        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⭐</div>
                            <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>Quality Assurance</h4>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>Verified profiles and rating system</p>
                        </div>

                        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💬</div>
                            <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>24/7 Support</h4>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>Round-the-clock customer assistance</p>
                        </div>

                        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌍</div>
                            <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>Global Reach</h4>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>Connect with talent worldwide</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;