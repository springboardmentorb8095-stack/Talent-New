import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({
        projects: 0,
        proposals: 0,
        activeContracts: 0
    });
    const [recentProjects, setRecentProjects] = useState([]);
    const [recentProposals, setRecentProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch contracts for both user types
            const contractsRes = await axios.get('http://127.0.0.1:8000/api/contracts/');
            const contracts = contractsRes.data.results || contractsRes.data;
            const activeContractsCount = contracts.filter(c => c.status === 'active').length;

            if (currentUser?.user_type === 'client') {
                const projectsRes = await axios.get('http://127.0.0.1:8000/api/projects/?my_projects=true');
                const projects = projectsRes.data.results || projectsRes.data;
                setRecentProjects(projects.slice(0, 5));

                const proposalsRes = await axios.get('http://127.0.0.1:8000/api/proposals/');
                const proposals = proposalsRes.data.results || proposalsRes.data;

                setStats({
                    projects: projects.length,
                    proposals: proposals.filter(p => p.status === 'pending').length,
                    activeContracts: activeContractsCount
                });
            } else {
                const proposalsRes = await axios.get('http://127.0.0.1:8000/api/proposals/?my_proposals=true');
                const proposals = proposalsRes.data.results || proposalsRes.data;
                setRecentProposals(proposals.slice(0, 5));

                const projectsRes = await axios.get('http://127.0.0.1:8000/api/projects/?status=open');
                const projects = projectsRes.data.results || projectsRes.data;

                setStats({
                    projects: projects.length,
                    proposals: proposals.length,
                    activeContracts: activeContractsCount
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const isClient = currentUser?.user_type === 'client';

    return (
        <div className="container">
            {/* Welcome Header */}
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '12px',
                marginBottom: '30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb'
            }}>
                <h1 style={{ margin: 0, fontSize: '28px', color: '#111827', fontWeight: '700' }}>
                    Welcome back, {currentUser?.first_name}! 👋
                </h1>
                <p style={{ margin: '10px 0 0 0', fontSize: '16px', color: '#6b7280' }}>
                    {isClient ? 'Manage your projects and find the perfect freelancer' : 'Discover new opportunities and grow your career'}
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
            }}>
                <div style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ margin: 0, color: '#6b7280', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {isClient ? 'My Projects' : 'Available Projects'}
                            </p>
                            <h2 style={{ margin: '12px 0 0 0', fontSize: '36px', color: '#111827', fontWeight: '700' }}>
                                {loading ? '...' : stats.projects}
                            </h2>
                        </div>
                        <div style={{
                            backgroundColor: '#f3f4f6',
                            padding: '14px',
                            borderRadius: '10px',
                            fontSize: '28px'
                        }}>
                            📁
                        </div>
                    </div>
                </div>

                <div style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ margin: 0, color: '#6b7280', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {isClient ? 'Pending Proposals' : 'My Proposals'}
                            </p>
                            <h2 style={{ margin: '12px 0 0 0', fontSize: '36px', color: '#111827', fontWeight: '700' }}>
                                {loading ? '...' : stats.proposals}
                            </h2>
                        </div>
                        <div style={{
                            backgroundColor: '#f3f4f6',
                            padding: '14px',
                            borderRadius: '10px',
                            fontSize: '28px'
                        }}>
                            📝
                        </div>
                    </div>
                </div>

                <div style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ margin: 0, color: '#6b7280', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Active Contracts
                            </p>
                            <h2 style={{ margin: '12px 0 0 0', fontSize: '36px', color: '#111827', fontWeight: '700' }}>
                                {loading ? '...' : stats.activeContracts}
                            </h2>
                        </div>
                        <div style={{
                            backgroundColor: '#f3f4f6',
                            padding: '14px',
                            borderRadius: '10px',
                            fontSize: '28px'
                        }}>
                            ✅
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb',
                marginBottom: '30px'
            }}>
                <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#111827', fontSize: '18px', fontWeight: '700' }}>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    {isClient ? (
                        <>
                            <Link to="/projects/create" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '16px 24px',
                                backgroundColor: '#667eea',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(102, 126, 234, 0.2)'
                            }}>
                                <span style={{ fontSize: '20px' }}>➕</span>
                                Post New Project
                            </Link>
                            <Link to="/projects" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '16px 24px',
                                backgroundColor: '#f3f4f6',
                                color: '#111827',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease',
                                border: '2px solid #e5e7eb'
                            }}>
                                <span style={{ fontSize: '20px' }}>📋</span>
                                View My Projects
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/projects" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '16px 24px',
                                backgroundColor: '#667eea',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(102, 126, 234, 0.2)'
                            }}>
                                <span style={{ fontSize: '20px' }}>🔍</span>
                                Browse Projects
                            </Link>
                            <Link to="/profile" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '16px 24px',
                                backgroundColor: '#f3f4f6',
                                color: '#111827',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease',
                                border: '2px solid #e5e7eb'
                            }}>
                                <span style={{ fontSize: '20px' }}>👤</span>
                                Update Profile
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb'
            }}>
                <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#111827', fontSize: '18px', fontWeight: '700' }}>
                    {isClient ? 'Recent Projects' : 'Recent Proposals'}
                </h2>

                {loading ? (
                    <p style={{ color: '#6b7280' }}>Loading...</p>
                ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {isClient ? (
                            recentProjects.length > 0 ? (
                                recentProjects.map(project => (
                                    <Link
                                        key={project.id}
                                        to={`/projects/${project.id}`}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '20px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            transition: 'all 0.2s ease',
                                            backgroundColor: '#fafafa'
                                        }}
                                    >
                                        <div>
                                            <h4 style={{ margin: '0 0 8px 0', color: '#111827', fontSize: '15px', fontWeight: '600' }}>{project.title}</h4>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                                                ${project.budget_min} - ${project.budget_max} • {project.proposal_count || 0} proposals
                                            </p>
                                        </div>
                                        <span style={{
                                            padding: '6px 14px',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            backgroundColor: '#f3f4f6',
                                            color: '#374151',
                                            border: '1px solid #e5e7eb'
                                        }}>
                                            {project.status}
                                        </span>
                                    </Link>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
                                    <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>📁</p>
                                    <p style={{ fontSize: '16px', marginBottom: '20px', color: '#374151' }}>No projects yet. Start by posting your first project!</p>
                                    <Link to="/projects/create" className="btn" style={{ marginTop: '15px', display: 'inline-block', width: 'auto' }}>
                                        Post a Project
                                    </Link>
                                </div>
                            )
                        ) : (
                            recentProposals.length > 0 ? (
                                recentProposals.map(proposal => (
                                    <Link
                                        key={proposal.id}
                                        to={`/projects/${proposal.project}`}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '20px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            transition: 'all 0.2s ease',
                                            backgroundColor: '#fafafa'
                                        }}
                                    >
                                        <div>
                                            <h4 style={{ margin: '0 0 8px 0', color: '#111827', fontSize: '15px', fontWeight: '600' }}>{proposal.project_title}</h4>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                                                Bid: ${proposal.proposed_budget} • {proposal.estimated_duration} days
                                            </p>
                                        </div>
                                        <span style={{
                                            padding: '6px 14px',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            backgroundColor: '#f3f4f6',
                                            color: '#374151',
                                            border: '1px solid #e5e7eb'
                                        }}>
                                            {proposal.status}
                                        </span>
                                    </Link>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
                                    <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>📝</p>
                                    <p style={{ fontSize: '16px', marginBottom: '20px', color: '#374151' }}>No proposals yet. Browse projects and submit your first proposal!</p>
                                    <Link to="/projects" className="btn" style={{ marginTop: '15px', display: 'inline-block', width: 'auto' }}>
                                        Browse Projects
                                    </Link>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;