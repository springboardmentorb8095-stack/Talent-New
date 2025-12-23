import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ProjectDetail = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [project, setProject] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjectDetails();
        if (currentUser?.user_type === 'client') {
            fetchProposals();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProjectDetails = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/`);
            setProject(response.data);
        } catch (error) {
            console.error('Error fetching project:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProposals = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/proposals/?project=${id}`);
            setProposals(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching proposals:', error);
        }
    };

    const handleAcceptProposal = async (proposalId) => {
        if (!window.confirm('Are you sure you want to accept this proposal?')) return;

        try {
            await axios.post(`http://127.0.0.1:8000/api/proposals/${proposalId}/accept/`);
            alert('Proposal accepted successfully!');
            fetchProjectDetails();
            fetchProposals();
        } catch (error) {
            alert('Error accepting proposal: ' + (error.response?.data?.error || 'Unknown error'));
        }
    };

    const handleRejectProposal = async (proposalId) => {
        if (!window.confirm('Are you sure you want to reject this proposal?')) return;

        try {
            await axios.post(`http://127.0.0.1:8000/api/proposals/${proposalId}/reject/`);
            alert('Proposal rejected');
            fetchProposals();
        } catch (error) {
            alert('Error rejecting proposal');
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!project) return <div className="container">Project not found</div>;

    const isOwner = currentUser?.id === project.client;
    const isFreelancer = currentUser?.user_type === 'freelancer';

    return (
        <div className="container">
            <div style={{ marginBottom: '20px' }}>
                <Link to="/projects" style={{ color: '#007bff', textDecoration: 'none' }}>
                    ← Back to Projects
                </Link>
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                    <h1 style={{ marginTop: 0 }}>{project.title}</h1>
                    <span style={{
                        backgroundColor: project.status === 'open' ? '#28a745' : '#6c757d',
                        color: 'white',
                        padding: '8px 20px',
                        borderRadius: '20px'
                    }}>
                        {project.status}
                    </span>
                </div>

                <div style={{ marginBottom: '20px', color: '#666' }}>
                    <p><strong>Posted by:</strong> {project.client_name}</p>
                    <p><strong>Posted on:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h3>Project Description</h3>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{project.description}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                        <strong>Budget Range</strong>
                        <p style={{ fontSize: '20px', color: '#007bff', margin: '10px 0 0 0' }}>
                            ${project.budget_min} - ${project.budget_max}
                        </p>
                    </div>
                    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                        <strong>Deadline</strong>
                        <p style={{ fontSize: '20px', color: '#007bff', margin: '10px 0 0 0' }}>
                            {new Date(project.deadline).toLocaleDateString()}
                        </p>
                    </div>
                    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                        <strong>Proposals</strong>
                        <p style={{ fontSize: '20px', color: '#007bff', margin: '10px 0 0 0' }}>
                            {project.proposal_count || 0}
                        </p>
                    </div>
                </div>

                {project.required_skills && project.required_skills.length > 0 && (
                    <div style={{ marginBottom: '30px' }}>
                        <h3>Required Skills</h3>
                        <div>
                            {project.required_skills.map(skill => (
                                <span key={skill.id} style={{
                                    display: 'inline-block',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    padding: '8px 15px',
                                    borderRadius: '20px',
                                    marginRight: '10px',
                                    marginBottom: '10px'
                                }}>
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {isFreelancer && project.status === 'open' && (
                    <div style={{ marginTop: '30px' }}>
                        <Link
                            to={`/projects/${project.id}/submit-proposal`}
                            className="btn"
                            style={{ display: 'inline-block', width: 'auto' }}
                        >
                            Submit Proposal
                        </Link>
                    </div>
                )}

                {isOwner && proposals.length > 0 && (
                    <div style={{ marginTop: '40px' }}>
                        <h2>Proposals ({proposals.length})</h2>
                        <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
                            {proposals.map(proposal => (
                                <div key={proposal.id} style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    backgroundColor: '#f8f9fa'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ marginTop: 0 }}>{proposal.freelancer_name}</h4>
                                            <p><strong>Proposed Budget:</strong> ${proposal.proposed_budget}</p>
                                            <p><strong>Estimated Duration:</strong> {proposal.estimated_duration} days</p>
                                            <p><strong>Cover Letter:</strong></p>
                                            <p style={{ whiteSpace: 'pre-wrap' }}>{proposal.cover_letter}</p>
                                            <p style={{ color: '#666', fontSize: '14px' }}>
                                                Submitted: {new Date(proposal.submitted_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <span style={{
                                                backgroundColor:
                                                    proposal.status === 'accepted' ? '#28a745' :
                                                        proposal.status === 'rejected' ? '#dc3545' : '#ffc107',
                                                color: 'white',
                                                padding: '5px 15px',
                                                borderRadius: '20px',
                                                fontSize: '14px'
                                            }}>
                                                {proposal.status}
                                            </span>
                                        </div>
                                    </div>
                                    {proposal.status === 'pending' && (
                                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => handleAcceptProposal(proposal.id)}
                                                style={{
                                                    backgroundColor: '#28a745',
                                                    color: 'white',
                                                    padding: '10px 20px',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleRejectProposal(proposal.id)}
                                                style={{
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    padding: '10px 20px',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetail;