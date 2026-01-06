import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/auth";

function ProjectsList({ setSelectedProject, setPage, searchTerm }) {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/projects/",
        getAuthHeaders()
      );
      setProjects(res.data);
    } catch {
      setError("Failed to load projects");
    }
  };

  // ✅ FILTER LOGIC
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="projects-container">
      <div className="welcome-card">
  <h1 className="welcome-title">
  {/* Welcome to TalentLink, {username} */}
   Welcome to TalentLink, {localStorage.getItem("username")} 👋
</h1>
  <p className="welcome-subtitle">
    Find projects that match your skills and start collaborating today.
  </p>
</div>

      <div className="page-content">
        {error && <p className="error">{error}</p>}

        {/* ✅ USE filteredProjects HERE */}
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => {
              setSelectedProject(project.id);
              setPage("project-detail");
            }}
          >
            <h3 className="project-title">{project.title}</h3>
            <p className="project-desc">{project.description}</p>

            {project.budget && (
              <p className="project-budget">
                Budget: {project.budget} {project.currency}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsList;
