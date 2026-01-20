import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
// import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import "./styles/forms.css";
import "./styles/global.css";

import ClientDashboard from "./pages/client/ClientDashboard";
import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import Register from "./pages/Register";
// import PublicRoute from "./routes/PublicRoute";

// Client pages
import MyProjects from "./pages/client/MyProjects";
import CreateProject from "./pages/client/CreateProject";
import ProjectProposals from "./pages/client/ProjectProposals";

// Freelancer pages
import BrowseProjects from "./pages/freelancer/BrowseProjects";
import SubmitProposal from "./pages/freelancer/SubmitProposal";
import MyProposals from "./pages/freelancer/MyProposals";

import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

import ContractList from "./pages/contracts/ContractList";
import ContractDetail from "./pages/contracts/ContractDetail";
import ContractChat from "./pages/contracts/ContractChat";

import MessagesPage from "./pages/messages/MessagePage";

import NotificationsPage from "./pages/NotificationsPage";
import Navbar from "./components/Navbar";

import ContractsPage from "./pages/contracts/ContractsPage";
import ConversationsPage from "./pages/ConversationsPage";


// import ClientDashboard from "./pages/client/ClientDashboard";
// import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";

import ReviewPage from "./pages/ReviewPage";

function Home() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="page-center">
      <h2>Welcome to TalentLink</h2>

      {!isLoggedIn && <Link to="/login">Login</Link>}
      <br />
      {!isLoggedIn && <Link to="/register">Register</Link>}

      {isLoggedIn && (
        <>
          {user.role === "client" && <ClientDashboard />}
          {user.role === "freelancer" && <FreelancerDashboard />}
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* <h1>TalentLink</h1> */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>} />

        <Route
          path="/client/dashboard"
          element={
            <RoleProtectedRoute allowedRole={"client"}>
              <ClientDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/freelancer/dashboard"
          element={
            <RoleProtectedRoute allowedRole={"freelancer"}>
              <FreelancerDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* -------- Client -------- */}
        <Route
          path="/client/projects"
          element={
            <RoleProtectedRoute allowedRole="client">
              <MyProjects />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/client/create-project"
          element={
            <RoleProtectedRoute allowedRole="client">
              <CreateProject />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/client/projects/:projectId/proposals"
          element={
            <RoleProtectedRoute allowedRole="client">
              <ProjectProposals />
            </RoleProtectedRoute>
          }
          />

        {/* -------- Freelancer -------- */}
        <Route
          path="/freelancer/browse"
          element={
            <RoleProtectedRoute allowedRole="freelancer">
              <BrowseProjects />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/freelancer/projects/:projectId/apply"
          element={
            <RoleProtectedRoute allowedRole="freelancer">
              <SubmitProposal />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/freelancer/proposals"
          element={
            <RoleProtectedRoute allowedRole="freelancer">
              <MyProposals />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Contracts */}
        <Route path="/contracts/my-contracts" element={<ContractsPage />} />
        {/* <Route path="/contracts/my-contracts" element={<ContractList />} /> */}
        {/* <Route path="/contracts/:id" element={<ContractDetail />} /> */}
        {/* <Route path="/contracts/:id/chat" element={<ContractChat />} /> */}

        {/* Other routes */}

        {/* <Route path="/messages/:contractId" element={<MessagesPage />} /> */}

        <Route path="/notifications" element={<NotificationsPage />} />

        
        {/* <Route path="/contracts/" element={<ContractsPage />} /> */}

          {/* Full chat */}
  <Route path="/messages/:contractId" element={<MessagesPage />} />

  {/* 2-pane layout */}
  {/* <Route path="/conversations" element={<ConversationsPage />} /> */}

      <Route path="/contracts/:id/review" element={<ReviewPage />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
