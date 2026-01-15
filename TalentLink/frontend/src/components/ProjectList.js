import React, { useState, useEffect } from 'react';
import { projectAPI } from '../api';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MagnifyingGlassIcon, FunnelIcon, CurrencyDollarIcon, ClockIcon, PencilIcon, TrashIcon, XMarkIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

const ProjectList = ({ mode = 'feed' }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    // Client-side filtering
    let results = projects;
    
    if (searchTerm) {
      results = results.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      results = results.filter(p => p.status === statusFilter);
    }

    if (budgetFilter !== 'all') {
      results = results.filter(p => {
        const budget = parseInt(p.budget) || 0;
        switch (budgetFilter) {
          case 'under-500': return budget < 500;
          case '500-1000': return budget >= 500 && budget <= 1000;
          case '1000-5000': return budget >= 1000 && budget <= 5000;
          case 'over-5000': return budget > 5000;
          default: return true;
        }
      });
    }

    if (skillFilter !== 'all') {
      results = results.filter(p => 
        p.skills_required && p.skills_required.some(skill => 
          skill.skill_name.toLowerCase() === skillFilter.toLowerCase()
        )
      );
    }

    if (durationFilter !== 'all') {
      results = results.filter(p => {
        const duration = p.duration ? p.duration.toLowerCase() : '';
        switch (durationFilter) {
          case 'less-1-week': return duration.includes('day') || duration.includes('week') && !duration.includes('month');
          case '1-4-weeks': return duration.includes('week') && !duration.includes('month');
          case '1-3-months': return duration.includes('month') && duration.includes('1') || duration.includes('2') || duration.includes('3');
          case 'over-3-months': return duration.includes('month') && (duration.includes('4') || duration.includes('5') || duration.includes('6') || duration.includes('year'));
          default: return true;
        }
      });
    }

    setFilteredProjects(results);
  }, [searchTerm, statusFilter, budgetFilter, skillFilter, durationFilter, projects]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setBudgetFilter('all');
    setSkillFilter('all');
    setDurationFilter('all');
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let response;
      if (mode === 'my') {
          response = await projectAPI.getMyProjects();
      } else {
          response = await projectAPI.getAll();
      }
      setProjects(response.data);
      setFilteredProjects(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch projects');
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.delete(projectId);
        setProjects(projects.filter(project => project.id !== projectId));
        setFilteredProjects(filteredProjects.filter(project => project.id !== projectId));
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading projects...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
      <div className="text-red-500 mb-3">
        <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load projects</h3>
      <p className="text-red-600 mb-4">{error}</p>
      <button
        onClick={fetchProjects}
        className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Title and Primary Action */}
        <div className="p-6 md:p-8 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {mode === 'my' ? 'My Projects' : 'Project Feed'}
              </h1>
              <p className="text-gray-500 mt-1">
                {mode === 'my' ? 'Manage your posted projects' : 'Discover and apply to exciting projects'}
              </p>
            </div>
            
            {user?.role === 'client' && mode === 'my' && (
              <Link
                to="/post-project"
                className="bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors font-medium flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <span className="mr-2">+</span>
                Post New Project
              </Link>
            )}
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="p-6 md:p-8">
          {/* Search Bar - Full Width */}
          <div className="mb-6">
            <div className="relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects by title or description..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Controls - Organized in Rows */}
          <div className="space-y-4">
            {/* Primary Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FunnelIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Budget Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select 
                  value={budgetFilter}
                  onChange={(e) => setBudgetFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none bg-white"
                >
                  <option value="all">All Budgets</option>
                  <option value="under-500">Under ₹500</option>
                  <option value="500-1000">₹500 - ₹1,000</option>
                  <option value="1000-5000">₹1,000 - ₹5,000</option>
                  <option value="over-5000">Over ₹5,000</option>
                </select>
              </div>

              {/* Duration Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select 
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none bg-white"
                >
                  <option value="all">All Durations</option>
                  <option value="less-1-week">Less than 1 week</option>
                  <option value="1-4-weeks">1-4 weeks</option>
                  <option value="1-3-months">1-3 months</option>
                  <option value="over-3-months">Over 3 months</option>
                </select>
              </div>
            </div>

            {/* Secondary Filters Row */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              {/* Skill Filter */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select 
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none bg-white"
                >
                  <option value="all">All Skills</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="react">React</option>
                  <option value="nodejs">Node.js</option>
                  <option value="django">Django</option>
                  <option value="mongodb">MongoDB</option>
                  <option value="postgresql">PostgreSQL</option>
                  <option value="aws">AWS</option>
                  <option value="docker">Docker</option>
                  <option value="machine-learning">Machine Learning</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || statusFilter !== 'all' || budgetFilter !== 'all' || skillFilter !== 'all' || durationFilter !== 'all') && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
                >
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
            <MagnifyingGlassIcon className="h-full w-full" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search criteria or filters to find more projects.</p>
          {(searchTerm || statusFilter !== 'all' || budgetFilter !== 'all' || skillFilter !== 'all' || durationFilter !== 'all') && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
            >
              <XMarkIcon className="h-4 w-4 mr-2" />
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 overflow-hidden hover:border-brand-200">
              {/* Card Header */}
              <div className="p-6 border-b border-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors mb-2">
                      <Link to={`/projects/${project.id}`} className="hover:no-underline">
                        {project.title}
                      </Link>
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Posted by <span className="font-medium text-gray-700">{project.client}</span>
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${
                    project.status === 'open' ? 'bg-green-100 text-green-800' : 
                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                {/* Project Description */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {project.description}
                </p>
              </div>
              
              {/* Card Body - Project Details */}
              <div className="p-6">
                {/* Key Information Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-green-50 rounded-full flex items-center justify-center">
                      <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Budget</p>
                      <p className="font-semibold text-gray-900">₹{project.budget}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center">
                      <ClockIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                      <p className="font-semibold text-gray-900">{project.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-purple-50 rounded-full flex items-center justify-center">
                      <BriefcaseIcon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Experience</p>
                      <p className="font-semibold text-gray-900">Intermediate</p>
                    </div>
                  </div>
                </div>
                
                {/* Skills Section */}
                {project.skills_required && project.skills_required.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {project.skills_required.slice(0, 4).map(skill => (
                        <span key={skill.id} className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                          {skill.skill_name}
                        </span>
                      ))}
                      {project.skills_required.length > 4 && (
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                          +{project.skills_required.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Card Footer - Action Buttons */}
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Action buttons for project owners */}
                  {user?.role === 'client' && mode === 'my' && (
                    <div className="flex gap-2">
                      <Link
                        to={`/projects/${project.id}/edit`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                  
                  {/* View Details Button - Always visible and prominent */}
                  <Link 
                    to={`/projects/${project.id}`}
                    className="flex-1 inline-flex items-center justify-center px-6 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors group"
                  >
                    View Project Details
                    <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;