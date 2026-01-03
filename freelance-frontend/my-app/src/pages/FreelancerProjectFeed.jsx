import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

export default function FreelancerProjectFeed() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidData, setBidData] = useState({}); // store bid amount & message for each project

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects/"); // public projects
        setProjects(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (projectId, field, value) => {
    setBidData({
      ...bidData,
      [projectId]: { ...bidData[projectId], [field]: value },
    });
  };

  const handleBid = async (projectId) => {
    const bidAmount = bidData[projectId]?.bidAmount;
    const coverLetter = bidData[projectId]?.coverLetter;

    if (!bidAmount || !coverLetter) {
      toast.error("Please enter bid amount and message.");
      return;
    }

    try {
      await API.post("/proposals/", {
        project: projectId,
        bid_amount: bidAmount,
        cover_letter: coverLetter,
      });

      toast.success("Bid placed successfully!");
      setBidData({ ...bidData, [projectId]: {} });
    } catch (err) {
      console.error(err);
      toast.error("Failed to place bid.");
    }
  };

  if (loading) return <p>Loading projects...</p>;

  return (
    <div style={wrapperStyle}>
      <h2>Available Projects</h2>
      {projects.length === 0 ? (
        <p>No projects available at the moment.</p>
      ) : (
        projects.map((project) => (
          <div key={project.id} style={cardStyle}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p><strong>Budget:</strong> ${project.budget}</p>
            <p><strong>Duration:</strong> {project.duration_days} days</p>

            <input
              type="number"
              placeholder="Bid Amount"
              value={bidData[project.id]?.bidAmount || ""}
              onChange={(e) => handleChange(project.id, "bidAmount", e.target.value)}
              style={inputStyle}
            />
            <textarea
              placeholder="Message / Cover Letter"
              value={bidData[project.id]?.coverLetter || ""}
              onChange={(e) => handleChange(project.id, "coverLetter", e.target.value)}
              style={textareaStyle}
            />
            <button
              onClick={() => handleBid(project.id)}
              style={btnStyle}
            >
              Place Bid
            </button>
          </div>
        ))
      )}
    </div>
  );
}

/* STYLES */
const wrapperStyle = {
  maxWidth: "900px",
  margin: "50px auto",
  padding: "20px",
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "15px",
  marginBottom: "20px",
  background: "#f9fafb",
};

const inputStyle = {
  padding: "8px",
  width: "100%",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const textareaStyle = {
  padding: "8px",
  width: "100%",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  minHeight: "60px",
};

const btnStyle = {
  padding: "10px 20px",
  borderRadius: "6px",
  border: "none",
  background: "#3b82f6",
  color: "#fff",
  cursor: "pointer",
};
