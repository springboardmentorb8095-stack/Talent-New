
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/auth";
import FilterCard from "../components/FilterCard";

function ProjectsList({ setSelectedProject, setPage, searchTerm }) {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/projects/",
        getAuthHeaders()
      );
      setProjects(res.data);
    } catch {
      setError("Failed to load projects");
    }
  };

  /* ================= FILTER LOGIC ================= */
  const filteredProjects = projects.filter((project) => {
    // 🔍 Search
    const matchSearch = project.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    // 🧠 Skills (from backend: required_skills)
    const projectSkills = project.required_skills
      ? project.required_skills.split(",").map((s) => s.trim().toLowerCase())
      : [];

    const matchSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) =>
        projectSkills.includes(skill.toLowerCase())
      );

    // 💰 Budget
    const matchMin = minBudget
      ? Number(project.budget) >= Number(minBudget)
      : true;

    const matchMax = maxBudget
      ? Number(project.budget) <= Number(maxBudget)
      : true;

    return matchSearch && matchSkills && matchMin && matchMax;
  });

  const clearFilters = () => {
    setSelectedSkills([]);
    setMinBudget("");
    setMaxBudget("");
  };

  return (
    <div className="projects-container">
      {/* ===== WELCOME ===== */}
      <div className="welcome-card">
        <h1 className="welcome-title">
          Welcome to TalentLink, {localStorage.getItem("username")} 👋
        </h1>
        <p className="welcome-subtitle">
          Find projects that match your skills and start collaborating today.
        </p>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      {/* <div
        style={{
          display: "flex",
          gap: "24px",
          marginTop: "20px",
          alignItems: "flex-start",
        }}
      > */}
        <div className="projects-layout" style={{ marginTop: "20px" }}>

        {/* ===== PROJECT LIST ===== */}
        <div style={{ flex: 3 }}>

          {error && <p className="error">{error}</p>}

          {/* {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => {
                setSelectedProject(project.id);
                setPage("project-detail");
              }}
            >
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>

              {project.required_skills && (
                <div style={{ marginTop: "10px" }}>
                  {project.required_skills.split(",").map((skill, idx) => (
                    <span key={idx} className="skill-chip">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="project-footer">
                <span>
                  💰 {project.budget} {project.currency}
                </span>
                <span>
                  👤 Posted by <b>{project.client_username || "Client"}</b>
                </span>
              </div>
            </div>
          ))} */}

          {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="project-card"
                  onClick={() => {
                    setSelectedProject(project.id);
                    setPage("project-detail");
                  }}
                >
                  {/* ===== TITLE + BID INFO ===== */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                    >
                    {/* LEFT */}
                    <h3 className="project-title">{project.title}</h3>

                    

                    {/* RIGHT */}
                    <div>
                      {project.bid_count > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            gap: "24px",
                            alignItems: "flex-start",
                          }}
                        >
                          {/* LEFT: BID COUNT */}
                          <div style={{ fontWeight: 600 ,paddingTop:"14px"}}>
                            {project.bid_count} bids
                          </div>

                          {/* RIGHT: AVERAGE BID */}
                          <div style={{ textAlign: "right" }}>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#64748b",
                              }}
                            >
                              average bid
                            </div>

                            <div
                              style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "#22c55e",
                              }}
                            >
                              {project.currency === "EUR" ? "€" : "₹"}
                              {project.average_bid}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                          No bids yet
                        </div>
                      )}
                    </div>

                  </div>

                  {/* DESCRIPTION */}
                  <p className="project-desc">{project.description}</p>

                  {/* SKILLS */}
                  {project.required_skills && (
                    <div style={{ marginTop: "10px" }}>
                      {project.required_skills.split(",").map((skill, idx) => (
                        <span key={idx} className="skill-chip">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* FOOTER */}
                  <div className="project-footer">
                    <span>
                      💰 {project.budget} {project.currency}
                    </span>
                    <span>
                      👤 Posted by <b>{project.client_username || "Client"}</b>
                    </span>
                  </div>
                  <div
                        style={{
                          marginTop: "6px",
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                          fontSize: "14px",
                        }}
                      >
                        {project.rating ? (
                          <>
                            <span style={{ color: "#f43f5e" }}>★★★★★</span>
                            <span style={{ fontWeight: 600 }}>{project.rating}</span>
                            <span style={{ color: "#64748b" }}>
                              💬 {project.review_count || 0}
                            </span>
                          </>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>No reviews</span>
                        )}
                      </div>
                </div>
              ))}


          {filteredProjects.length === 0 && (
            <p className="error">No projects match your filters</p>
          )}
        </div>

        {/* ===== FILTER CARD ===== */}
        <div style={{ flex: 1 }}>
          <FilterCard
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            minBudget={minBudget}
            setMinBudget={setMinBudget}
            maxBudget={maxBudget}
            setMaxBudget={setMaxBudget}
            clearFilters={clearFilters}
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectsList;
