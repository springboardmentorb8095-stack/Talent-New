import React, { useState, useEffect } from 'react';
import { projectAPI } from '../api';
import { BriefcaseIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAll();
      const projects = response.data;
      
      const clientMap = new Map();
      
      projects.forEach(project => {
        const clientData = project.client_details || { username: project.client };
        const clientKey = clientData.id || clientData.username;
        
        if (!clientMap.has(clientKey)) {
          clientMap.set(clientKey, {
            id: clientData.id,
            name: clientData.profile?.name || clientData.username || (clientData.first_name + ' ' + clientData.last_name),
            username: clientData.username,
            email: clientData.email,
            bio: clientData.profile?.bio,
            avatar: clientData.profile?.avatar,
            avatarColor: stringToColor(clientData.username || clientData.name || ''),
            projects: []
          });
        }
        
        clientMap.get(clientKey).projects.push(project);
      });
      
      const clientsArray = Array.from(clientMap.values());
      setClients(clientsArray);
      setFilteredClients(clientsArray);
    } catch (err) {
      setError('Failed to load clients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
        
        <div className="mt-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search clients by name, username, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length === 0 && searchTerm.trim() !== '' ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No clients found matching "{searchTerm}"</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          </div>
        ) : (
          filteredClients.map((client, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-gray-50">
              <div className="flex items-center gap-4">
                {client.avatar ? (
                  <img 
                    src={client.avatar} 
                    alt={client.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold ${client.avatarColor}`}>
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-500">{client.projects.length} Projects</p>
                  {client.email && (
                    <p className="text-sm text-gray-400 mt-1">{client.email}</p>
                  )}
                </div>
              </div>
              {client.bio && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{client.bio}</p>
                </div>
              )}
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
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-900 text-sm group-hover:text-blue-600 truncate flex-1 pr-2">
                        {project.title}
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide ${
                        project.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <CurrencyDollarIcon className="h-3 w-3" />
                        <span>₹{project.budget}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        <span>{project.duration}</span>
                      </div>
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
          ))
        )}
      </div>
    </div>
  );
};

export default Clients;
