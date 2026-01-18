import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects/");
        setProjects(res.data);
      } catch (err) {
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (projectId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/projects/${projectId}/`);
      setProjects((prev) =>
        prev.filter((project) => project.id !== projectId)
      );
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>

        {user?.role === "client" && (
          <Link
            to="/projects/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            + Create Project
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500">No projects available.</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-5 rounded shadow"
            >
              <h3 className="text-xl font-semibold">{project.title}</h3>

              <p className="text-gray-600 mt-1">
                {project.description}
              </p>

              <div className="mt-3 text-sm text-gray-500">
                <span className="mr-4">💰 {project.budget}</span>
                <span className="mr-4">⏱ {project.duration}</span>
                <span>🛠 {project.required_skills}</span>
              </div>

              <div className="mt-4 flex gap-4">
                {/* CLIENT ACTIONS */}
                {user?.role === "client" && (
                  <>
                    <Link
                      to={`/projects/${project.id}/edit`}
                      className="text-blue-600"
                    >
                      Edit
                    </Link>

                    <Link
                      to={`/projects/${project.id}/proposals`}
                      className="text-indigo-600"
                    >
                      View Proposals
                    </Link>

                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}

                {/* FREELANCER ACTION */}
                {user?.role === "freelancer" && (
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-indigo-600 font-medium"
                  >
                    View / Apply
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
