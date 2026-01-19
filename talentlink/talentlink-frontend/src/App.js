


import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import theme from "./components/Theme";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectFeed from "./pages/ProjectFeed";
import ProjectDetail from "./pages/ProjectDetail";
import SubmitProposal from "./pages/SubmitProposal";
import NewProject from "./pages/NewProject";
import MessagingPage from "./pages/MessagingPage";
import ContractsPage from "./pages/ContractsPage";
import NotificationsPage from "./pages/NotificationsPage";
import Proposals from "./pages/Proposals";

import MainLayout from "./layouts/MainLayout"; // ✅ IMPORTANT

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Layout Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<ProjectFeed />} />
                <Route path="/projects/new" element={<NewProject />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/projects/:id/apply" element={<SubmitProposal />} />
                <Route path="/messages" element={<MessagingPage />} />
                <Route path="/contracts" element={<ContractsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/proposals" element={<Proposals />} />

              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
