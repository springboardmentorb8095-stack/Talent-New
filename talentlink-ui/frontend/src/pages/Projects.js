import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard({ setPage, setSelectedProject }) {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileRes = await API.get("profile/");
        setProfile(profileRes.data);

        const role = profileRes.data.user.role;
        const url = role === "CLIENT" ? "projects/?mine=true" : "projects/";
        const projectRes = await API.get(url);
        setProjects(projectRes.data);
      } catch (err) {
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setPage("login");
  };

  const openProject = (project) => {
    setSelectedProject(project);
    setPage("project-details");
  };

  if (loading) {
    return <div className="loading-screen">Loading dashboard...</div>;
  }

  const role = profile.user.role;

  return (
    <div className="dashboard-layout">
      {/* ============ SIDEBAR ============ */}
      <aside className="dashboard-sidebar">
        <h2 className="logo">TalentLink</h2>

        <nav>
          <button className="side-link" onClick={() => setPage("edit-profile")}>
            Edit Profile
          </button>

          <button className="side-link" onClick={() => setPage("projects")}>
            Browse Projects
          </button>

          {role === "CLIENT" && (
            <button
              className="side-link"
              onClick={() => setPage("create-project")}
            >
              Create Project
            </button>
          )}
        </nav>
      </aside>

      {/* ============ MAIN AREA ============ */}
      <div className="dashboard-main">
        {/* TOP BAR */}
        <header className="dashboard-topbar">
          <div>
            <h3>Welcome back, {profile.user.username} 👋</h3>
            <span>{profile.user.email}</span>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        {/* STATS */}
        <section className="stats-row">
          <div className="stat-box">
            <h4>{role === "CLIENT" ? "Your Projects" : "Available Projects"}</h4>
            <p>{projects.length}</p>
          </div>

          <div className="stat-box">
            <h4>Role</h4>
            <p>{role}</p>
          </div>

          <div className="stat-box">
            <h4>Status</h4>
            <p>Active</p>
          </div>
        </section>

        {/* PROJECTS */}
        <section className="projects-section">
          <h3>Projects</h3>

          {projects.length === 0 ? (
            <p>No projects found</p>
          ) : (
            <div className="projects-grid">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="project-tile clickable"
                  onClick={() => openProject(p)}
                >
                  <h4>{p.title}</h4>
                  <p className="desc">
                    {p.description.length > 100
                      ? p.description.slice(0, 100) + "..."
                      : p.description}
                  </p>
                  <p>💰 {p.budget_min} – {p.budget_max}</p>
                  <span className={`status ${p.status.toLowerCase()}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
