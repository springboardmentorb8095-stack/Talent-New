import { useEffect, useState } from "react";
import API from "../services/api";

function SubmitProposal({ projectId, setPage }) {
  const [project, setProject] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ================= LOAD PROJECT ================= */
  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await API.get(`projects/${projectId}/`);
        setProject(res.data);
      } catch {
        alert("Failed to load project details");
        setPage("dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, setPage]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!coverLetter.trim()) {
      alert("Cover letter is required");
      return;
    }

    if (!bidAmount || Number(bidAmount) <= 0) {
      alert("Please enter a valid bid amount");
      return;
    }

    try {
      setSubmitting(true);

      await API.post("proposals/", {
        project: projectId,
        cover_letter: coverLetter.trim(),
        bid_amount: bidAmount,
      });

      alert("✅ Proposal submitted successfully");
      setPage("my-proposals");
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          "Failed to submit proposal"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading project...</div>;
  }

  if (!project) return null;

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        {/* ================= HEADER ================= */}
        <header className="dashboard-topbar">
          <div>
            <h2>Submit Proposal</h2>
            <p className="muted">
              Apply confidently — clients see quality, not quantity
            </p>
          </div>

          <button
            className="secondary-btn"
            onClick={() => setPage("project-details")}
          >
            ← Back to Project
          </button>
        </header>

        {/* ================= MAIN CARD ================= */}
        <div
          className="card fade"
          style={{ maxWidth: "1100px", margin: "auto" }}
        >
          {/* ================= PROJECT SUMMARY ================= */}
          <div
            style={{
              paddingBottom: 24,
              borderBottom: "1px solid var(--border-glass)",
              marginBottom: 32,
            }}
          >
            <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>
              {project.title}
            </h1>

            <p className="muted" style={{ lineHeight: 1.6 }}>
              {project.description.length > 200
                ? project.description.slice(0, 200) + "..."
                : project.description}
            </p>

            <div
              style={{
                display: "flex",
                gap: 24,
                marginTop: 16,
                flexWrap: "wrap",
              }}
            >
              <span>💰 Budget: ₹{project.budget_min} – ₹{project.budget_max}</span>
              <span>⏳ Duration: {project.duration || "Not specified"}</span>
            </div>
          </div>

          {/* ================= FORM ================= */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 420px",
              gap: 40,
            }}
          >
            {/* ===== LEFT: COVER LETTER ===== */}
            <div>
              <h3>✍️ Cover Letter</h3>
              <p className="muted" style={{ marginBottom: 12 }}>
                Explain why you’re the best fit. Be specific and professional.
              </p>

              <textarea
                rows={10}
                placeholder="Describe your experience, approach, timeline, and why the client should choose you."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                maxLength={2000}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 6,
                }}
              >
                <small className="muted">
                  {coverLetter.length}/2000 characters
                </small>
              </div>
            </div>

            {/* ===== RIGHT: BID PANEL ===== */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-glass)",
                borderRadius: 16,
                padding: 24,
                height: "fit-content",
              }}
            >
              <h3>💰 Your Bid</h3>
              <p className="muted" style={{ marginBottom: 12 }}>
                Enter a competitive amount within the client’s budget.
              </p>

              <input
                type="number"
                placeholder="Bid amount (₹)"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min="1"
              />

              <div
                style={{
                  marginTop: 12,
                  fontSize: 14,
                  color: "var(--text-muted)",
                }}
              >
                Client budget range: ₹{project.budget_min} – ₹{project.budget_max}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginTop: 24,
                }}
              >
                <button
                  className="primary-btn"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Proposal"}
                </button>

                <button
                  className="secondary-btn"
                  onClick={() => setPage("project-details")}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmitProposal;
