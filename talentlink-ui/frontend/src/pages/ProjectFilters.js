import { useState } from "react";

function ProjectFilters({ onApply }) {
  const [filters, setFilters] = useState({
    skill: "",
    min_budget: "",
    max_budget: "",
    duration: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="section-card">
      <h3>🔍 Filter Projects</h3>

      <input
        name="skill"
        placeholder="Skill (e.g. React)"
        onChange={handleChange}
      />

      <input
        name="min_budget"
        placeholder="Min Budget"
        type="number"
        onChange={handleChange}
      />

      <input
        name="max_budget"
        placeholder="Max Budget"
        type="number"
        onChange={handleChange}
      />

      <input
        name="duration"
        placeholder="Max Duration (days)"
        type="number"
        onChange={handleChange}
      />

      <button onClick={() => onApply(filters)}>Apply Filters</button>
    </div>
  );
}

export default ProjectFilters;
