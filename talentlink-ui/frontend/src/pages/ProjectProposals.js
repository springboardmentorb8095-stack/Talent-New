import { useEffect, useState } from "react";
import API from "../services/api";

function ProjectProposals({
  projectId,
  setPage,
  setSelectedContractId, // ✅ ADD
}) {
  const [proposals, setProposals] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const projectRes = await API.get(`projects/${projectId}/`);
        setProject(projectRes.data);

        const proposalRes = await API.get(
          `projects/${projectId}/proposals/`
        );
        setProposals(proposalRes.data);
      } catch (err) {
        alert("Failed to load proposals");
        setPage("dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId, setPage]);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (proposalId, status) => {
    if (
      !window.confirm(
        `Are you sure you want to ${status.toLowerCase()} this proposal?`
      )
    )
      return;

    try {
      setActionLoading(proposalId);

      await API.put(`proposals/${proposalId}/status/`, { status });

      setProposals((prev) =>
        prev.map((p) =>
          p.id === proposalId ? { ...p, status } : p
        )
      );
    } catch {
      alert("Failed to update proposal");
    } finally {
      setActionLoading(null);
    }
  };

  /* ================= CHAT NOW ================= */
  const openChat = async () => {
    try {
      const res = await API.get("chats/");
      const contract = res.data.find(
        (c) => c.project.id === project.id
      );

      if (!contract) {
        alert("Chat not available yet");
        return;
      }

      setSelectedContractId(contract.id);
      setPage("messages");
    } catch {
      alert("Failed to open chat");
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading proposals...</div>;
  }

  if (!project) return null;

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        {/* ================= HEADER ================= */}
        <header className="dashboard-topbar">
          <div>
            <h2>Project Proposals</h2>
            <p className="muted">
              Reviewing proposals for{" "}
              <strong>{project.title}</strong>
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
            style={{ maxWidth: 720, margin: "auto", textAlign: "center" }}
          >
            <h3>No Proposals Yet</h3>
            <p className="muted">
              Freelancers haven’t submitted proposals yet.
            </p>
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
                {/* HEADER */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <h3>{p.freelancer.username}</h3>
                  <span
                    className={`status-badge ${p.status.toLowerCase()}`}
                  >
                    {p.status}
                  </span>
                </div>

                {/* COVER LETTER */}
                <p className="muted">
                  {p.cover_letter.length > 260
                    ? p.cover_letter.slice(0, 260) + "..."
                    : p.cover_letter}
                </p>

                {/* META */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                  }}
                >
                  <span>💰 ₹{p.bid_amount}</span>
                  <span>
                    🕒{" "}
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* ACCEPTED */}
                {p.status === "ACCEPTED" && (
                  <div
                    style={{
                      marginTop: 16,
                      display: "flex",
                      gap: 12,
                    }}
                  >
                    <button
                      className="primary-btn"
                      onClick={openChat}
                    >
                      💬 Chat Now
                    </button>
                  </div>
                )}

                {/* ACTIONS */}
                {p.status === "PENDING" && (
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      marginTop: 16,
                    }}
                  >
                    <button
                      className="primary"
                      disabled={actionLoading === p.id}
                      onClick={() =>
                        updateStatus(p.id, "ACCEPTED")
                      }
                    >
                      Accept
                    </button>

                    <button
                      className="danger"
                      disabled={actionLoading === p.id}
                      onClick={() =>
                        updateStatus(p.id, "REJECTED")
                      }
                    >
                      Reject
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

export default ProjectProposals;
