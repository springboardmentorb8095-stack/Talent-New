import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

export default function FreelancerDashboard() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await API.get("/dashboard/freelancer/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProposals(res.data.proposals || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load your proposals.");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [navigate]);

  if (loading) return <p>Loading your dashboard...</p>;

  return (
    <div style={wrapperStyle}>
      <h2>Freelancer Dashboard</h2>
      <p>Welcome! Here’s an overview of your projects and bids.</p>

      {/* Link to Project Feed */}
      <Link to="/freelancer/projects" style={feedBtnStyle}>
        Browse Projects & Place Bids
      </Link>

      <h3 style={{ marginTop: "20px" }}>Your Proposals</h3>
      {proposals.length === 0 ? (
        <p>You have not placed any bids yet.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Project</th>
              <th>Bid Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((p) => (
              <tr key={p.id}>
                <td>{p.project_title}</td>
                <td>${p.bid_amount}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* STYLES */
const wrapperStyle = {
  maxWidth: "800px",
  margin: "50px auto",
  padding: "20px",
  borderRadius: "12px",
  background: "#f1f5f9",
  color: "#111",
};

const feedBtnStyle = {
  display: "inline-block",
  marginTop: "10px",
  padding: "10px 20px",
  background: "#3b82f6",
  color: "#fff",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "bold",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "15px",
};



