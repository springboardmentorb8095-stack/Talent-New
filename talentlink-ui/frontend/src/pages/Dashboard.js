import { useEffect, useState } from "react";
import API from "../services/api";
import NotificationsBell from "./NotificationsBell";
import DashboardSkeleton from "./DashboardSkeleton";

function Dashboard({ setPage, setSelectedProjectId }) {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  /* ================= THEME ================= */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    setPage("login");
  };

  /* ================= LOAD DASHBOARD ================= */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const profileRes = await API.get("profile/");
        setProfile(profileRes.data);

        const role = profileRes.data.user.role;
        const projectRes =
          role === "CLIENT"
            ? await API.get("projects/")
            : await API.get("projects/", { params: { status: "OPEN" } });

        setProjects(projectRes.data);
      } catch {
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /* ================= DELETE PROJECT ================= */
  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project permanently?")) return;
    try {
      await API.delete(`projects/${id}/`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete project");
    }
  };

  if (loading) {
  return <DashboardSkeleton />;
   }


  const role = profile.user.role;

  return (
    <div className="dashboard-layout">
      {/* ================= SIDEBAR ================= */}
      <aside className="dashboard-sidebar">
        <div className="logo">TalentLink</div>

        <nav>
          <button className="side-link active">
            🏠 Dashboard
          </button>

          <button
            className="side-link"
            onClick={() => setPage("profile")}
          >
            👤 Profile
          </button>
          


          {role === "CLIENT" && (
            <button
              className="side-link"
              onClick={() => setPage("create-project")}
            >
              ➕ New Project
            </button>
          )}

          {role === "FREELANCER" && (
            <>
              <button
                className="side-link"
                onClick={() => setPage("project-feed")}
              >
                🔍 Browse Projects
              </button>

              <button
                className="side-link"
                onClick={() => setPage("my-proposals")}
              >
                📨 My Proposals
              </button>
            </>
          )}
          {role === "CLIENT" && (
  <button
            className="side-link"
            onClick={() => setPage("contracts")}
          >
            📄 Contracts
          </button>

)}

          <button
            className="side-link"
            onClick={() => setPage("messages")}
          >
            💬 Messages
          </button>
           <button
  className="side-link"
  onClick={() => setPage("settings")}
>
  ⚙️ Settings
</button>
{role === "CLIENT" && (
  <button
    className="side-link"
    onClick={() => setPage("view-proposals")}
  >
    📩 View Proposals
  </button>
)}


        </nav>
      </aside>
     

      {/* ================= MAIN ================= */}
      <main className="dashboard-main">
        {/* ================= TOP BAR ================= */}
        <header className="dashboard-topbar">
          <div>
            <h2>Dashboard</h2>
            <p className="muted">
              Welcome back, <strong>{profile.user.username}</strong>
            </p>
          </div>

          <div className="topbar-actions">
            {/* 🌗 THEME TOGGLE */}
            <button
              className="secondary-btn small"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>

            {/* 🔔 NOTIFICATIONS */}
            <NotificationsBell />

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* ================= STATS ================= */}
        <section className="stats-row">
          <div className="stat-box">
            <h3>{projects.length}</h3>
            <p>{role === "CLIENT" ? "Projects" : "Open Jobs"}</p>
          </div>

          <div className="stat-box">
            <h3>{role}</h3>
            <p>User Role</p>
          </div>

          <div className="stat-box">
            <h3>Active</h3>
            <p>Status</p>
          </div>
        </section>

        {/* ================= PROJECTS ================= */}
        <section>
          <h3 style={{ marginBottom: "12px" }}>
            {role === "CLIENT"
              ? "Your Projects"
              : "Available Projects"}
          </h3>

          {projects.length === 0 ? (
            <p className="muted">
              {role === "CLIENT"
                ? "No projects created yet."
                : "No open projects right now."}
            </p>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.id} className="project-tile">
                  <div className="project-header">
                    <h4>{project.title}</h4>
                    <span
                      className={`status-badge ${project.status.toLowerCase()}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p className="desc">
                    {project.description.length > 120
                      ? project.description.slice(0, 120) + "…"
                      : project.description}
                  </p>

                  <div className="meta">
                    <span>
                      💰 {project.budget_min} – {project.budget_max}
                    </span>
                    <span>⏳ {project.duration || "N/A"}</span>
                  </div>

                  {/* CLIENT ACTIONS */}
                  {role === "CLIENT" && (
                    <div className="project-actions">
                      <button
                        className="primary-btn small"
                        onClick={() => {
                          setSelectedProjectId(project.id);
                          setPage("project-proposals");
                        }}
                      >
                        Proposals
                        {project.proposals_count > 0 &&
                          ` (${project.proposals_count})`}
                      </button>

                      <button
                        className="secondary-btn small"
                        onClick={() => {
                          setSelectedProjectId(project.id);
                          setPage("edit-project");
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="danger small"
                        onClick={() => deleteProject(project.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {/* FREELANCER */}
                  {role === "FREELANCER" && (
                    <button
                      className="primary-btn"
                      onClick={() => {
                        setSelectedProjectId(project.id);
                        setPage("project-details");
                      }}
                    >
                      View & Apply
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}


export default Dashboard;
