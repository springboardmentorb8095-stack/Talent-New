import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [proposalStatus, setProposalStatus] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project
        const projectRes = await api.get(`/projects/${id}/`);
        setProject(projectRes.data);

        // Freelancer: check existing proposal + status
        if (user?.role === "freelancer") {
          const proposalsRes = await api.get("/proposals/my/");
          const existing = proposalsRes.data.find(
            (p) => p.project === Number(id)
          );

          if (existing) {
            setAlreadyApplied(true);
            setProposalStatus(existing.status);
          }
        }
      } catch (err) {
        setError("Project not available");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/proposals/create/", {
        project: Number(id),
        cover_letter: coverLetter,
        bid_amount: bidAmount,
      });

      setSuccess("Proposal submitted successfully");
      setAlreadyApplied(true);
      setProposalStatus("pending");
      setCoverLetter("");
      setBidAmount("");
    } catch (err) {
      if (err.response?.status === 403) {
        setError(
          "This project has already been assigned to another freelancer."
        );
        setAlreadyApplied(true);
        setProposalStatus("closed");
      } else if (err.response?.status === 400) {
        setError(
          err.response.data?.detail ||
            "You have already applied to this project."
        );
        setAlreadyApplied(true);
      } else {
        setError("Failed to submit proposal");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!project) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl">
      <h2 className="text-2xl font-bold">{project.title}</h2>

      <p className="mt-2 text-gray-600">{project.description}</p>

      <div className="mt-4 text-sm text-gray-500 space-y-1">
        <p>💰 Budget: {project.budget}</p>
        <p>⏱ Duration: {project.duration}</p>
        <p>🛠 Skills: {project.required_skills}</p>
        <p>👤 Client: {project.client_username}</p>
      </div>

      {/* ---------------- FREELANCER SECTION ---------------- */}
      {user?.role === "freelancer" && (
        <div className="mt-8 border-t pt-6">
          {alreadyApplied ? (
            <div className="bg-gray-100 p-4 rounded">
              <p className="font-semibold">
                You have already applied to this project.
              </p>
              {proposalStatus && (
                <p className="mt-1 text-sm">
                  Status:{" "}
                  <span className="capitalize font-medium">
                    {proposalStatus}
                  </span>
                </p>
              )}
            </div>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-4">
                Apply for this Project
              </h3>

              {error && (
                <p className="text-red-500 mb-3">{error}</p>
              )}
              {success && (
                <p className="text-green-600 mb-3">{success}</p>
              )}

              <form onSubmit={handleApply} className="space-y-4">
                <textarea
                  placeholder="Cover Letter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />

                <input
                  type="number"
                  placeholder="Your Bid Amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />

                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded"
                >
                  Submit Proposal
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
