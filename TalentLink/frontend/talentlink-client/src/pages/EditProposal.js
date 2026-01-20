import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/auth";

function EditProposal({ projectId, setPage }) {
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");
  const [days, setDays] = useState("");
  const [error, setError] = useState("");

  /* ================= FETCH EXISTING PROPOSAL ================= */
  useEffect(() => {
    fetchMyProposal();
  }, []);

  const fetchMyProposal = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/proposals/my-proposal/${projectId}/`,
        getAuthHeaders()
      );

      setMessage(res.data.message);
      setPrice(res.data.proposed_price);
      setDays(res.data.delivery_time);
    } catch {
      setError("Failed to load proposal");
    }
  };

  /* ================= SAVE EDIT ================= */
  const handleSave = async () => {
    if (!message || !price || !days) {
      setError("All fields are required");
      return;
    }

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/proposals/edit/${projectId}/`,
        {
          message,
          proposed_price: price,
          delivery_time: days,
        },
        getAuthHeaders()
      );

      setPage("project-detail");
    } catch {
      setError("Failed to update proposal");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!window.confirm("Delete this proposal?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/proposals/delete/${projectId}/`,
        getAuthHeaders()
      );

      setPage("project-detail");
    } catch {
      setError("Failed to delete proposal");
    }
  };

  return (
    <div className="projects-container">
      <div className="project-detail-card">
        <h2 className="project-detail-title">Edit Proposal</h2>

        {error && <p className="error">{error}</p>}

        {/* MESSAGE */}
        <div className="form-group">
          <label className="form-label">Proposal Message *</label>
          <textarea
            className="form-textarea"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* PRICE */}
        <div className="form-group">
          <label className="form-label">Proposed Price *</label>
          <input
            className="form-input"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* DAYS */}
        <div className="form-group">
          <label className="form-label">Delivery Time (days) *</label>
          <input
            className="form-input"
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </div>

        {/* BUTTONS */}
        <div
          style={{
            marginTop: "25px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              className="secondary-btn"
              onClick={() => setPage("project-detail")}
            >
              Cancel
            </button>

            <button className="primary-btn" onClick={handleSave}>
              Save
            </button>
          </div>

          <button className="danger-btn" onClick={handleDelete}>
            Delete Proposal
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProposal;
