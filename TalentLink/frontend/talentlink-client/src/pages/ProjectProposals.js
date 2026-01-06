import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/auth";

function ProjectProposals({ projectId, setPage }) {
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchProposals();
    }
  }, [projectId]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://127.0.0.1:8000/api/projects/${projectId}/proposals/list/`,
        getAuthHeaders()
      );
      setProposals(res.data);
      setError("");
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError("Only the project owner can view proposals.");
      } else {
        setError("Unable to load proposals.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (proposalId, action) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/proposals/${proposalId}/${action}/`,
        {},
        getAuthHeaders()
      );
      fetchProposals(); // refresh list
    } catch {
      alert("Action failed");
    }
  };

  return (
    <div className="projects-container">
      <div className="project-detail-card">
        <h2 className="project-detail-title">Project Proposals</h2>

        {/* Loading */}
        {loading && <p>Loading proposals...</p>}

        {/* Error */}
        {!loading && error && (
          <p className="error">{error}</p>
        )}

        {/* No proposals */}
        {!loading && !error && proposals.length === 0 && (
          <p className="success">
            No proposals have been submitted yet.
          </p>
        )}

        {/* Proposals list */}
        {!loading &&
          proposals.length > 0 &&
          proposals.map((p) => (
            <div key={p.id} className="project-card">
              <p>
                <b>Freelancer:</b> {p.freelancer_username}
              </p>
              <p>{p.message}</p>
              <p>
                <b>Price:</b> ₹{p.proposed_price}
              </p>
              <p>
                <b>Delivery:</b> {p.delivery_time} days
              </p>
              <p>
                <b>Status:</b>{" "}
                <span
                  style={{
                    color:
                      p.status === "accepted"
                        ? "#22c55e"
                        : p.status === "rejected"
                        ? "#ef4444"
                        : "#facc15",
                  }}
                >
                  {p.status}
                </span>
              </p>

              {p.status === "pending" && (
                <div style={{ marginTop: "10px" }}>
                  <button
                    className="primary-btn"
                    onClick={() =>
                      handleAction(p.id, "accept")
                    }
                  >
                    Accept
                  </button>

                  <button
                    className="primary-btn"
                    style={{
                      background: "#ef4444",
                      marginLeft: "10px",
                    }}
                    onClick={() =>
                      handleAction(p.id, "reject")
                    }
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}

        {/* Back */}
        <button
          className="primary-btn"
          style={{ marginTop: "20px" }}
          onClick={() => setPage("projects")}
        >
          Back to Projects
        </button>
      </div>
    </div>
  );
}

export default ProjectProposals;
