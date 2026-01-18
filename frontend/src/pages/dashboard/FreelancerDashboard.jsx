export default function FreelancerDashboard() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Projects</p>
          <p className="text-3xl font-bold">457</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Completed</p>
          <p className="text-3xl font-bold">450</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Earnings</p>
          <p className="text-3xl font-bold">$15,500</p>
        </div>
      </div>
    </>
  );
}
