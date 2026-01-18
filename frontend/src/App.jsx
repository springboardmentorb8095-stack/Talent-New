import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Project pages
import Projects from "./pages/projects/Projects";
import ProjectDetail from "./pages/projects/ProjectDetail";
import CreateProject from "./pages/projects/CreateProject";
import EditProject from "./pages/projects/EditProject";

// Proposal pages
import ProjectProposals from "./pages/proposals/ProjectProposals";

// Review pages
import CreateReview from "./pages/reviews/CreateReview";
import Reviews from "./pages/reviews/Reviews";

// Freelancer pages
import Dashboard from "./pages/dashboard/Dashboard";
import Proposals from "./pages/proposals/Proposals";
import Contracts from "./pages/contracts/Contracts";
import Messages from "./pages/messages/Messages";

// Client pages
import ClientDashboard from "./pages/client/ClientDashboard";

export default function App() {
  return (
    <Routes>
      {/* ---------------- PUBLIC ROUTES ---------------- */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* ---------------- SHARED PROJECT ROUTES ---------------- */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Projects />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProjectDetail />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ---------------- CLIENT PROJECT ROUTES ---------------- */}
      <Route
        path="/projects/create"
        element={
          <ProtectedRoute role="client">
            <DashboardLayout>
              <CreateProject />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:id/edit"
        element={
          <ProtectedRoute role="client">
            <DashboardLayout>
              <EditProject />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:id/proposals"
        element={
          <ProtectedRoute role="client">
            <DashboardLayout>
              <ProjectProposals />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ---------------- REVIEW CREATE (CLIENT ONLY) ---------------- */}
      <Route
        path="/reviews/create/:contractId"
        element={
          <ProtectedRoute role="client">
            <DashboardLayout>
              <CreateReview />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ---------------- FREELANCER ROUTES ---------------- */}
      <Route
        path="/"
        element={
          <ProtectedRoute role="freelancer">
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/proposals"
        element={
          <ProtectedRoute role="freelancer">
            <DashboardLayout>
              <Proposals />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ---------------- CONTRACTS (CLIENT + FREELANCER) ---------------- */}
      <Route
        path="/contracts"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Contracts />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ---------------- SHARED ROUTES ---------------- */}
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Messages />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reviews"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Reviews />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ---------------- CLIENT DASHBOARD ---------------- */}
      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute role="client">
            <DashboardLayout>
              <ClientDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ---------------- FALLBACK ---------------- */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
