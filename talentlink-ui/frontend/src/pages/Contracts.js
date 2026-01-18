import { useEffect, useState } from "react";
import API from "../services/api";

function Contracts({ setPage }) {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD CONTRACTS ================= */
  const loadContracts = async () => {
    try {
      const res = await API.get("contracts/");
      setContracts(res.data);
    } catch {
      alert("Failed to load contracts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (contractId, status) => {
    if (!window.confirm(`Mark contract as ${status}?`)) return;

    try {
      await API.put(`contracts/${contractId}/status/`, { status });
      loadContracts();
    } catch {
      alert("Failed to update contract");
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading contracts...</div>;
  }

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        {/* ================= HEADER ================= */}
        <header className="dashboard-topbar">
          <div>
            <h2>Contracts</h2>
            <p className="muted">
              Track and manage your active & completed agreements
            </p>
          </div>

          <button
            className="secondary-btn"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>
        </header>

        {/* ================= EMPTY STATE ================= */}
        {contracts.length === 0 ? (
          <div
            className="card fade"
            style={{
              maxWidth: 520,
              margin: "80px auto",
              textAlign: "center",
            }}
          >
            <h3>No Contracts Yet</h3>
            <p className="muted" style={{ marginTop: 10 }}>
              Contracts will appear here once a proposal is accepted.
            </p>
          </div>
        ) : (
          /* ================= CONTRACTS GRID ================= */
          <div className="contracts-grid">
            {contracts.map((c) => (
              <div key={c.id} className="contract-card fade">
                {/* ===== HEADER ===== */}
                <div className="contract-header">
                  <h4>{c.project.title}</h4>
                  <span
                    className={`status-badge ${c.status.toLowerCase()}`}
                  >
                    {c.status}
                  </span>
                </div>

                {/* ===== META INFO ===== */}
                <div className="contract-meta">
                  <p>
                    <strong>Client</strong>
                    <br />
                    {c.client.username}
                  </p>

                  <p>
                    <strong>Freelancer</strong>
                    <br />
                    {c.freelancer.username}
                  </p>

                  <p>
                    <strong>Start Date</strong>
                    <br />
                    {c.start_date}
                  </p>

                  {c.end_date && (
                    <p>
                      <strong>End Date</strong>
                      <br />
                      {c.end_date}
                    </p>
                  )}
                </div>

                {/* ===== TERMS ===== */}
                {c.terms && (
                  <div className="contract-terms">
                    <strong>Contract Terms</strong>
                    <p className="muted">{c.terms}</p>
                  </div>
                )}

                {/* ===== ACTIONS ===== */}
                {c.status === "ACTIVE" && (
                  <div
                    style={{
                      display: "flex",
                      gap: "14px",
                      marginTop: "20px",
                    }}
                  >
                    <button
                      className="primary-btn small"
                      onClick={() =>
                        updateStatus(c.id, "COMPLETED")
                      }
                    >
                      ✅ Complete
                    </button>

                    <button
                      className="danger"
                      onClick={() =>
                        updateStatus(c.id, "CANCELLED")
                      }
                    >
                      ❌ Cancel
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

export default Contracts;
