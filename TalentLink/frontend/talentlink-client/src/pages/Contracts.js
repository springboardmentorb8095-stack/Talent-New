import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/auth";

function MyContracts({ setPage }) {
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState("");

  const fetchContracts = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/contracts/my/",
        getAuthHeaders()
      );
      setContracts(res.data);
    } catch {
      setError("Failed to load contracts");
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/contracts/${id}/update-status/`,
        { status },
        getAuthHeaders()
      );
      fetchContracts(); // refresh list
    } catch {
      alert("Status update failed");
    }
  };

  return (
    <div className="projects-container">
      <div className="project-detail-card">
        <h2 className="project-detail-title">My Contracts</h2>

        {error && <p className="error">{error}</p>}

        {contracts.length === 0 && (
          <p className="success">No contracts found</p>
        )}

        {contracts.map((c) => (
          <div key={c.id} className="project-card">
            <p><b>Project:</b> {c.project_title}</p>
            <p><b>Client:</b> {c.client_username}</p>
            <p><b>Freelancer:</b> {c.freelancer_username}</p>

            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color:
                    c.status === "completed"
                      ? "#22c55e"
                      : c.status === "cancelled"
                      ? "#ef4444"
                      : "#facc15",
                }}
              >
                {c.status.toUpperCase()}
              </span>
            </p>

            {c.status === "active" && (
              <div style={{ marginTop: "10px" }}>
                <button
                  className="primary-btn"
                  onClick={() => updateStatus(c.id, "completed")}
                >
                  Complete
                </button>

                <button
                  className="secondary-btn"
                  style={{ marginLeft: "10px" }}
                  onClick={() => updateStatus(c.id, "cancelled")}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          className="primary-btn"
          style={{ marginTop: "20px" }}
          onClick={() => setPage("projects")}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default MyContracts;
