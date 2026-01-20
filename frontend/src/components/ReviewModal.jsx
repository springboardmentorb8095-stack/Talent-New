import { useState } from "react";

export default function ReviewModal({ onSubmit, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onSubmit({ rating, comment });
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999
    }}>
      <div style={{
        background: "white",
        padding: 20,
        borderRadius: 8,
        width: "350px"
      }}>
        <h3>Submit Review</h3>

        <label>Rating (1-5)</label><br />
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
        /><br /><br />

        <label>Comment</label><br />
        <textarea
          rows="4"
          style={{ width: "100%" }}
          value={comment}
          onChange={e => setComment(e.target.value)}
        /><br /><br />

        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
      </div>
    </div>
  );
}
