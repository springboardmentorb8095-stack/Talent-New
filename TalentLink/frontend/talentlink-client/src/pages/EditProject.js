import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/auth";

function EditProject({ projectId, setPage }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    budget: "",
    currency: "INR",
  });

  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH PROJECT ---------------- */
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/projects/${projectId}/`,
          getAuthHeaders()
        );

        setForm({
          title: res.data.title,
          description: res.data.description,
          skills: res.data.skills,
          budget: res.data.budget || "",
          currency: res.data.currency || "INR",
        });

        setLoading(false);
      } catch {
        alert("Failed to load project");
        setPage("projects");
      }
    };

    fetchProject();
  }, [projectId, setPage]);

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/projects/${projectId}/`,
        form,
        getAuthHeaders()
      );
      setPage("project-detail");
    } catch {
      alert("Failed to update project");
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async () => {
    if (!window.confirm("Delete this project permanently?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/projects/${projectId}/`,
        getAuthHeaders()
      );
      setPage("projects");
    } catch {
      alert("Failed to delete project");
    }
  };

  if (loading) return <p>Loading...</p>;

  /* ======================= UI ======================= */
  return (
    <div className="projects-container">
      <div className="project-detail-card">
        <h2 className="project-detail-title">Edit Project</h2>

        <div className="form-group">
          <label className="form-label">Project Title *</label>
          <input
            className="form-input"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label className="form-label">Project Description *</label>
          <textarea
            className="form-textarea"
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label className="form-label">Required Skills *</label>
          <input
            className="form-input"
            placeholder="e.g. React, Django, REST API"
            value={form.skills}
            onChange={(e) =>
              setForm({ ...form, skills: e.target.value })
            }
          />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Budget</label>
            <input
              className="form-input"
              type="number"
              value={form.budget}
              onChange={(e) =>
                setForm({ ...form, budget: e.target.value })
              }
            />
          </div>

          <div className="form-group" style={{ width: "120px" }}>
            <label className="form-label">Currency</label>
            <select
              className="form-input"
              value={form.currency}
              onChange={(e) =>
                setForm({ ...form, currency: e.target.value })
              }
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              className="secondary-btn"
              onClick={() => setPage("project-detail")}
            >
              Cancel
            </button>

            <button
              className="primary-btn"
              onClick={handleSave}
            >
              Save
            </button>
          </div>

          <button
            className="danger-btn"
            onClick={handleDelete}
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProject;
