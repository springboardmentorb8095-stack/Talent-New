import { useEffect, useState } from "react";
import { getMyProjects } from "../../api/projects";
import { Link } from "react-router-dom";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProjects()
      .then(res => {
        const data = res.data.results || [];
        setProjects(Array.isArray(data) ? data : []);
        // console.log(data);
      })
      .catch(err => {
        console.error("Failed to load projects", err);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []); 

  if (loading) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page" style={{ maxWidth: "1000px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h2 className="page-title">My Projects</h2>
        <Link 
          to="/client/create-project"
          className="btn-primary"
        >
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"></div>
          <p>No projects yet</p>
          <Link to="/client/create-project" className="btn-primary">
            Post Your First Project
          </Link>
        </div>
      ) : (
        <div>
          {projects.map(p => (
            <div key={p.id} className="list-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <h4 style={{ margin: 0, fontSize: "18px", color: "#111827" }}>{p.title}</h4>
                <span className={`status-badge ${p.is_active ? "active" : "inactive"}`}>
                  {p.is_active ? "Active" : "Closed"}
                </span>
              </div>
              <p style={{ color: "#6b7280", marginBottom: "12px", lineHeight: "1.6" }}>
                {p.description}
              </p>
              <div style={{ display: "flex", gap: "20px", marginBottom: "12px", fontSize: "14px", color: "#4b5563" }}>
                <span>Budget: ${parseFloat(p.budget).toLocaleString()}</span>
                <span>Duration: {p.duration} days</span>
              </div>
              {p.skills_required && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                  {p.skills_required.split(",").slice(0, 4).map((skill, i) => (
                    <span key={i} style={{
                      padding: "4px 10px",
                      background: "#eff6ff",
                      color: "#1e40af",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "500"
                    }}>
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}
              <Link 
                to={`/client/projects/${p.id}/proposals`}
                className="btn-primary"
                style={{ display: "inline-block" }}
              >
                View Proposals
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProjects;
