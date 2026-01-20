import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/auth";

function MyProjects({ setPage }) {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/projects/my/",
        getAuthHeaders()
      );
      setProjects(res.data);
    } catch {
      setError("Failed to load your projects");
    }
  };

  return (
    <div className="projects-container">
      <div className="project-detail-card">
        <h2 className="project-detail-title">My Projects</h2>

        {error && <p className="error">{error}</p>}

        {projects.length === 0 && !error && (
          <p className="success">You have not created any projects yet.</p>
        )}

        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            style={{ cursor: "pointer" }}
            onClick={() => {
              localStorage.setItem("selectedProject", project.id);
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

        <button
          className="secondary-btn"
          onClick={() => setPage("projects")}
        >
          Back to Projects
        </button>
      </div>
    </div>
  );
}

export default MyProjects;
