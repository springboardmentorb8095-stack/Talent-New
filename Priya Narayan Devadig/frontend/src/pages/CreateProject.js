import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateProject = () => {
    const navigate = useNavigate();
    const [skills, setSkills] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget_min: '',
        budget_max: '',
        deadline: '',
        estimated_duration: '',
        required_skills: []
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/auth/skills/');
            setSkills(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSkillToggle = (skillId) => {
        setFormData(prev => ({
            ...prev,
            required_skills: prev.required_skills.includes(skillId)
                ? prev.required_skills.filter(id => id !== skillId)
                : [...prev.required_skills, skillId]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/projects/', formData);
            alert('Project created successfully!');
            navigate(`/projects/${response.data.id}`);
        } catch (error) {
            setError(error.response?.data?.detail || 'Error creating project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Post a New Project</h1>

            <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="form-group">
                    <label>Project Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Build a responsive website"
                    />
                </div>

                <div className="form-group">
                    <label>Project Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="6"
                        placeholder="Describe your project in detail..."
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                        <label>Minimum Budget ($) *</label>
                        <input
                            type="number"
                            name="budget_min"
                            value={formData.budget_min}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="form-group">
                        <label>Maximum Budget ($) *</label>
                        <input
                            type="number"
                            name="budget_max"
                            value={formData.budget_max}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                        <label>Deadline *</label>
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="form-group">
                        <label>Estimated Duration (days) *</label>
                        <input
                            type="number"
                            name="estimated_duration"
                            value={formData.estimated_duration}
                            onChange={handleChange}
                            required
                            min="1"
                            placeholder="e.g., 30"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Required Skills</label>
                    <div style={{
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '15px',
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }}>
                        {skills.map(skill => (
                            <label key={skill.id} style={{
                                display: 'block',
                                marginBottom: '10px',
                                cursor: 'pointer'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={formData.required_skills.includes(skill.id)}
                                    onChange={() => handleSkillToggle(skill.id)}
                                    style={{ marginRight: '10px' }}
                                />
                                {skill.name} <span style={{ color: '#666', fontSize: '14px' }}>({skill.category})</span>
                            </label>
                        ))}
                    </div>
                </div>

                {error && <div className="error">{error}</div>}

                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'Creating Project...' : 'Post Project'}
                </button>
            </form>
        </div>
    );
};

export default CreateProject;