import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SubmitProposal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [formData, setFormData] = useState({
        project: id,
        cover_letter: '',
        proposed_budget: '',
        estimated_duration: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProject();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProject = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/`);
            setProject(response.data);
        } catch (error) {
            console.error('Error fetching project:', error);
        }
    };

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

        try {
            await axios.post('http://127.0.0.1:8000/api/proposals/', formData);
            alert('Proposal submitted successfully!');
            navigate(`/projects/${id}`);
        } catch (error) {
            const errorData = error.response?.data;
            if (typeof errorData === 'object') {
                const errorMessages = Object.entries(errorData)
                    .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                    .join('\n');
                setError(errorMessages);
            } else {
                setError('Error submitting proposal');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!project) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <div style={{ marginBottom: '20px' }}>
                <Link to={`/projects/${id}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                    ← Back to Project
                </Link>
            </div>

            <h1>Submit Proposal</h1>

            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h3 style={{ marginTop: 0 }}>{project.title}</h3>
                <p><strong>Budget Range:</strong> ${project.budget_min} - ${project.budget_max}</p>
                <p><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
            </div>

            <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
                <div className="form-group">
                    <label>Cover Letter *</label>
                    <textarea
                        name="cover_letter"
                        value={formData.cover_letter}
                        onChange={handleChange}
                        required
                        rows="8"
                        placeholder="Explain why you're the best fit for this project..."
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <small style={{ color: '#666' }}>
                        Tip: Highlight your relevant experience and explain your approach to the project
                    </small>
                </div>

                <div className="form-group">
                    <label>Proposed Budget ($) *</label>
                    <input
                        type="number"
                        name="proposed_budget"
                        value={formData.proposed_budget}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="Your bid amount"
                    />
                    <small style={{ color: '#666' }}>
                        Client's budget range: ${project.budget_min} - ${project.budget_max}
                    </small>
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
                        placeholder="Number of days to complete"
                    />
                </div>

                {error && <div className="error" style={{ whiteSpace: 'pre-wrap' }}>{error}</div>}

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Proposal'}
                    </button>
                    <Link
                        to={`/projects/${id}`}
                        style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            display: 'inline-block'
                        }}
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default SubmitProposal;