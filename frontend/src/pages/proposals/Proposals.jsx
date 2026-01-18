import { useEffect, useState } from "react";
import api from "../../api/api";

export default function Proposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await api.get("/proposals/my/");
        setProposals(res.data);
      } catch (err) {
        setError("Failed to load proposals");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  if (loading) return <p>Loading proposals...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Proposals</h2>

      {proposals.length === 0 ? (
        <p className="text-gray-500">
          You haven’t applied to any projects yet.
        </p>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white p-5 rounded shadow"
            >
              <h3 className="text-lg font-semibold">
                {proposal.project_title}
              </h3>

              <p className="mt-2 text-gray-600">
                {proposal.cover_letter}
              </p>

              <div className="mt-3 text-sm text-gray-500">
                <p>💰 Bid: {proposal.bid_amount}</p>
                <p>
                  Status:{" "}
                  <span className="capitalize font-medium">
                    {proposal.status}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
