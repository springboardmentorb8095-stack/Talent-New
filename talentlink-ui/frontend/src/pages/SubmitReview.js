import { useEffect, useState } from "react";
import API from "../services/api";

function Reviews({ setPage }) {
  const [contracts, setContracts] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedContract, setSelectedContract] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      const res = await API.get("contracts/");
      // only completed contracts
      setContracts(res.data.filter((c) => c.status === "COMPLETED"));
    } catch {
      alert("Failed to load contracts");
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!selectedContract || !comment.trim()) {
      alert("Select contract and write a comment");
      return;
    }

    try {
      await API.post("reviews/", {
        contract: selectedContract,
        rating: rating,
        comment: comment,
      });

      alert("✅ Review submitted");
      setComment("");
      setSelectedContract(null);
      loadContracts();
    } catch (err) {
      alert(
        err.response?.data?.error ||
        "Failed to submit review"
      );
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading reviews...</div>;
  }

  return (
    <div className="app-layout">
      <div className="content">
        <h2>⭐ Reviews</h2>

        {/* ================= CONTRACT LIST ================= */}
        <div className="section-card">
          <h4>Completed Contracts</h4>

          {contracts.length === 0 ? (
            <p className="muted">No completed contracts yet</p>
          ) : (
            contracts.map((c) => (
              <div key={c.id} className="contract-item">
                <p>
                  <strong>Project:</strong> {c.project.title}
                </p>
                <p>
                  <strong>Client:</strong> {c.client.username} |
                  <strong> Freelancer:</strong> {c.freelancer.username}
                </p>

                <button
                  className="secondary"
                  onClick={() => setSelectedContract(c.id)}
                >
                  Review
                </button>
                <hr />
              </div>
            ))
          )}
        </div>

        {/* ================= REVIEW FORM ================= */}
        {selectedContract && (
          <div className="section-card">
            <h4>Submit Review</h4>

            <label>Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value={5}>⭐⭐⭐⭐⭐</option>
              <option value={4}>⭐⭐⭐⭐</option>
              <option value={3}>⭐⭐⭐</option>
              <option value={2}>⭐⭐</option>
              <option value={1}>⭐</option>
            </select>

            <textarea
              placeholder="Write your feedback..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button className="primary" onClick={submitReview}>
              Submit Review
            </button>
          </div>
        )}

        <button className="secondary" onClick={() => setPage("dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Reviews;
