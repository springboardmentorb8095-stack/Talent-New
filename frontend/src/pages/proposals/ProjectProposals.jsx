import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";

export default function ProjectProposals() {
  const { id } = useParams(); // project id
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await api.get(`/proposals/project/${id}/`);
        setProposals(res.data);
      } catch (err) {
        setError("Failed to load proposals");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [id]);

  const handleDecision = async (proposalId, action) => {
    try {
      await api.post(`/proposals/decision/${proposalId}/`, {
        action: action,
      });

      setProposals((prev) =>
        prev.map((p) =>
          p.id === proposalId
            ? { ...p, status: action === "accept" ? "accepted" : "rejected" }
            : action === "accept"
            ? { ...p, status: "rejected" }
            : p
        )
      );
    } catch (err) {
      alert("Failed to process proposal");
    }
  };

  if (loading) return <p>Loading proposals...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Proposals for this Project
      </h2>

      {proposals.length === 0 ? (
        <p className="text-gray-500">No proposals yet.</p>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white p-5 rounded shadow"
            >
              <h3 className="text-lg font-semibold">
                Freelancer: {proposal.freelancer_username}
              </h3>

              <p className="mt-2 text-gray-600">
                {proposal.cover_letter}
              </p>

              <div className="mt-3 text-sm text-gray-500">
                <p>💰 Bid: {proposal.bid_amount}</p>
                <p>Status: {proposal.status}</p>
              </div>

              {/* ACTION BUTTONS */}
              {proposal.status === "pending" && (
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() =>
                      handleDecision(proposal.id, "accept")
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleDecision(proposal.id, "reject")
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}

              {proposal.status !== "pending" && (
                <p className="mt-4 font-semibold capitalize">
                  {proposal.status}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
