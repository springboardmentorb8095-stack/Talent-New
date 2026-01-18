import { useEffect, useState } from "react";
import api from "../../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard/freelancer/");
        setStats(res.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-8">
      {/* PAGE TITLE */}
      <h2 className="text-2xl font-bold">Freelancer Dashboard</h2>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard
          title="Active Contracts"
          value={stats.active_contracts}
          color="bg-indigo-600"
        />

        <DashboardCard
          title="Completed Contracts"
          value={stats.completed_contracts}
          color="bg-green-600"
        />

        <DashboardCard
          title="Total Earnings"
          value={`₹${stats.total_earnings}`}
          color="bg-emerald-600"
        />

        <DashboardCard
          title="Avg Rating"
          value={stats.average_rating}
          color="bg-yellow-500"
        />
      </div>

      {/* PROPOSAL STATS */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">
          Proposal Statistics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <StatItem label="Total" value={stats.total_proposals} />
          <StatItem label="Pending" value={stats.pending_proposals} />
          <StatItem label="Accepted" value={stats.accepted_proposals} />
          <StatItem label="Rejected" value={stats.rejected_proposals} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function DashboardCard({ title, value, color }) {
  return (
    <div
      className={`${color} text-white rounded-lg p-5 shadow`}
    >
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="border rounded p-4 text-center">
      <p className="text-gray-500">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}
