import React, { useState, useEffect } from 'react';
import { projectAPI } from '../api';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MagnifyingGlassIcon, FunnelIcon, CurrencyDollarIcon, ClockIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const ProjectList = ({ mode = 'feed' }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

    setFilteredProjects(results);
  }, [searchTerm, statusFilter, projects]);

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mx-auto max-w-4xl mt-8">
        <p>{error}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              {mode === 'my' ? 'My Projects' : 'Project Feed'}
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              {user?.role === 'client' && mode === 'my' && (
                <Link
                    to="/post-project"
                    className="bg-brand-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-brand-700 transition-colors text-sm md:text-base font-medium flex items-center justify-center shadow-sm"
                >
                    + Post New Project
                </Link>
              )}
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      type="text"
                      placeholder="Search projects..."
                      className="pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 text-sm md:text-base w-full sm:w-64 md:w-80"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              
              <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FunnelIcon className="h-5 w-5 text-gray-400" />
                   </div>
                   <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-10 pr-8 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 text-sm md:text-base appearance-none bg-white"
                   >
                       <option value="all">All Status</option>
                       <option value="open">Open</option>
                       <option value="in_progress">In Progress</option>
                       <option value="completed">Completed</option>
                   </select>
              </div>
          </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 md:py-24 bg-white rounded-lg border border-gray-200 border-dashed">
            <div className="mx-auto h-12 w-12 md:h-16 md:w-16 text-gray-400">
                <MagnifyingGlassIcon />
            </div>
            <h3 className="mt-2 md:mt-4 text-sm md:text-lg font-medium text-gray-900">No projects found</h3>
            <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 overflow-hidden">
              <div className="p-6 md:p-8">
                  <div className="flex justify-between items-start mb-4 md:mb-6">
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                        <Link to={`/projects/${project.id}`}>
                            {project.title}
                        </Link>
                        </h3>
                        <p className="text-gray-500 text-sm md:text-base mt-1 md:mt-2">
                            Posted by <span className="font-medium text-gray-700">{project.client}</span>
                        </p>
                    </div>
                    <span className={`px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wide ${
                        project.status === 'open' ? 'bg-green-100 text-green-800' : 
                        project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                        {project.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-6 md:mb-8 line-clamp-2 md:line-clamp-3 text-sm md:text-base leading-relaxed">
                      {project.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 md:gap-8 text-sm md:text-base text-gray-500 border-t border-gray-50 pt-4 md:pt-6">
                    <div className="flex items-center gap-2 md:gap-3">
                        <CurrencyDollarIcon className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                        <span className="font-medium text-gray-900">${project.budget}</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <ClockIcon className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                        <span>{project.duration}</span>
                    </div>
                    <div className="flex-grow"></div>
                    
                    {/* Action buttons for project owners */}
                    {user?.role === 'client' && mode === 'my' && (
                      <div className="flex gap-2 md:gap-3">
                        <Link
                          to={`/projects/${project.id}/edit`}
                          className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 text-sm md:text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <PencilIcon className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 border border-red-300 text-sm md:text-base font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <TrashIcon className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                    
                    <Link 
                        to={`/projects/${project.id}`}
                        className="text-brand-600 font-medium hover:text-brand-700 text-sm md:text-base flex items-center gap-1 md:gap-2"
                    >
                        View Details →
                    </Link>
                  </div>
                  
                  {project.skills_required && project.skills_required.length > 0 && (
                      <div className="mt-4 md:mt-6 flex flex-wrap gap-2 md:gap-3">
                        {project.skills_required.map(skill => (
                            <span key={skill.id} className="bg-gray-50 text-gray-600 px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs md:text-sm font-medium border border-gray-200">
                                {skill.skill_name}
                            </span>
                        ))}
                      </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;