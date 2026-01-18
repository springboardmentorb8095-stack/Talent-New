import { useEffect, useState } from "react";
import API from "../services/api";

function CreateProject({ setPage }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget_min: "",
    budget_max: "",
    duration: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= ROLE CHECK ================= */
  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await API.get("profile/");
        if (res.data.user.role !== "CLIENT") {
          alert("Only clients can create projects");
          setPage("dashboard");
        }
      } catch {
        setPage("login");
      }
    };

    checkRole();
  }, [setPage]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      alert("Project title and description are required");
      return;
    }

    if (
      form.budget_min &&
      form.budget_max &&
      Number(form.budget_min) > Number(form.budget_max)
    ) {
      alert("Minimum budget cannot exceed maximum budget");
      return;
    }

    try {
      setLoading(true);
      await API.post("projects/", form);
      alert("✅ Project created successfully");
      setPage("dashboard");
    } catch {
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        {/* ================= HEADER ================= */}
        <header className="dashboard-topbar">
          <div>
            <h2>Create New Project</h2>
            <p className="muted">
              Describe your project clearly to attract top freelancers
            </p>
          </div>

          <button
            className="secondary-btn"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>
        </header>

        {/* ================= FORM CARD ================= */}
        <div
          className="card fade"
          style={{
            maxWidth: 900,
            margin: "auto",
          }}
        >
          {/* ===== SECTION: BASIC INFO ===== */}
          <div style={{ marginBottom: 32 }}>
            <h3>📌 Project Basics</h3>
            <p className="muted">
              A clear title and description help freelancers understand
              your needs quickly.
            </p>

            <label className="form-label">Project Title</label>
            <input
              name="title"
              placeholder="e.g. Build a modern React dashboard"
              value={form.title}
              onChange={handleChange}
            />

            <label className="form-label">Project Description</label>
            <textarea
              name="description"
              rows={6}
              placeholder="Describe the project scope, goals, deliverables, and expectations..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* ===== SECTION: BUDGET ===== */}
          <div style={{ marginBottom: 32 }}>
            <h3>💰 Budget</h3>
            <p className="muted">
              Providing a budget range increases quality proposals.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              <div>
                <label className="form-label">Minimum Budget (₹)</label>
                <input
                  type="number"
                  name="budget_min"
                  placeholder="e.g. 5000"
                  value={form.budget_min}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div>
                <label className="form-label">Maximum Budget (₹)</label>
                <input
                  type="number"
                  name="budget_max"
                  placeholder="e.g. 15000"
                  value={form.budget_max}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* ===== SECTION: DURATION ===== */}
          <div style={{ marginBottom: 40 }}>
            <h3>⏳ Project Duration</h3>
            <p className="muted">
              Estimate how long the project will take.
            </p>

            <select
              name="duration"
              value={form.duration}
              onChange={handleChange}
            >
              <option value="">Select duration</option>
              <option value="SHORT">Less than 1 month</option>
              <option value="MEDIUM">1–3 months</option>
              <option value="LONG">More than 3 months</option>
            </select>
          </div>

          {/* ===== ACTIONS ===== */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 14,
            }}
          >
            <button
              className="secondary-btn"
              onClick={() => setPage("dashboard")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              className="primary-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating..." : "🚀 Publish Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;
