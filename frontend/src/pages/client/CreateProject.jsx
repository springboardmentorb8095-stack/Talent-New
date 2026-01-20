import { useState } from "react";
import { createProject } from "../../api/projects";
import { useNavigate } from "react-router-dom";

function CreateProject() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [skills, setSkills] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createProject({
      title,
      description,
      budget,
      deadline,
      skills_required: skills,
      duration,
    });

    navigate("/client/projects");
  };

  return (
    <div className="page">
    <form onSubmit={handleSubmit} className="form">
      <h2>Create Project</h2>

      <input
        placeholder="Project title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Project description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      
      <input
        type="number"
        placeholder="Budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        required
      />

      <input type="number" placeholder="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} required/>

      <textarea
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="Required skills"
    />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />

      <button type="submit">Create Project</button>
    </form>
    </div>
  );
}

export default CreateProject;
