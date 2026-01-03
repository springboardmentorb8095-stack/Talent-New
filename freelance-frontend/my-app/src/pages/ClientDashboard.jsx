import { useEffect, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import { toast } from "react-toastify";
import { FaMoneyBillWave, FaClock, FaProjectDiagram } from "react-icons/fa";

export default function ClientDashboard() {
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard/client/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        setProjects(res.data.projects);
        setProposals(res.data.proposals);
      } catch (err) {
        console.error(err);
        setError(
          "Failed to load dashboard. Make sure you are logged in as a client."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.post(
        `/proposals/${id}/status/`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        }
      );

      setProposals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );

      toast.success(
        status === "accepted" ? "Proposal accepted!" : "Proposal rejected!"
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update proposal status");
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <DashboardLayout title="Client Dashboard">
      {/* PROJECTS */}
      <section>
        <h3>My Projects</h3>
        {projects.length === 0 && <p>No projects yet.</p>}

        <div style={{ display: "grid", gap: "12px" }}>
          {projects.map((p) => (
            <div key={p.id} style={gradientCard}>
              <h4>
                <FaProjectDiagram /> {p.title}
              </h4>
              <p>
                <FaMoneyBillWave /> ₹{p.budget}
              </p>
              <p>
                <FaClock /> {p.duration_days} days
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PROPOSALS */}
      <section style={{ marginTop: "30px" }}>
        <h3>Proposals Received</h3>
        {proposals.length === 0 && <p>No proposals received yet.</p>}

        {proposals.map((pr) => (
          <div key={pr.id} style={gradientCard}>
            <p>
              <FaProjectDiagram /> <b>Project:</b> {pr.project_title}
            </p>
            <p>
              <FaMoneyBillWave /> <b>Bid:</b> ₹{pr.bid_amount}
            </p>
            <p>{pr.cover_letter}</p>

            <span style={badge(pr.status)}>{pr.status.toUpperCase()}</span>

            {pr.status === "pending" && (
              <div style={{ marginTop: "12px" }}>
                <button
                  style={{ ...btn, background: "#28a745" }}
                  onClick={() => updateStatus(pr.id, "accepted")}
                >
                  Accept
                </button>
                <button
                  style={{ ...btn, background: "#dc3545", marginLeft: "10px" }}
                  onClick={() => updateStatus(pr.id, "rejected")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </section>
    </DashboardLayout>
  );
}

/* ---------------- STYLES ---------------- */
const gradientCard = {
  background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 6px 12px rgba(0,0,0,0.12)",
  color: "#333",
  fontWeight: "500",
};

const btn = {
  padding: "8px 16px",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const badge = (status) => ({
  display: "inline-block",
  marginTop: "6px",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  background:
    status === "accepted" ? "#28a745" : status === "rejected" ? "#dc3545" : "#ffc107",
  color: "#fff",
});

