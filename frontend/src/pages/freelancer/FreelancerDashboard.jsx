import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./dashboard.css";

export default function FreelancerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeContracts: 0,
    completedContracts: 0,
    avgRating: 0,
  });
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await axiosInstance.get("/dashboard/freelancer/");
      setStats(res.data.stats);
      setRecentReviews(res.data.recent_reviews);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      {/* <h2 className="dashboard-title">Freelancer Dashboard</h2> */}

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Active Contracts</p>
          <h3 className="stat-value">{stats.activeContracts}</h3>
        </div>

        <div className="stat-card">
          <p className="stat-label">Completed Contracts</p>
          <h3 className="stat-value">{stats.completedContracts}</h3>
        </div>

        <div className="stat-card">
          <p className="stat-label">Average Rating</p>
          <h3 className="stat-value">{stats.avgRating.toFixed(1)}</h3>
        </div>
      </div>

      <div className="action-row">
        <button className="btn-primary" onClick={() => navigate("/freelancer/browse")}>
          Browse Projects
        </button>

        <button className="btn-dark" onClick={() => navigate("/contracts/my-contracts")}>
          View Contracts
        </button>
      </div>

      <div className="list-card">
        <h3 className="list-title">Recent Reviews</h3>

        {recentReviews.length === 0 ? (
          <p className="empty-text">No reviews yet.</p>
        ) : (
          <ul className="list-wrapper">
            {recentReviews.map(r => (
              <li key={r.id} className="list-item-column">
                <p className="list-main">Rating: ⭐ {r.rating}</p>
                <p className="list-sub">{r.comment}</p>
                <p className="list-meta">From client <b>{r.reviewer}</b></p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
