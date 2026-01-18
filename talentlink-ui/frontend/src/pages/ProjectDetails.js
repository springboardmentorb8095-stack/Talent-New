import { useEffect, useState } from "react";
import API from "../services/api";

function ProjectDetails({ projectId, setPage, setSelectedProjectId }) {
  const [project, setProject] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const profileRes = await API.get("profile/");
        setRole(profileRes.data.user.role);

        const projectRes = await API.get(`projects/${projectId}/`);
        setProject(projectRes.data);
      } catch {
        alert("Failed to load project details");
        setPage("dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId, setPage]);

  if (loading) {
    return <div className="loading-screen">Loading project details...</div>;
  }

  if (!project || !role) return null;

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        {/* ================= HEADER ================= */}
        <header className="dashboard-topbar">
          <div>
            <h2>Project Details</h2>
            <p className="muted">
              Review full project scope before taking action
            </p>
          </div>

          <button
            className="secondary-btn"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>
        </header>

        {/* ================= MAIN CARD ================= */}
        <div
          className="card fade"
          style={{ maxWidth: "1100px", margin: "auto" }}
        >
          {/* ================= TITLE BAR ================= */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <h1 style={{ fontSize: "2.2rem" }}>{project.title}</h1>

            <span
              className={`status-badge ${project.status.toLowerCase()}`}
              style={{ fontSize: 14 }}
            >
              {project.status}
            </span>
          </div>

          {/* ================= DESCRIPTION ================= */}
          <div style={{ marginBottom: 32 }}>
            <h3>📄 Project Description</h3>
            <p
              className="muted"
              style={{ lineHeight: 1.7, marginTop: 12 }}
            >
              {project.description}
            </p>
          </div>

          {/* ================= META GRID ================= */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
              marginBottom: 32,
            }}
          >
            <div className="stat-box">
              <p className="muted">Budget Range</p>
              <h3>₹{project.budget_min} – ₹{project.budget_max}</h3>
            </div>

            <div className="stat-box">
              <p className="muted">Duration</p>
              <h3>{project.duration || "Not specified"}</h3>
            </div>

            <div className="stat-box">
              <p className="muted">Created On</p>
              <h3>
                {project.created_at
                  ? project.created_at.slice(0, 10)
                  : "—"}
              </h3>
            </div>
          </div>

          {/* ================= SKILLS ================= */}
          <div style={{ marginBottom: 40 }}>
            <h3>🛠 Required Skills</h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 12,
              }}
            >
              {project.required_skills?.length > 0 ? (
                project.required_skills.map((skill) => (
                  <span
                    key={skill.id}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "999px",
                      background:
                        "linear-gradient(135deg, rgba(139,92,246,.25), rgba(6,182,212,.25))",
                      border: "1px solid var(--border-glass)",
                      fontSize: 14,
                    }}
                  >
                    {skill.name}
                  </span>
                ))
              ) : (
                <span className="muted">No specific skills listed</span>
              )}
            </div>
          </div>

          {/* ================= ACTIONS ================= */}
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            {/* ===== FREELANCER ===== */}
            {role === "FREELANCER" && (
              <>
                {project.status === "OPEN" ? (
                  <button
                    className="primary-btn"
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setPage("submit-proposal");
                    }}
                  >
                    📩 Submit Proposal
                  </button>
                ) : (
                  <span className="muted">
                    Proposals are closed for this project
                  </span>
                )}
              </>
            )}

            {/* ===== CLIENT ===== */}
            {role === "CLIENT" && (
              <>
                <button
                  className="secondary-btn"
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setPage("edit-project");
                  }}
                >
                  ✏ Edit Project
                </button>

                <button
                  className="danger"
                  disabled={submitting}
                  onClick={async () => {
                    if (
                      !window.confirm(
                        "Are you sure you want to delete this project? This action cannot be undone."
                      )
                    )
                      return;

                    try {
                      setSubmitting(true);
                      await API.delete(`projects/${project.id}/`);
                      alert("Project deleted successfully");
                      setPage("dashboard");
                    } catch {
                      alert("Failed to delete project");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  🗑 Delete Project
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
