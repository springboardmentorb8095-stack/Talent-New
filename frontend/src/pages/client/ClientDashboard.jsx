import { useEffect, useState } from "react";
import api from "../../api/api";

function StatCard({ title, value, color }) {
  return (
    <div
      className={`rounded-lg p-6 text-white ${color}`}
    >
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default function ClientDashboard() {
  const [projects, setProjects] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, contractsRes, proposalsRes] =
          await Promise.all([
            api.get("/projects/"),
            api.get("/contracts/"),
            api.get("/proposals/project/"), // client proposals
          ]);

        setProjects(projectsRes.data);
        setContracts(contractsRes.data);
        setProposals(proposalsRes.data);
      } catch (err) {
        console.error("Dashboard load failed");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  /* ---------------- CALCULATIONS ---------------- */

  const activeContracts = contracts.filter(
    (c) => c.is_active
  );

  const completedContracts = contracts.filter(
    (c) => !c.is_active
  );

  const totalSpent = completedContracts.reduce(
    (sum, c) => sum + Number(c.bid_amount || 0),
    0
  );

  const pendingProposals = proposals.filter(
    (p) => p.status === "pending"
  );

  const pendingReviews = completedContracts.filter(
    (c) => !c.review_exists
  );

  /* ---------------- UI ---------------- */

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Client Dashboard
      </h2>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Projects"
          value={activeContracts.length}
          color="bg-indigo-600"
        />
        <StatCard
          title="Completed Projects"
          value={completedContracts.length}
          color="bg-green-600"
        />
        <StatCard
          title="Total Spent"
          value={`₹${totalSpent}`}
          color="bg-emerald-600"
        />
        <StatCard
          title="Pending Proposals"
          value={pendingProposals.length}
          color="bg-yellow-500"
        />
      </div>

      {/* ACTIVE CONTRACTS */}
      <div className="bg-white rounded shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">
          Active Contracts
        </h3>

        {activeContracts.length === 0 ? (
          <p className="text-gray-500">
            No active contracts.
          </p>
        ) : (
          <div className="space-y-4">
            {activeContracts.map((c) => (
              <div
                key={c.id}
                className="border rounded p-4"
              >
                <p className="font-medium">
                  {c.project}
                </p>
                <p className="text-sm text-gray-600">
                  Freelancer: {c.freelancer}
                </p>

                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{c.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded"
                      style={{
                        width: `${c.progress}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REVIEWS PENDING */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Pending Reviews
        </h3>

        {pendingReviews.length === 0 ? (
          <p className="text-gray-500">
            No reviews pending 🎉
          </p>
        ) : (
          <div className="space-y-3">
            {pendingReviews.map((c) => (
              <div
                key={c.id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <div>
                  <p className="font-medium">
                    {c.project}
                  </p>
                  <p className="text-sm text-gray-600">
                    Freelancer: {c.freelancer}
                  </p>
                </div>

                <a
                  href={`/reviews?contract=${c.id}`}
                  className="px-4 py-1 bg-indigo-600 text-white rounded"
                >
                  Give Review
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
