import { useState } from "react";
import axios from "../services/api";

export default function ProposalForm({ projectId }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  const submitProposal = () => {
    axios.post("/proposals/", {
      project: projectId,
      cover_letter: coverLetter,
      bid_amount: bidAmount
    })
    .then(() => alert("Proposal submitted"))
    .catch(err => console.log(err));
  };

  return (
    <div>
      <h3>Submit Proposal</h3>
      <textarea
        placeholder="Cover Letter"
        onChange={e => setCoverLetter(e.target.value)}
      />
      <input
        type="number"
        placeholder="Bid Amount"
        onChange={e => setBidAmount(e.target.value)}
      />
      <button onClick={submitProposal}>Submit</button>
    </div>
  );
}
