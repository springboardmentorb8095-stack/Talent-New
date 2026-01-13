import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { projectAPI, authAPI } from '../api';
import { useNavigate, useParams } from 'react-router-dom';

const ProjectForm = ({ onClose, onProjectCreated, projectId, isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    duration: '',
    skills_required_ids: []
  });
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newSkill, setNewSkill] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);

  useEffect(() => {
    fetchSkills();
    if (isEdit && (projectId || id)) {
      fetchProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, projectId, id]);

  const fetchSkills = async () => {
    try {
      const response = await authAPI.getSkills();
      setAvailableSkills(response.data);
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (newSkill.trim()) {
        const skillName = newSkill.trim();
        // Check if skill already exists (case-insensitive)
        const existingSkill = availableSkills.find(s => s.skill_name.toLowerCase() === skillName.toLowerCase());
        
        if (existingSkill) {
            if (!formData.skills_required_ids.includes(existingSkill.id)) {
                handleSkillChange(existingSkill.id);
            }
            setNewSkill('');
        } else {
            // Create new skill
            try {
                const response = await authAPI.createSkill({ skill_name: skillName });
                const createdSkill = response.data;
                
                // Add to available skills
                setAvailableSkills(prev => [...prev, createdSkill]);
                
                // Select the new skill
                handleSkillChange(createdSkill.id);
                setNewSkill('');
            } catch (err) {
                console.error('Failed to create skill:', err);
                alert('Failed to add new skill. It might already exist or you do not have permission.');
            }
        }
    }
  };

  const fetchProject = async () => {
    try {
      const response = await projectAPI.get(projectId || id);
      setFormData({
        title: response.data.title,
        description: response.data.description,
        budget: response.data.budget,
        duration: response.data.duration,
        skills_required_ids: response.data.skills_required ? response.data.skills_required.map(skill => skill.id) : []
      });
    } catch (err) {
      setError('Failed to fetch project details');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSkillChange = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skills_required_ids: prev.skills_required_ids.includes(skillId)
        ? prev.skills_required_ids.filter(id => id !== skillId)
        : [...prev.skills_required_ids, skillId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && (projectId || id)) {
        await projectAPI.update(projectId || id, formData);
        if (onProjectCreated) {
          onProjectCreated();
        }
        navigate(`/projects/${projectId || id}`);
      } else {
        const response = await projectAPI.create(formData);
        if (onProjectCreated) {
          onProjectCreated();
        }
        if (onClose) {
          onClose();
        } else {
            navigate(`/projects/${response.data.id}`);
        }
      }
    } catch (err) {
      console.error("Failed to save project:", err);
      setError(err.response?.data?.detail || "Failed to save project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Project' : 'Post New Project'}
          </h3>
          <button 
            onClick={onClose || (() => navigate(-1))}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Project Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Build a React E-commerce Website"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project requirements in detail..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                Budget ($)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="budget"
                  id="budget"
                  required
                  min="0"
                  step="0.01"
                  className="block w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                id="duration"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 2 weeks, 1 month"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills Required
            </label>
            
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill (e.g. Python)"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill(e);
                        }
                    }}
                />
                <button
                    type="button"
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim()}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    Add
                </button>
            </div>

            {availableSkills.length === 0 ? (
                <div className="text-sm text-gray-500 italic mb-2">
                    No skills available to select. Please contact admin to add skills.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                {availableSkills.map((skill) => (
                    <label key={skill.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                        type="checkbox"
                        checked={formData.skills_required_ids.includes(skill.id)}
                        onChange={() => handleSkillChange(skill.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">{skill.skill_name}</span>
                    </label>
                ))}
                </div>
            )}
            {formData.skills_required_ids.length > 0 && (
              <p className="mt-1 text-sm text-gray-600">
                Selected: {formData.skills_required_ids.length} skill{formData.skills_required_ids.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose || (() => navigate(-1))}
              className="mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (isEdit ? 'Updating...' : 'Posting...') : (isEdit ? 'Update Project' : 'Post Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;