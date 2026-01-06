import React, { useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/auth";

function CreateProject({ setPage }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    currency: "INR",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✅ Mandatory field validation
    if (!formData.title || !formData.description) {
      setError("Title and Description are required");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/projects/",
        {
          title: formData.title,
          description: formData.description,
          budget: formData.budget || null,
          currency: formData.currency,
        },
        getAuthHeaders()
      );

      setSuccess("Project created successfully");

      setTimeout(() => {
        setPage("projects");
      }, 1200);
    } catch {
      setError("Failed to create project");
    }
  };

return (
  <div className="projects-container">
    <div className="project-detail-card">
      <h2 className="project-detail-title">Create Project</h2>

      <form className="create-project-form" onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Project Title *</label>
          <input
            name="title"
            placeholder="Enter project title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Project Description *</label>
          <textarea
            name="description"
            placeholder="Describe your project"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Budget (optional)</label>
          <div className="budget-row">
            <input
              name="budget"
              type="number"
              placeholder="Amount"
              value={formData.budget}
              onChange={handleChange}
            />

            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => setPage("projects")}
          >
            Cancel
          </button>

          <button type="submit" className="primary-btn">
            Create Project
          </button>
        </div>

      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  </div>
);
}

export default CreateProject;
