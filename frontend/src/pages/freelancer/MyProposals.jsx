import { useEffect, useState } from "react";
import { getMyProposals } from "../../api/proposals";

function MyProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProposals()
      .then(res => {
        const data = res.data.results || [];
        setProposals(Array.isArray(data) ? data : []);
        console.log("Data");
        console.log(data);
      })
      .catch(err => {
        console.error("Failed to load proposals", err);
        setProposals([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <h2>My Proposals</h2>

      {proposals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"></div>
          <p>No proposals yet</p>
        </div>
      ) : (
        proposals.map(p => (
        <div key={p.id} className="list-card">
          <p>Title: {p.project_data.title}</p>
          <p>Description: {p.project_data.description}</p>
          <p>Budget: {p.project_data.budget}</p>
          <p>Your Budget: {p.proposed_price}</p>
          <p>{p.message}</p>
          <b>Status: {p.status}</b>
        </div>
        ))
      )}
    </div>
  );
}

export default MyProposals;
