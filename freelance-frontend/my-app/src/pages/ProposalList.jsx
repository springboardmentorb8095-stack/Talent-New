import axios from "../services/api";

export default function ProposalList({ proposals }) {

  const updateStatus = (id, status) => {
    axios.patch(`/proposals/${id}/`, { status })
      .then(() => alert(`Proposal ${status}`));
  };

  return (
    <div>
      <h3>Proposals</h3>
      {proposals.map(p => (
        <div key={p.id}>
          <p>{p.cover_letter}</p>
          <p>₹{p.bid_amount}</p>
          <button onClick={() => updateStatus(p.id, "accepted")}>Accept</button>
          <button onClick={() => updateStatus(p.id, "rejected")}>Reject</button>
        </div>
      ))}
    </div>
  );
}
