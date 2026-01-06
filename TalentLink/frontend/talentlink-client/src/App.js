import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ProjectsList from "./pages/ProjectsList";
import ProjectDetail from "./pages/ProjectDetail";
import SubmitProposal from "./pages/SubmitProposal";
import ProjectProposals from "./pages/ProjectProposals";
import "./App.css";
import Header from "./components/Header";
import CreateProject from "./components/CreateProject";

function App() {
  const [page, setPage] = useState("login");
  const [selectedProject, setSelectedProject] = useState(null);

  // ✅ ADD THIS
  const [searchTerm, setSearchTerm] = useState("");

  if (page === "projects") {
    return (
      <>
        <Header
          setPage={setPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <ProjectsList
          setSelectedProject={setSelectedProject}
          setPage={setPage}
          searchTerm={searchTerm}
        />
      </>
    );
  }

  if (page === "project-detail") {
    if (!selectedProject) {
      setPage("projects");
      return null;
    }

    return (
      <>
        <Header
          setPage={setPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <ProjectDetail projectId={selectedProject} setPage={setPage} />
      </>
    );
  }

  if (page === "submit-proposal") {
    if (!selectedProject) {
      setPage("projects");
      return null;
    }

    return (
      <>
        <Header
          setPage={setPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <SubmitProposal projectId={selectedProject} setPage={setPage} />
      </>
    );
  }

  if (page === "project-proposals") {
    if (!selectedProject) {
      setPage("projects");
      return null;
    }

    return (
      <>
        <Header
          setPage={setPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <ProjectProposals projectId={selectedProject} setPage={setPage} />
      </>
    );
  }

  if (page === "create-project") {
    return (
      <>
        <Header
          setPage={setPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <CreateProject setPage={setPage} />
      </>
    );
  }

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

export default App;
