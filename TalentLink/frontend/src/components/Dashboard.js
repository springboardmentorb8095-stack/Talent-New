import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectAPI } from '../api';
import { Link } from 'react-router-dom';
import { 
  BanknotesIcon, 
  CheckCircleIcon, 
  TruckIcon, 
  ClockIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('Daily');
  const [latestClients, setLatestClients] = useState([]);

  useEffect(() => {
    fetchLatestClients();
  }, []);

  const fetchLatestClients = async () => {
    try {
      const response = await projectAPI.getAll();
      const projects = response.data;
      
      const clientMap = new Map();
      
      projects.forEach(project => {
        const clientName = project.client; 
        
        // We only want the most recent project for each client to determine "latest"
        // But for simplicity, we just gather them all and then pick top ones
        
        if (!clientMap.has(clientName)) {
          clientMap.set(clientName, {
            name: clientName,
            project: project.title, // Just show one project
            status: project.status === 'open' ? 'Active' : 'Inactive',
            statusBg: project.status === 'open' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600',
            avatarColor: stringToColor(clientName),
            id: project.id // link to a project
          });
        }
      });
      
      // Take first 3 clients
      setLatestClients(Array.from(clientMap.values()).slice(0, 3));
    } catch (err) {
      console.error('Failed to fetch clients', err);
    }
  };

  const stringToColor = (str) => {
    const colors = [
      'bg-red-100 text-red-600',
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-yellow-100 text-yellow-600',
      'bg-purple-100 text-purple-600',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Mock Data for Charts
  const data = [
    { name: 'Sep 1', value: 30 },
    { name: 'Sep 3', value: 45 },
    { name: 'Sep 5', value: 35 },
    { name: 'Sep 7', value: 50 },
    { name: 'Sep 9', value: 40 },
    { name: 'Sep 11', value: 42 },
    { name: 'Sep 13', value: 45 },
  ];

  // Mock Data for Stats
  const stats = [
    { 
      title: 'This Month Revenue', 
      value: '₹13,596', 
      change: '+1.2%', 
      isPositive: true,
      icon: BanknotesIcon,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    { 
      title: 'Project Accepted', 
      value: '+16', 
      change: '-2.4%', 
      isPositive: false,
      icon: CheckCircleIcon,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    { 
      title: 'Delivered On Time', 
      value: '92.8%', 
      change: '+1.2%', 
      isPositive: true,
      icon: TruckIcon,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    { 
      title: 'Responsed On Time', 
      value: '1h 00m', 
      change: '-0.8%', 
      isPositive: false,
      icon: ClockIcon,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
  ];

  const activeProjects = [
    { name: 'Creative Corner', subtitle: '1 Member | 2 Tasks', color: 'bg-green-500', days: '8 Days' },
    { name: 'Masendro Illustration', subtitle: '3 Members | 14 Tasks', color: 'bg-blue-500', days: '8 Days' },
    { name: 'Space Template', subtitle: '2 Members | 24 Tasks', color: 'bg-indigo-500', days: '8 Days' },
    { name: 'Milana Illustration', subtitle: '3 Members | 14 Tasks', color: 'bg-yellow-500', days: '8 Days' },
  ];

  const transactions = [
    { id: '#INV-001', client: 'Stark Tech', date: 'Nov 28, 2025', amount: '₹1,200', status: 'Paid', statusColor: 'text-green-600 bg-green-50' },
    { id: '#INV-002', client: 'Global Mart', date: 'Nov 25, 2025', amount: '₹850', status: 'Pending', statusColor: 'text-yellow-600 bg-yellow-50' },
    { id: '#INV-003', client: 'Nova Labs', date: 'Nov 22, 2025', amount: '₹2,300', status: 'Paid', statusColor: 'text-green-600 bg-green-50' },
    { id: '#INV-004', client: 'Acme Corp', date: 'Nov 20, 2025', amount: '₹450', status: 'Failed', statusColor: 'text-red-600 bg-red-50' },
  ];



  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Hi {user?.first_name || user?.username || 'User'}</h1>
        <p className="text-gray-500 md:text-lg">This is your Freelance Team dashboard overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-2 md:p-3 rounded-full ${stat.iconBg}`}>
                  <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</span>
                  <span className={`text-xs md:text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.isPositive ? '↑' : '↓'} {stat.change}
                  </span>
                </div>
                <p className="text-sm md:text-base text-gray-500">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Progress Chart */}
        <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h3 className="font-bold text-gray-900 text-lg md:text-xl">Task Progress</h3>
            <div className="flex bg-gray-100 rounded-lg p-1 text-xs md:text-sm">
              {['Daily', 'Weekly', 'Monthly'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    timeRange === range ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                />
                <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Projects */}
        <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Active Projects</h2>
            <button className="text-sm md:text-base text-blue-600 hover:text-blue-700 font-medium">See All</button>
          </div>
          <div className="space-y-6 md:space-y-8 relative">
             {/* Vertical Line */}
             <div className="absolute left-2.5 md:left-3 top-2 bottom-2 w-0.5 bg-gray-100 -z-10"></div>
             
            {activeProjects.map((project, index) => (
              <div key={index} className="flex items-start gap-4 md:gap-5">
                <div className={`mt-1.5 md:mt-2 h-5 w-5 md:h-6 md:w-6 rounded-full border-4 border-white shadow-sm shrink-0 ${project.color}`}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm md:text-base font-bold text-gray-900 truncate">{project.name}</h4>
                      <p className="text-xs md:text-sm text-gray-500 truncate">{project.subtitle}</p>
                    </div>
                    <span className="text-xs md:text-sm text-gray-400 whitespace-nowrap flex items-center gap-1">
                        <ClockIcon className="h-3 w-3 md:h-4 md:w-4" />
                        {project.days}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h3 className="font-bold text-gray-900 text-lg md:text-xl">Recent Transactions</h3>
            <button className="text-sm md:text-base text-gray-500 hover:text-gray-700">Export</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <th className="pb-3 md:pb-4">Invoice ID</th>
                  <th className="pb-3 md:pb-4">Client</th>
                  <th className="pb-3 md:pb-4">Amount</th>
                  <th className="pb-3 md:pb-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx, index) => (
                  <tr key={index}>
                    <td className="py-3 md:py-4 text-sm md:text-base font-medium text-gray-900">{tx.id}</td>
                    <td className="py-3 md:py-4">
                        <div className="text-sm md:text-base text-gray-900">{tx.client}</div>
                        <div className="text-xs md:text-sm text-gray-500">{tx.date}</div>
                    </td>
                    <td className="py-3 md:py-4 text-sm md:text-base text-gray-900">{tx.amount}</td>
                    <td className="py-3 md:py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium ${tx.statusColor}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Section - Latest Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <h3 className="font-bold text-gray-900 text-lg md:text-xl">Latest Clients</h3>
                <button className="text-gray-400 hover:text-gray-600">
                    <EllipsisHorizontalIcon className="h-6 w-6 md:h-7 md:w-7" />
                </button>
            </div>
            <div className="space-y-4 md:space-y-6">
                {latestClients.length === 0 ? (
                    <p className="text-gray-500 text-sm md:text-base">No recent clients found.</p>
                ) : (
                    latestClients.map((client, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base ${client.avatarColor}`}>
                                    {client.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-sm md:text-base font-bold text-gray-900">{client.name}</h4>
                                    <p className="text-xs md:text-sm text-gray-500 truncate w-32 md:w-40">{client.project}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                 <span className={`px-2 py-1 md:px-3 md:py-1.5 rounded text-xs md:text-sm font-medium ${client.statusBg}`}>
                                    {client.status}
                                 </span>

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
