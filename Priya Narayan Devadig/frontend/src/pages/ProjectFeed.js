import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './ProjectFeed.css';

const ProjectFeed = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [skills, setSkills] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        min_budget: '',
        max_budget: '',
        min_duration: '',
        max_duration: '',
        skills: '',
        status: 'open'
    });
    const { currentUser } = useAuth();

    useEffect(() => {
        fetchSkills();
    }, []);

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            fetchProjects();
        }, 500);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const fetchSkills = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/auth/skills/');
            setSkills(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.min_budget) params.append('min_budget', filters.min_budget);
            if (filters.max_budget) params.append('max_budget', filters.max_budget);
            if (filters.min_duration) params.append('min_duration', filters.min_duration);
            if (filters.max_duration) params.append('max_duration', filters.max_duration);
            if (filters.skills) params.append('skills', filters.skills);
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

    const clearFilters = () => {
        setFilters({
            search: '',
            min_budget: '',
            max_budget: '',
            min_duration: '',
            max_duration: '',
            skills: '',
            status: 'open'
        });
    };

    return (
        <div className="project-feed-container">
            <div className="feed-header">
                <h1>Available Projects</h1>
                {currentUser?.user_type === 'client' && (
                    <Link to="/projects/create" className="btn btn-primary">
                        ➕ Post Project
                    </Link>
                )}
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="filters-grid">
                    <div className="filter-item">
                        <label>🔍 Search</label>
                        <input
                            type="text"
                            name="search"
                            placeholder="Search projects..."
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="filter-item">
                        <label>💰 Budget ($)</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="number"
                                name="min_budget"
                                placeholder="Min"
                                value={filters.min_budget}
                                onChange={handleFilterChange}
                                min="0"
                                style={{ flex: 1 }}
                            />
                            <span style={{ alignSelf: 'center', color: '#6b7280' }}>-</span>
                            <input
                                type="number"
                                name="max_budget"
                                placeholder="Max"
                                value={filters.max_budget}
                                onChange={handleFilterChange}
                                min="0"
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>

                    <div className="filter-item">
                        <label>⏱️ Duration (days)</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="number"
                                name="min_duration"
                                placeholder="Min"
                                value={filters.min_duration}
                                onChange={handleFilterChange}
                                min="0"
                                style={{ flex: 1 }}
                            />
                            <span style={{ alignSelf: 'center', color: '#6b7280' }}>-</span>
                            <input
                                type="number"
                                name="max_duration"
                                placeholder="Max"
                                value={filters.max_duration}
                                onChange={handleFilterChange}
                                min="0"
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>

                    <div className="filter-item">
                        <label>🛠️ Skills</label>
                        <select
                            name="skills"
                            value={filters.skills}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Skills</option>
                            {skills.map(skill => (
                                <option key={skill.id} value={skill.id}>
                                    {skill.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button onClick={clearFilters} className="clear-filters-btn">
                    Clear Filters
                </button>
            </div>

            {/* Project List */}
            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading projects...</p>
                </div>
            ) : (
                <div className="projects-list">
                    {projects.length === 0 ? (
                        <div className="no-projects">
                            <p style={{ fontSize: '3rem', margin: '0 0 16px 0' }}>📁</p>
                            <h3>No projects found</h3>
                            <p>Try adjusting your filters or check back later for new opportunities</p>
                        </div>
                    ) : (
                        projects.map(project => (
                            <div key={project.id} className="project-card">
                                <div className="project-header">
                                    <div className="project-title-section">
                                        <h3>
                                            <Link to={`/projects/${project.id}`}>
                                                {project.title}
                                            </Link>
                                        </h3>
                                        <p className="posted-by">Posted by: {project.client_name}</p>
                                    </div>
                                    <span className={`status-badge status-${project.status}`}>
                                        {project.status}
                                    </span>
                                </div>

                                <p className="project-description">
                                    {project.description.substring(0, 250)}
                                    {project.description.length > 250 && '...'}
                                </p>

                                <div className="project-meta">
                                    <div className="meta-item">
                                        <span className="meta-label">💰 Budget</span>
                                        <span className="meta-value">${project.budget_min} - ${project.budget_max}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label">⏱️ Duration</span>
                                        <span className="meta-value">{project.estimated_duration} days</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label">📅 Deadline</span>
                                        <span className="meta-value">{new Date(project.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label">📝 Proposals</span>
                                        <span className="meta-value">{project.proposal_count || 0}</span>
                                    </div>
                                </div>

                                {project.required_skills && project.required_skills.length > 0 && (
                                    <div className="skills-tags">
                                        {project.required_skills.map(skill => (
                                            <span key={skill.id} className="skill-tag">
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectFeed;