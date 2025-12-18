import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
            <div className="container">
                <div className="card" style={{ padding: '3rem', margin: '2rem 0' }}>
                    <h1 className="gradient-text" style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>
                        Welcome back, {user?.first_name || user?.username}! 👋
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        Ready to {user?.user_type === 'client' ? 'find amazing talent' : 'discover exciting projects'}?
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                                {user?.user_type === 'client' ? '👔' : '💼'}
                            </div>
                            <strong style={{ color: '#333' }}>Account Type:</strong>
                            <p style={{ color: '#667eea', fontWeight: '600', marginTop: '0.5rem' }}>
                                {user?.user_type === 'client' ? 'Client' : 'Freelancer'}
                            </p>
                        </div>
                        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📧</div>
                            <strong style={{ color: '#333' }}>Email:</strong>
                            <p style={{ color: '#667eea', fontWeight: '600', marginTop: '0.5rem' }}>{user?.email}</p>
                        </div>
                        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                            <strong style={{ color: '#333' }}>Member Since:</strong>
                            <p style={{ color: '#667eea', fontWeight: '600', marginTop: '0.5rem' }}>
                                {new Date(user?.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <h3 className="gradient-text" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Quick Actions</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {user?.user_type === 'client' ? (
                                <>
                                    <button className="btn btn-primary" style={{ padding: '1rem', borderRadius: '10px' }}>
                                        📝 Post a Project
                                    </button>
                                    <button className="btn btn-secondary" style={{ padding: '1rem', borderRadius: '10px' }}>
                                        📊 View My Projects
                                    </button>
                                    <button className="btn btn-secondary" style={{ padding: '1rem', borderRadius: '10px' }}>
                                        📋 Manage Contracts
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="btn btn-primary" style={{ padding: '1rem', borderRadius: '10px' }}>
                                        🔍 Browse Projects
                                    </button>
                                    <button className="btn btn-secondary" style={{ padding: '1rem', borderRadius: '10px' }}>
                                        📄 My Proposals
                                    </button>
                                    <button className="btn btn-secondary" style={{ padding: '1rem', borderRadius: '10px' }}>
                                        ⚙️ Update Profile
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="card" style={{
                        marginTop: '2rem',
                        padding: '2rem',
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                        border: '1px solid rgba(102, 126, 234, 0.2)'
                    }}>
                        <h4 className="gradient-text" style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
                            🎯 Next Steps:
                        </h4>
                        <p style={{ margin: 0, color: '#555', lineHeight: '1.6' }}>
                            {user?.user_type === 'client'
                                ? 'Complete your profile and post your first project to start finding talented freelancers from around the world.'
                                : 'Complete your profile, showcase your skills, and start browsing exciting projects that match your expertise.'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;