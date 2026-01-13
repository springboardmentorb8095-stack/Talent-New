import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import ProjectForm from './components/ProjectForm';
import NotificationPage from './components/NotificationPage';
import Proposals from './components/Proposals';
import Contracts from './components/Contracts';
import Chats from './components/Chats';
import Calendar from './components/Calendar';
import Clients from './components/Clients';
import Settings from './components/Settings';
import FreelancerProfile from './components/FreelancerProfile';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

import FreelancerCandidates from './components/FreelancerCandidates';
import ReviewsPage from './components/ReviewsPage';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <DarkModeProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes with Layout (Navbar) */}
              <Route element={<Layout />}>
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/projects" element={<ProtectedRoute><ProjectList mode="feed" /></ProtectedRoute>} />
                  <Route path="/my-projects" element={<ProtectedRoute><ProjectList mode="my" /></ProtectedRoute>} />
                  <Route path="/freelancers" element={<ProtectedRoute><FreelancerCandidates /></ProtectedRoute>} />
                  <Route path="/post-project" element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
                  <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
                  <Route path="/projects/:id/edit" element={<ProtectedRoute><ProjectForm isEdit={true} /></ProtectedRoute>} />
                  <Route path="/proposals" element={<ProtectedRoute><Proposals /></ProtectedRoute>} />
                  <Route path="/contracts" element={<ProtectedRoute><Contracts /></ProtectedRoute>} />
                  <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
                  <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                  <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/profile/:username" element={<ProtectedRoute><FreelancerProfile /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
                  <Route path="/reviews" element={<ProtectedRoute><ReviewsPage /></ProtectedRoute>} />
              </Route>
            </Routes>
          </Router>
        </DarkModeProvider>
      </AuthProvider>
    </div>
  );
}

export default App;