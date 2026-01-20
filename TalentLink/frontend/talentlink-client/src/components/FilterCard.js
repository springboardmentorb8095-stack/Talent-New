// import React from "react";
import { useEffect, useState } from "react";


const SKILLS = [
  "HTML",
  "CSS",
  "JavaScript",
  "Python",
  "Java",
  "Django"
];


function FilterCard({
  selectedSkills,
  setSelectedSkills,
  minBudget,
  setMinBudget,
  maxBudget,
  setMaxBudget,
  clearFilters,
}) {
  const [isCentered, setIsCentered] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 120) {
      setIsCentered(true);
    } else {
      setIsCentered(false);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
<div className={`filter-card ${isCentered ? "centered" : "initial"}`}>

      <h3>Filters</h3>

      {/* ===== SKILLS ===== */}
      <h4>Skills</h4>
      {SKILLS.map((skill) => (
        <label key={skill} className="filter-checkbox">
          <input
            type="checkbox"
            checked={selectedSkills.includes(skill)}
            onChange={() => toggleSkill(skill)}
          />{" "}
          {skill}
        </label>
      ))}

      {/* ===== BUDGET ===== */}
      <h4 style={{ marginTop: "16px" }}>Budget</h4>

      <input
        type="number"
        placeholder="Min"
        value={minBudget}
        style={{ marginBottom: "10px", height: "28px", width: "100%" }}
        onChange={(e) => setMinBudget(e.target.value)}
      />

      <input
        type="number"
        placeholder="Max"
        value={maxBudget}
        style={{ height: "28px", width: "100%" }}
        onChange={(e) => setMaxBudget(e.target.value)}
      />

      <button
        className="secondary-btn"
        style={{ marginTop: "20px", width: "100%" }}
        onClick={clearFilters}
      >
        Clear Filters
      </button>
    </div>
  );
}

export default FilterCard;
