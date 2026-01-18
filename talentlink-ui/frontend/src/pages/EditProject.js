import { useEffect, useState } from "react";
import API from "../services/api";

function EditProject({ projectId, setPage }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD PROJECT ================= */
  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await API.get(`projects/${projectId}/`);
        setProject(res.data);
      } catch {
        alert("Failed to load project");
        setPage("dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, setPage]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setProject({
      ...project,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!project.title || !project.description) {
      alert("Title and description are required");
      return;
    }

    try {
      setSaving(true);

      await API.put(`projects/${project.id}/`, {
        title: project.title,
        description: project.description,
        budget_min: project.budget_min,
        budget_max: project.budget_max,
        duration: project.duration,
      });

      alert("Project updated successfully");
      setPage("dashboard");
    } catch {
      alert("Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading project...</div>;
  }

  if (!project) return null;

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        {/* ================= HEADER ================= */}
        <header className="dashboard-topbar">
          <div>
            <h2>Edit Project</h2>
            <p className="muted">Update your project details</p>
          </div>

          <button
            className="secondary-btn"
            onClick={() => setPage("dashboard")}
          >
            ← Back
          </button>
        </header>

        {/* ================= FORM ================= */}
        <div
          className="card fade"
          style={{ maxWidth: "900px", margin: "auto" }}
        >
          <input
            name="title"
            placeholder="Project Title"
            value={project.title || ""}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Project Description"
            rows={5}
            value={project.description || ""}
            onChange={handleChange}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            <input
              name="budget_min"
              type="number"
              placeholder="Minimum Budget"
              value={project.budget_min || ""}
              onChange={handleChange}
            />

            <input
              name="budget_max"
              type="number"
              placeholder="Maximum Budget"
              value={project.budget_max || ""}
              onChange={handleChange}
            />

            <select
              name="duration"
              value={project.duration || ""}
              onChange={handleChange}
            >
              <option value="">Select Duration</option>
              <option value="SHORT">Less than 1 month</option>
              <option value="MEDIUM">1–3 months</option>
              <option value="LONG">More than 3 months</option>
            </select>
          </div>

          {/* ================= ACTIONS ================= */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              marginTop: "32px",
            }}
          >
            <button
              className="primary-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              className="danger"
              onClick={() => setPage("dashboard")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProject;
