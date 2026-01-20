import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { getMyContracts } from "../../api/contracts";
import { createReview, getReviewForContract } from "../../api/review";
import ReviewModal from "../../components/ReviewModal";

export default function ContractList({ onOpenChat }) {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [completedContractId, setCompletedContractId] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [reviewData, setReviewData] = useState(null);
  const [showViewReview, setShowViewReview] = useState(false);

  const handleViewReview = async (contractId) => {
    try {
      const res = await getReviewForContract(contractId);
      console.log(res);
      setReviewData(res.data);
      setShowViewReview(true);
    } catch (err) {
      alert("No review found for this contract yet.");
    }
  };


  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      const res = await getMyContracts();
      setContracts(res.data.contracts ?? res.data.results ?? []);
    } catch (err) {
      console.error(err);
      setContracts([]);
    }
  };


  const handleComplete = async (contractId) => {
    setUpdating(true);
    try {
      // Update contract status
      await axiosInstance.patch(`/contracts/${contractId}/status/`, { status: "completed" });

      // Update UI locally
      setContracts(prev =>
        prev.map(c =>
          c.id === contractId ? { ...c, status: "completed" } : c
        )
      );

      // Show review modal only for client
      if (user.role === "client") {
        setCompletedContractId(contractId);
        setShowReview(true);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmitReview = async (data) => {
    try {
      await createReview(completedContractId, data);
      alert("Review submitted!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit review");
    } finally {
      setShowReview(false);
      setCompletedContractId(null);
    }
  };

  return (
    <div style={{
      width: "280px",
      borderRight: "1px solid #ddd",
      padding: "10px",
      overflowY: "auto"
    }}>
      <h3>Contracts</h3>

      {contracts.length === 0 && <p>No contracts yet.</p>}

      {contracts.map(c => (
        <div key={c.id}
          style={{
            marginBottom: "10px",
            padding: "8px",
            border: "1px solid #eee",
            borderRadius: "6px"
          }}
        >
          <strong>{c.project_title}</strong><br />
          <small>Status: {c.status}</small><br />

          <button style={{ marginTop: "6px" }} onClick={() => onOpenChat(c.id)}>
            Open Chat
          </button>

          {user.role === "client" && c.status === "active" && (
            <button
              disabled={updating}
              style={{
                marginTop: "6px",
                background: "#4caf50",
                color: "white",
                opacity: updating ? 0.7 : 1
              }}
              onClick={() => handleComplete(c.id)}
            >
              {updating ? "Updating..." : "Mark Completed"}
            </button>
          )}

          {user.role === "freelancer" && c.status === "completed" && c.has_review && (
            <button
              style={{ marginTop: "6px", background: "#2196f3", color: "white" }}
              onClick={() => handleViewReview(c.id)}
            >
              View Review
            </button>
          )}
        </div>
      ))}



      {showViewReview && reviewData && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 12px rgba(0,0,0,0.2)",
          zIndex: 9999,
          width: "320px"
        }}>
          <h4>Client Review</h4>
          <p><strong>Rating:</strong> ⭐ {reviewData.rating}/5</p>
          <p><strong>Message:</strong> {reviewData.comment}</p>
          <p><small><strong>Date:</strong> {reviewData.created_at}</small></p>

          <button
            style={{ marginTop: "10px" }}
            onClick={() => setShowViewReview(false)}
          >
            Close
          </button>
        </div>
      )}


      {/* {showReview && (
        <ReviewModal
          onSubmit={handleSubmitReview}
          onClose={() => setShowReview(false)}
        />
      )} */}
    </div>
  );
}
