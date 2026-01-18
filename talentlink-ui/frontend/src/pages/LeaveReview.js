import { useState } from "react";
import API from "../services/api";

function LeaveReview({ setPage }) {
  const contractId = localStorage.getItem("reviewContractId");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    try {
      setLoading(true);

      await API.post("reviews/", {
        contract: contractId,
        rating,
        comment,
      });

      alert("Review submitted successfully ⭐");
      localStorage.removeItem("reviewContractId");
      setPage("contracts");
    } catch (err) {
      alert(
        err.response?.data?.error ||
          "Failed to submit review"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <div className="content">
        <div className="section-card">
          <h2>⭐ Leave a Review</h2>

          <label>Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 && "s"}
              </option>
            ))}
          </select>

          <label>Comment</label>
          <textarea
            placeholder="Share your experience"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
          />

          <div className="action-row">
            <button
              className="primary"
              onClick={submitReview}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>

            <button
              className="secondary"
              onClick={() => setPage("contracts")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveReview;
