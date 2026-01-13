import React, { useState, useEffect } from 'react';
import { projectAPI } from '../api';
import { UserCircleIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      // Since we don't have a direct users endpoint, we'll derive clients from projects
      // In a real app, this should call /api/users/?role=client or similar
      const response = await projectAPI.getAll();
      const projects = response.data;
      
      const clientMap = new Map();
      
      projects.forEach(project => {
        // Assuming project.client is a name string based on ProjectList.js
        // If project.client_details object existed, we would use that
        const clientName = project.client; 
        
        if (!clientMap.has(clientName)) {
          clientMap.set(clientName, {
            name: clientName,
            // Generate a consistent avatar color/placeholder based on name
            avatarColor: stringToColor(clientName),
            projects: []
          });
        }
        
        clientMap.get(clientName).projects.push(project);
      });
      
      setClients(Array.from(clientMap.values()));
    } catch (err) {
      setError('Failed to load clients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to generate consistent colors
  const stringToColor = (str) => {
    const colors = [
      'bg-red-100 text-red-600',
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-yellow-100 text-yellow-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-indigo-100 text-indigo-600',
      'bg-orange-100 text-orange-600',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <p className="text-gray-500 mt-2">View client profiles and their active projects</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold ${client.avatarColor}`}>
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-500">{client.projects.length} Projects</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50/50">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Recent Projects</h4>
              <div className="space-y-2">
                {client.projects.slice(0, 3).map(project => (
                  <Link 
                    key={project.id} 
                    to={`/projects/${project.id}`}
                    className="block p-3 rounded-lg bg-white border border-gray-100 hover:border-blue-300 transition-colors group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-gray-900 text-sm group-hover:text-blue-600 truncate flex-1 pr-2">
                        {project.title}
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide ${
                        project.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </Link>
                ))}
                {client.projects.length > 3 && (
                   <div className="text-center mt-2">
                      <span className="text-xs text-gray-400">+{client.projects.length - 3} more projects</span>
                   </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;
