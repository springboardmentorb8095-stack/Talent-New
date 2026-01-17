// import { useState } from "react";
// import { useParams } from "react-router-dom";

// function LeaveReview() {
//   const { contractId } = useParams();

//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");

//   return (
//     <div style={{ padding: "30px", maxWidth: "500px" }}>
//       <h2>Leave a Review</h2>

//       <p>
//         <strong>Contract ID:</strong> {contractId}
//       </p>

//       {/* ⭐ Rating */}
//       <div style={{ marginTop: "15px" }}>
//         <label>
//           Rating:
//           <select
//             value={rating}
//             onChange={(e) => setRating(e.target.value)}
//             style={{ marginLeft: "10px" }}
//           >
//             <option value="1">1 ⭐</option>
//             <option value="2">2 ⭐⭐</option>
//             <option value="3">3 ⭐⭐⭐</option>
//             <option value="4">4 ⭐⭐⭐⭐</option>
//             <option value="5">5 ⭐⭐⭐⭐⭐</option>
//           </select>
//         </label>
//       </div>

//       {/* 📝 Comment */}
//       <div style={{ marginTop: "15px" }}>
//         <textarea
//           placeholder="Write your review..."
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           rows="4"
//           style={{ width: "100%" }}
//         />
//       </div>

//       {/* 🚀 Submit */}
//       <button
//         style={{
//           marginTop: "20px",
//           padding: "8px 16px",
//           backgroundColor: "#2563eb",
//           color: "#fff",
//           border: "none",
//           borderRadius: "4px",
//           cursor: "pointer",
//         }}
//       >
//         Submit Review
//       </button>
//     </div>
//   );
// }

// export default LeaveReview;
// import { useEffect, useState } from "react";
// import { useParams} from "react-router-dom";
// import axios from "axios";

// function LeaveReview() {
//   const { contractId } = useParams();
// //   const navigate = useNavigate();

//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [contract, setContract] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("accessToken");
// //   const role = localStorage.getItem("role");

//   // 🔹 Fetch contract details
//   useEffect(() => {
//     const fetchContract = async () => {
//       try {
//         const res = await axios.get(
//           "http://127.0.0.1:8000/api/contracts/my/",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const found = res.data.find(
//           (c) => String(c.id) === String(contractId)
//         );

//         setContract(found);
//       } catch (err) {
//         console.error("Error fetching contract", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContract();
//   }, [contractId, token]);

//   // ⏳ Loading
//   if (loading) {
//     return <p style={{ padding: "20px" }}>Loading...</p>;
//   }

//   if (!contract) {
//     return <p style={{ padding: "20px" }}>Contract not found</p>;
//   }

//   return (
//     <div style={{ padding: "30px", maxWidth: "500px" }}>
//       <h2>Leave a Review</h2>

//       <p>
//         <strong>Contract ID:</strong> {contractId}
//       </p>

//       {/* ⭐ Rating */}
//       <div style={{ marginTop: "15px" }}>
//         <label>
//           Rating:
//           <select
//             value={rating}
//             onChange={(e) => setRating(e.target.value)}
//             style={{ marginLeft: "10px" }}
//           >
//             <option value="1">1 ⭐</option>
//             <option value="2">2 ⭐⭐</option>
//             <option value="3">3 ⭐⭐⭐</option>
//             <option value="4">4 ⭐⭐⭐⭐</option>
//             <option value="5">5 ⭐⭐⭐⭐⭐</option>
//           </select>
//         </label>
//       </div>

//       {/* 📝 Comment */}
//       <div style={{ marginTop: "15px" }}>
//         <textarea
//           placeholder="Write your review..."
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           rows="4"
//           style={{ width: "100%" }}
//         />
//       </div>

//       {/* 🚀 Submit (next step will activate this) */}
//       <button
//         style={{
//           marginTop: "20px",
//           padding: "8px 16px",
//           backgroundColor: "#2563eb",
//           color: "#fff",
//           border: "none",
//           borderRadius: "4px",
//           cursor: "pointer",
//         }}
//         disabled
//       >
//         Submit Review
//       </button>
//     </div>
//   );
// }

// export default LeaveReview;

// 17 jan

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./LeaveReview.css";   // ✅ ADDED

// function LeaveReview() {
//   const { contractId } = useParams();
//   const navigate = useNavigate();

//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [contract, setContract] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const token = localStorage.getItem("accessToken");
//   const role = localStorage.getItem("role");

//   // 🔹 Fetch contract details
//   useEffect(() => {
//     const fetchContract = async () => {
//       try {
//         const res = await axios.get(
//           "http://127.0.0.1:8000/api/contracts/my/",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const found = res.data.find(
//           (c) => String(c.id) === String(contractId)
//         );

//         setContract(found);

//         console.log("CONTRACT OBJECT:", found);
//       } catch (err) {
//         console.error("Error fetching contract", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContract();
//   }, [contractId, token]);

//   // 🚀 SUBMIT REVIEW
//   const submitReview = async () => {
//     if (!comment.trim()) {
//       alert("Please write a comment");
//       return;
//     }

//     const reviewedUser =
//       role === "client"
//         ? contract.freelancer
//         : contract.client;

//     try {
//       setSubmitting(true);

//       await axios.post(
//         "http://127.0.0.1:8000/api/reviews/create/",
//         {
//           project: contract.project,
//           reviewed_user: reviewedUser,
//           rating: rating,
//           comment: comment,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("Review submitted successfully 🎉");
//       navigate("/contracts");
//     } catch (err) {
//       console.error("Review submission failed", err);
//       alert(
//         err.response?.data?.error ||
//         "Failed to submit review"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return <p className="loading">Loading...</p>;
//   }

//   if (!contract) {
//     return <p className="loading">Contract not found</p>;
//   }

//   return (
//     <div className="leave-review-container">
//       <h2>Leave a Review</h2>

//       <p className="review-project">
//         Project: <strong>{contract.project_title}</strong>
//       </p>

//       <div className="review-field">
//         <label>Rating</label>
//         <select
//           value={rating}
//           onChange={(e) => setRating(Number(e.target.value))}
//         >
//           <option value="1">1 ⭐</option>
//           <option value="2">2 ⭐⭐</option>
//           <option value="3">3 ⭐⭐⭐</option>
//           <option value="4">4 ⭐⭐⭐⭐</option>
//           <option value="5">5 ⭐⭐⭐⭐⭐</option>
//         </select>
//       </div>

//       <div className="review-field">
//         <label>Comment</label>
//         <textarea
//           placeholder="Write your review..."
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//         />
//       </div>

//       <button
//         className="submit-review-btn"
//         onClick={submitReview}
//         disabled={submitting}
//       >
//         {submitting ? "Submitting..." : "Submit Review"}
//       </button>
//     </div>
//   );
// }

// export default LeaveReview;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMyContracts } from "../services/contractService";
import { createReview } from "../services/reviewService";
import "./LeaveReview.css";

function LeaveReview() {
  const { contractId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const role = localStorage.getItem("role");

  // 🔹 Fetch contract details
  useEffect(() => {
    getMyContracts()
      .then((res) => {
        const found = res.data.find(
          (c) => String(c.id) === String(contractId)
        );
        setContract(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching contract", err);
        setLoading(false);
      });
  }, [contractId]);

  // 🚀 SUBMIT REVIEW
  const submitReview = async () => {
    if (!comment.trim()) {
      alert("Please write a comment");
      return;
    }

    if (!contract) {
      alert("Contract not found");
      return;
    }

    const reviewedUserId =
      role === "client"
        ? contract.freelancer
        : contract.client;

    try {
      setSubmitting(true);

      await createReview(
        contract.project,
        reviewedUserId,
        rating,
        comment
      );

      alert("Review submitted successfully 🎉");
      navigate("/contracts");
    } catch (err) {
      console.error("Review submission failed", err);
      alert(
        err.response?.data?.error ||
        "Failed to submit review"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (!contract) {
    return <p className="loading">Contract not found</p>;
  }

  return (
    <div className="leave-review-container">
      <h2>Leave a Review</h2>

      <p className="review-project">
        Project: <strong>{contract.project_title}</strong>
      </p>

      <div className="review-field">
        <label>Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value="1">1 ⭐</option>
          <option value="2">2 ⭐⭐</option>
          <option value="3">3 ⭐⭐⭐</option>
          <option value="4">4 ⭐⭐⭐⭐</option>
          <option value="5">5 ⭐⭐⭐⭐⭐</option>
        </select>
      </div>

      <div className="review-field">
        <label>Comment</label>
        <textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button
        className="submit-review-btn"
        onClick={submitReview}
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}

export default LeaveReview;

