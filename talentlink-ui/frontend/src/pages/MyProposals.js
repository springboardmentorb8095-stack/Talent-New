import { useEffect, useState } from "react";
import API from "../services/api";

function MyProposals({ setPage }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  /* ================= LOAD PROPOSALS ================= */
  useEffect(() => {
    const loadProposals = async () => {
      try {
        const res = await API.get("my-proposals/");
        setProposals(res.data);
      } catch {
        alert("Failed to load proposals");
        setPage("dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadProposals();
  }, [setPage]);

  /* ================= DELETE PROPOSAL ================= */
  const deleteProposal = async (id) => {
    if (!window.confirm("Delete this proposal?")) return;

    try {
      setActionLoading(id);
      await API.delete(`proposals/${id}/delete/`);
      setProposals((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete proposal");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading proposals...</div>;
  }

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        {/* ================= HEADER ================= */}
        <header className="dashboard-topbar">
          <div>
            <h2>My Proposals</h2>
            <p className="muted">
              Track and manage all your submitted proposals
            </p>
          </div>

          <button
            className="secondary-btn"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>
        </header>

        {/* ================= CONTENT ================= */}
        {proposals.length === 0 ? (
          <div
            className="card fade"
            style={{ maxWidth: 700, margin: "auto", textAlign: "center" }}
          >
            <h3>No Proposals Yet</h3>
            <p className="muted">
              You haven’t submitted any proposals yet.
            </p>

            <button
              className="primary-btn"
              onClick={() => setPage("project-feed")}
              style={{ marginTop: 16 }}
            >
              Browse Projects
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 24,
              gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
            }}
          >
            {proposals.map((p) => (
              <div key={p.id} className="card fade">
                {/* ================= HEADER ================= */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <h3 style={{ margin: 0 }}>{p.project_title}</h3>

                  <span
                    className={`status-badge ${p.status.toLowerCase()}`}
                  >
                    {p.status}
                  </span>
                </div>

                {/* ================= TEXT ================= */}
                <p className="muted" style={{ lineHeight: 1.6 }}>
                  {p.cover_letter.length > 220
                    ? p.cover_letter.slice(0, 220) + "..."
                    : p.cover_letter}
                </p>

                {/* ================= META ================= */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 14,
                    fontSize: 14,
                    color: "var(--text-muted)",
                  }}
                >
                  <span>💰 Bid: ₹{p.bid_amount}</span>
                  <span>
                    🕒 {new Date(p.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* ================= STATUS NOTES ================= */}
                {p.status === "ACCEPTED" && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "rgba(16,185,129,.15)",
                      color: "var(--success)",
                      fontSize: 14,
                    }}
                  >
                    ✅ Accepted — client will contact you
                  </div>
                )}

                {p.status === "REJECTED" && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "rgba(239,68,68,.15)",
                      color: "var(--danger)",
                      fontSize: 14,
                    }}
                  >
                    ❌ Rejected
                  </div>
                )}

                {/* ================= ACTIONS ================= */}
                {p.status === "PENDING" && (
                  <div style={{ marginTop: 18 }}>
                    <button
                      className="danger"
                      disabled={actionLoading === p.id}
                      onClick={() => deleteProposal(p.id)}
                    >
                      {actionLoading === p.id
                        ? "Deleting..."
                        : "Delete Proposal"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProposals;
