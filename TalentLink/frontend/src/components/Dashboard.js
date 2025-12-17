import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
      <div className="dashboard-content">
        <h2>Welcome, {user?.first_name || user?.username}!</h2>
        <p>Role: {user?.role}</p>
        <p>Email: {user?.email}</p>
      </div>
    </div>
  );
};

export default Dashboard;