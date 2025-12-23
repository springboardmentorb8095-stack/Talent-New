import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ProjectFeed = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        min_budget: '',
        max_budget: '',
        min_duration: '',
        max_duration: '',
        status: 'open'
    });
    const { currentUser } = useAuth();

    useEffect(() => {
        fetchProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const fetchProjects = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.min_budget) params.append('min_budget', filters.min_budget);
            if (filters.max_budget) params.append('max_budget', filters.max_budget);
            if (filters.min_duration) params.append('min_duration', filters.min_duration);
            if (filters.max_duration) params.append('max_duration', filters.max_duration);
            if (filters.status) params.append('status', filters.status);

            const response = await axios.get(`http://127.0.0.1:8000/api/projects/?${params}`);
            setProjects(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    if (loading) return <div className="container">Loading projects...</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Available Projects</h1>
                {currentUser?.user_type === 'client' && (
                    <Link to="/projects/create" className="btn" style={{ width: 'auto' }}>
                        Post New Project
                    </Link>
                )}
            </div>

            {/* Filters */}
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                    <div>
                        <input
                            type="text"
                            name="search"
                            placeholder="Search projects..."
                            value={filters.search}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            name="min_budget"
                            placeholder="Min Budget ($)"
                            value={filters.min_budget}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            name="max_budget"
                            placeholder="Max Budget ($)"
                            value={filters.max_budget}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            name="min_duration"
                            placeholder="Min Duration (days)"
                            value={filters.min_duration}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            name="max_duration"
                            placeholder="Max Duration (days)"
                            value={filters.max_duration}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                </div>
            </div>

            {/* Project List */}
            <div style={{ display: 'grid', gap: '20px' }}>
                {projects.length === 0 ? (
                    <p>No projects found. Try adjusting your filters.</p>
                ) : (
                    projects.map(project => (
                        <div key={project.id} style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '20px',
                            backgroundColor: 'white'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ marginTop: 0 }}>
                                        <Link to={`/projects/${project.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                                            {project.title}
                                        </Link>
                                    </h3>
                                    <p style={{ color: '#666', marginBottom: '10px' }}>
                                        Posted by: {project.client_name}
                                    </p>
                                    <p>{project.description.substring(0, 200)}...</p>

                                    <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                                        <div>
                                            <strong>Budget:</strong> ${project.budget_min} - ${project.budget_max}
                                        </div>
                                        <div>
                                            <strong>Duration:</strong> {project.estimated_duration} days
                                        </div>
                                        <div>
                                            <strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}
                                        </div>
                                        <div>
                                            <strong>Proposals:</strong> {project.proposal_count || 0}
                                        </div>
                                    </div>

                                    {project.required_skills && project.required_skills.length > 0 && (
                                        <div style={{ marginTop: '15px' }}>
                                            {project.required_skills.map(skill => (
                                                <span key={skill.id} style={{
                                                    display: 'inline-block',
                                                    backgroundColor: '#e9ecef',
                                                    padding: '5px 10px',
                                                    borderRadius: '4px',
                                                    marginRight: '5px',
                                                    fontSize: '14px'
                                                }}>
                                                    {skill.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <span style={{
                                        backgroundColor: project.status === 'open' ? '#28a745' : '#6c757d',
                                        color: 'white',
                                        padding: '5px 15px',
                                        borderRadius: '20px',
                                        fontSize: '14px'
                                    }}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProjectFeed;