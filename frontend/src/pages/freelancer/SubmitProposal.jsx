import { useState } from "react";
import { submitProposal } from "../../api/proposals";
import { useParams, useNavigate } from "react-router-dom";

function SubmitProposal() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  // const [estimatedDuration, setEstimatedDuration] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await submitProposal({
      project: projectId,
      cover_letter: message,
      proposed_price: proposedPrice,
      // estimated_duration: "7 days",
    });

    navigate("/freelancer/proposals");
  };

  return (
    <div className="page">
    <form onSubmit={handleSubmit} className="form">
      <h2>Submit Proposal</h2>

      <textarea
        placeholder="Cover message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Proposed price"
        value={proposedPrice}
        onChange={(e) => setProposedPrice(e.target.value)}
        required
      />

      <button type="submit">Submit Proposal</button>
    </form>
    </div>
  );
}

export default SubmitProposal;
