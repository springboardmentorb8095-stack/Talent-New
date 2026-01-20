import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get(`/contracts/${id}/`)
      .then(res => setContract(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const submitReview = async () => {
    try {
      await axiosInstance.post(`/reviews/`, {
        contract: id,
        rating,
        comment
      });
      navigate(`/contracts/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!contract) return <p>Not found</p>;
  if (contract.review) return <p>Review already submitted.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Leave Review for Contract #{id}</h2>

      <label>Rating (1–5):</label><br/>
      <select value={rating} onChange={e => setRating(e.target.value)}>
        {[1,2,3,4,5].map(n => <option key={n}>{n}</option>)}
      </select>

      <br/><br/>

      <label>Comment:</label><br/>
      <textarea
        rows={4}
        style={{ width: "300px" }}
        value={comment}
        onChange={e => setComment(e.target.value)}
      />

      <br/><br/>

      <button onClick={submitReview}>Submit Review</button>
    </div>
  );
}
