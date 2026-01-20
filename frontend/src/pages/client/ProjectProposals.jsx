import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectProposals } from "../../api/projects";
import { updateProposalStatus } from "../../api/proposals";

function ProjectProposals() {
  const { projectId } = useParams();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjectProposals(projectId)
      .then((res) => setProposals(res.data.results))
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleAction = async (proposalId, status) => {
    await updateProposalStatus(proposalId, status);

    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId ? { ...p, status } : p
      )
    );
  };

  if (loading) return <p>Loading proposals...</p>;

  return (
    <div className="page">
      <h2>Project Proposals</h2>

      {proposals.length === 0 && <p>No proposals yet.</p>}

      {proposals.map((p) => (
        <div
          key={p.id}
          // style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}
          className="list-card"
        >
          <p><b>Freelancer ID:</b> {p.freelancer}</p>
          <p>{p.message}</p>
          <p>Price: ₹{p.proposed_price}</p>
          <p>Duration: {p.estimated_duration}</p>
          <p>Status: <b>{p.status}</b></p>

          {p.status === "pending" && (
            <>
              <button onClick={() => handleAction(p.id, "accepted")}>
                Accept
              </button>
              &nbsp;&nbsp;
              <button onClick={() => handleAction(p.id, "rejected")}>
                Reject
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProjectProposals;
