import { useEffect, useState } from "react";
import API from "../services/api";

function ProjectFeed({ setPage, setSelectedProjectId }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FILTER STATES ================= */
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [duration, setDuration] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [ordering, setOrdering] = useState("-created_at");

  /* ================= LOAD PROJECTS ================= */
  const fetchProjects = async (params = {}) => {
    try {
      setLoading(true);
      const res = await API.get("projects/", {
        params: {
          status: "OPEN",
          ...params,
        },
      });
      setProjects(res.data);
    } catch {
      alert("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ================= APPLY FILTER ================= */
  const applyFilters = () => {
    const params = {};
    if (search) params.search = search;
    if (skill) params["required_skills__name"] = skill;
    if (duration) params.duration = duration;
    if (minBudget) params.budget_min__gte = minBudget;
    if (maxBudget) params.budget_max__lte = maxBudget;
    if (ordering) params.ordering = ordering;
    fetchProjects(params);
  };

  const clearFilters = () => {
    setSearch("");
    setSkill("");
    setDuration("");
    setMinBudget("");
    setMaxBudget("");
    setOrdering("-created_at");
    fetchProjects();
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        {/* ================= HEADER ================= */}
        <header className="dashboard-topbar">
          <div>
            <h2>Browse Projects</h2>
            <p className="muted">
              Discover freelance projects that match your skills
            </p>
          </div>

          <button
            className="secondary-btn"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>
        </header>

        {/* ================= FILTER BAR ================= */}
        <div
          className="card fade"
          style={{
            marginBottom: 32,
            maxWidth: "100%",
          }}
        >
          <h3 style={{ marginBottom: 16 }}>🔍 Filters</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            <input
              placeholder="Search projects"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <input
              placeholder="Skill (React, Django)"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />

            <input
              type="number"
              placeholder="Min Budget"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
            />

            <input
              type="number"
              placeholder="Max Budget"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
            />

            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="">All Durations</option>
              <option value="SHORT">Less than 1 month</option>
              <option value="MEDIUM">1–3 months</option>
              <option value="LONG">More than 3 months</option>
            </select>

            <select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
            >
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
              <option value="budget_min">Lowest Budget</option>
              <option value="-budget_min">Highest Budget</option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 20,
              justifyContent: "flex-end",
            }}
          >
            <button className="secondary-btn" onClick={clearFilters}>
              Clear
            </button>
            <button className="primary-btn" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
        </div>

        {/* ================= PROJECT LIST ================= */}
        {loading ? (
          <div className="card fade" style={{ textAlign: "center" }}>
            <h3>Loading projects...</h3>
          </div>
        ) : projects.length === 0 ? (
          <div className="card fade" style={{ textAlign: "center" }}>
            <h3>No projects found</h3>
            <p className="muted">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-tile">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <h4>{project.title}</h4>
                  <span className="status">
                    {project.duration}
                  </span>
                </div>

                <p className="desc">
                  {project.description.length > 140
                    ? project.description.slice(0, 140) + "..."
                    : project.description}
                </p>

                <div
                  className="meta"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 12,
                    fontSize: 14,
                    color: "var(--text-muted)",
                  }}
                >
                  <span>💰 ₹{project.budget_min} – ₹{project.budget_max}</span>
                  <span>📅 {project.created_at?.slice(0, 10)}</span>
                </div>

                <button
                  className="primary-btn small"
                  style={{ marginTop: 16 }}
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setPage("project-details");
                  }}
                >
                  View & Apply →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectFeed;
