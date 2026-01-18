import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    duration: "",
    required_skills: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}/`);
        setFormData({
          title: res.data.title,
          description: res.data.description,
          budget: res.data.budget,
          duration: res.data.duration,
          required_skills: res.data.required_skills,
        });
      } catch (err) {
        setError("Unable to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.put(`/projects/${id}/`, formData);
      navigate("/projects");
    } catch (err) {
      setError("Failed to update project");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Edit Project</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          name="required_skills"
          value={formData.required_skills}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded"
        >
          Update Project
        </button>
      </form>
    </div>
  );
}
