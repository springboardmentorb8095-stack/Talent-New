import { useEffect, useState } from "react";
import API from "../services/api";

function ClientProjectsForProposals({ setPage, setSelectedProjectId }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await API.get("projects/");
        setProjects(res.data);
      } catch {
        alert("Failed to load projects");
        setPage("dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [setPage]);

  if (loading) {
    return <div className="loading-screen">Loading projects...</div>;
  }

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <h2>View Proposals</h2>
          <button
            className="secondary-btn"
            onClick={() => setPage("dashboard")}
          >
            ← Back
          </button>
        </header>

        {projects.length === 0 ? (
          <p className="muted">No projects found.</p>
        ) : (
          <div className="projects-grid">
            {projects.map((p) => (
              <div key={p.id} className="project-tile">
                <h4>{p.title}</h4>

                <p className="muted">
                  Status: {p.status}
                </p>

                <button
                  className="primary-btn"
                  onClick={() => {
                    setSelectedProjectId(p.id);
                    setPage("project-proposals");
                  }}
                >
                  View Proposals
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientProjectsForProposals;
