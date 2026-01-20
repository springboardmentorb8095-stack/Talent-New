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

  // ✅ Free text skills
  const [skillsInput, setSkillsInput] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✅ Validation
    if (!formData.title || !formData.description) {
      setError("Title and Description are required");
      return;
    }

    if (!skillsInput.trim()) {
      setError("Please enter required skills");
      return;
    }

    // ✅ Convert skills text → array
    const skillsArray = skillsInput
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/projects/",
        {
          title: formData.title,
          description: formData.description,
          budget: formData.budget || null,
          currency: formData.currency,
          required_skills: skillsArray.join(", "),
        },
        getAuthHeaders()
      );

      setSuccess("Project created successfully");

      setTimeout(() => {
        setPage("projects");
      }, 1200);
    } catch (err) {
  console.error(err.response?.data || err.message);
  setError("Failed to create project");
}

  };

  return (
    <div className="projects-container">
      <div className="project-detail-card">
        <h2 className="project-detail-title">Create Project</h2>

        <form className="create-project-form" onSubmit={handleSubmit}>
          {/* ===== TITLE ===== */}
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

          {/* ===== DESCRIPTION ===== */}
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

          {/* ===== SKILLS ===== */}
          <div className="form-group">
            <label>Required Skills *</label>
            <input
              type="text"
              placeholder="e.g. React, Django, REST API"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              required
            />
            <small style={{ color: "#94a3b8" }}>
              Separate skills using commas
            </small>
          </div>

          {/* ===== BUDGET ===== */}
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

          {/* ===== ACTIONS ===== */}
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
