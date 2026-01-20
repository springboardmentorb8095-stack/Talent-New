import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/auth";

function MyProposals({ setPage, setSelectedProject }) {

  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyProposals();
  }, []);

  const fetchMyProposals = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/proposals/my/",
        getAuthHeaders()
      );
      setProposals(res.data);
    } catch {
      setError("Failed to load your proposals");
    }
  };

  return (
    <div className="projects-container">
      <div className="project-detail-card">
        <h2 className="project-detail-title">My Proposals</h2>

        {error && <p className="error">{error}</p>}

        {proposals.length === 0 && !error && (
          <p className="success">You have not submitted any proposals yet.</p>
        )}

        {proposals.map((proposal) => (
  <div
    key={proposal.id}
    className="project-card"
    onClick={() => {
      setSelectedProject(proposal.project); // ✅ project id
      setPage("project-detail");             // ✅ navigate
    }}
    style={{ cursor: "pointer" }}
  >

            <h3 className="project-title">
              {proposal.project_title || "Project"}
            </h3>

            <p className="project-desc">{proposal.message}</p>

            <p>
              <b>Proposed Price:</b> {proposal.proposed_price}
            </p>

            <p>
              <b>Delivery Time:</b> {proposal.delivery_time} days
            </p>

            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color:
                    proposal.status === "accepted"
                      ? "#22c55e"
                      : proposal.status === "rejected"
                      ? "#ef4444"
                      : "#facc15",
                  fontWeight: "bold",
                }}
              >
                {proposal.status.toUpperCase()}
              </span>
            </p>
          </div>
        ))}

        <button
          className="secondary-btn"
          onClick={() => setPage("projects")}
        >
          Back to Projects
        </button>
      </div>
    </div>
  );
}

export default MyProposals;
