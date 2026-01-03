import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ProjectFeed() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/projects/")
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading projects...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Projects</h2>

      {projects.length === 0 ? (
        <p>No projects available</p>
      ) : (
        projects.map((project) => (
          <div
            key={project.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "6px",
            }}
          >
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <p>
              <strong>Budget:</strong> ₹{project.budget}
            </p>

            <Link to={`/projects/${project.id}`}>
              View Details →
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default ProjectFeed;
