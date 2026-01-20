import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./dashboard.css";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedContracts: 0,
    freelancersHired: 0,
  });
  const [recentContracts, setRecentContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await axiosInstance.get("/dashboard/client/");
      setStats(res.data.stats);
      setRecentContracts(res.data.recent_contracts);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      {/* <h2 className="dashboard-title">Client Dashboard</h2> */}

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Active Projects</p>
          <h3 className="stat-value">{stats.activeProjects}</h3>
        </div>

        <div className="stat-card">
          <p className="stat-label">Freelancers Hired</p>
          <h3 className="stat-value">{stats.freelancersHired}</h3>
        </div>

        <div className="stat-card">
          <p className="stat-label">Completed Contracts</p>
          <h3 className="stat-value">{stats.completedContracts}</h3>
        </div>
      </div>

      <div className="action-row">
        <button className="btn-primary" onClick={() => navigate("/client/create-project")}>
          Post New Project
        </button>

        <button className="btn-dark" onClick={() => navigate("/contracts/my-contracts")}>
          View Contracts
        </button>
      </div>

      <div className="list-card">
        <h3 className="list-title">Recent Contracts</h3>

        {recentContracts.length === 0 ? (
          <p className="empty-text">No contracts yet.</p>
        ) : (
          <ul className="list-wrapper">
            {recentContracts.map(c => (
              <li key={c.id} className="list-item">
                <div>
                  <p className="list-main">{c.project_title}</p>
                  <p className="list-sub">Freelancer: {c.freelancer}</p>
                </div>
                <span className={`status-badge ${c.status.toLowerCase()}`}>
                  {c.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
