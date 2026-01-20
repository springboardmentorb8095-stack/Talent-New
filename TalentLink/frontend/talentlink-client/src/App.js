


import React, { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import ProjectsList from "./pages/ProjectsList";
import ProjectDetail from "./pages/ProjectDetail";
import SubmitProposal from "./pages/SubmitProposal";
import ProjectProposals from "./pages/ProjectProposals";
import Contracts from "./pages/Contracts";

import Chat from "./pages/Chat";
import MyProjects from "./pages/MyProjects";
import MyProposals from "./pages/MyProposals";

import Header from "./components/Header";
import CreateProject from "./components/CreateProject";
import Dashboard from "./pages/Dashboard";
// import FilterCard from "./components/FilterCard";
import Profile from "./pages/Profile";
import EditProposal from "./pages/EditProposal";
import EditProject from "./pages/EditProject";
import OngoingProjects from "./pages/OngoingProjects";






import "./App.css";

function App() {
  const [page, setPage] = useState("login");
  const [selectedProject, setSelectedProject] = useState(null);
  const [chatUserId, setChatUserId] = useState(null);


  // 🔍 Search
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= AUTH ================= */
  if (page === "login" || page === "register" || page === "forgot") {
    return (
      <div className="auth-container">
        <div className="auth-card">
          {page === "login" && <Login setPage={setPage} />}
          {page === "register" && <Register setPage={setPage} />}
          {page === "forgot" && <ForgotPassword setPage={setPage} />}
        </div>
      </div>
    );
  }

  return (
    <>
<Header
  setPage={setPage}
  setSelectedProject={setSelectedProject}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
/>


      {/* ================= PROJECTS LIST ================= */}
      {page === "projects" && (
        <ProjectsList
          setSelectedProject={setSelectedProject}
          setPage={setPage}
          searchTerm={searchTerm}
        />
      )}

      {/* ================= PROJECT DETAIL ================= */}
      {page === "project-detail" && selectedProject && (
        <ProjectDetail
          projectId={selectedProject}
          setPage={setPage}
          setChatUserId={setChatUserId}
        />
      )}


{page === "edit-project" && (
  <EditProject
    projectId={selectedProject}
    setPage={setPage}
  />
)}

      {/* ================= SUBMIT PROPOSAL ================= */}
      {page === "submit-proposal" && selectedProject && (
        <SubmitProposal projectId={selectedProject} setPage={setPage}
        setChatUserId={setChatUserId} />
      )}

      {/* ================= VIEW PROPOSALS ================= */}
      {page === "project-proposals" && selectedProject && (
        <ProjectProposals projectId={selectedProject} setPage={setPage}
        setChatUserId={setChatUserId} />
      )}

      {/* ================= CHAT (WHATSAPP STYLE) ================= */}
      {page === "chat" && <Chat chatUserId={chatUserId} />}


      {/* ================= MY PROJECTS (CLIENT) ================= */}
      {page === "my-projects" && <MyProjects setPage={setPage} />}

      {/* ================= MY PROPOSALS (FREELANCER) ================= */}
      {page === "my-proposals" && <MyProposals setPage={setPage}
      setSelectedProject={setSelectedProject}/>}


      {page === "contracts" && <Contracts setPage={setPage} />}

      {page === "profile" && <Profile />}

      {page === "edit-proposal" && (
  <EditProposal
    projectId={selectedProject}
    setPage={setPage}
  />
)}

{page === "ongoing-projects" && <OngoingProjects />}




      {/* ================= CREATE PROJECT ================= */}
      {page === "create-project" && <CreateProject setPage={setPage} />}


      {page === "dashboard" && (
  <Dashboard
    setPage={setPage}
    setSelectedProject={setSelectedProject}
  />
)}




      
    </>
  );
}

export default App;
