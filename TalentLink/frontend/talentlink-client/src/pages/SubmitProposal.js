import React, { useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/auth";

function SubmitProposal({ projectId, setPage }) {
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");
  const [days, setDays] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✅ Frontend validation
    if (!message || !price || !days) {
      setError("All fields are required");
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/projects/${projectId}/proposals/create/`,
        {
          message: message,
          proposed_price: price,
          delivery_time: days,
        },
        getAuthHeaders()
      );

      setSuccess("Proposal submitted successfully!");

      setTimeout(() => {
        setPage("project-detail");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.error || "You are not allowed to submit proposal"
      );
    }
  };

  return (
    <div className="projects-container">
      <div className="project-detail-card">

        <h2 className="project-detail-title">Submit Proposal</h2>

        <form onSubmit={handleSubmit} className="proposal-form">

  <div className="form-group">
    <label className="form-label">Proposal Message *</label>
    <textarea
      className="form-input textarea"
      placeholder="Explain how you will complete this project"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      required
    />
  </div>

  <div className="form-group">
    <label className="form-label">Proposed Price *</label>
    <input
      type="number"
      className="form-input"
      placeholder="Enter your price"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      required
    />
  </div>

  <div className="form-group">
    <label className="form-label">Delivery Time (days) *</label>
    <input
      type="number"
      className="form-input"
      placeholder="Enter number of days"
      value={days}
      onChange={(e) => setDays(e.target.value)}
      required
    />
  </div>

  <div className="form-actions">
    <button type="submit" className="primary-btn">
      Submit Proposal
    </button>

    <button
      type="button"
      className="secondary-btn"
      onClick={() => setPage("project-detail")}
    >
      Back
    </button>
  </div>

</form>


        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}

      </div>
    </div>
  );
}

export default SubmitProposal;
