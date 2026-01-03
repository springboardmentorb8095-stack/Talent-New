import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

/* ---------------- Proposal Form ---------------- */
function ProposalForm({ projectId, onProposalSubmitted }) {
  const [message, setMessage] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/proposals/", {
        project: projectId,
        message,
        bid_amount: bidAmount,
      });

      setMessage("");
      setBidAmount("");
      onProposalSubmitted(res.data);
      alert("Proposal submitted successfully!");
    } catch (err) {
      console.error(err);
      setError("Login as freelancer to submit proposal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <h3>Submit Proposal</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="number"
        placeholder="Bid Amount"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        required
      />

      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />

      <button disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

/* ---------------- Project Detail ---------------- */
export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch project (PUBLIC)
    API.get(`/projects/detail/${id}/`)
      .then((res) => setProject(res.data))
      .catch(() => setError("Project not found"));

    // Fetch proposals for this project
    API.get(`/projects/${id}/proposals/`)
      .then((res) => setProposals(res.data))
      .catch(() => console.log("No proposals yet"));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!project) return <p>Loading...</p>;

  return (
    <div>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <p>Budget: ₹{project.budget}</p>

      <ProposalForm
        projectId={id}
        onProposalSubmitted={(p) => setProposals([...proposals, p])}
      />

      <h3>Proposals</h3>
      {proposals.length === 0 && <p>No proposals yet.</p>}
      <ul>
        {proposals.map((p) => (
          <li key={p.id}>
            ₹{p.bid_amount} — {p.message}
          </li>
        ))}
      </ul>
    </div>
  );
}


