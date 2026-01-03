import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import FreelancerProjectFeed from "./pages/FreelancerProjectFeed";

import ProjectFeed from "./pages/ProjectFeed";
import ProjectDetails from "./pages/ProjectDetails";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";

function App() {
  return (
    <>
      <Router>
        <Navbar />

        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/projects" element={<ProjectFeed />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />

          {/* CLIENT DASHBOARD */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute role="client">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
          path="/freelancer/projects"
          element={
          <ProtectedRoute role="freelancer">
            <FreelancerProjectFeed />
          </ProtectedRoute>
          }
/>
          {/* FREELANCER DASHBOARD */}
          <Route
            path="/freelancer/dashboard"
            element={
              <ProtectedRoute role="freelancer">
                <FreelancerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>

      {/* TOAST GLOBAL CONTAINER */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
      />
    </>
  );
}

export default App;


     