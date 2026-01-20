import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { browseProjects } from "../../api/projects";

function BrowseProjects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  const fetchProjects = async () => {
    let query = [];
    if (search) query.push(`search=${search}`);
    if (maxBudget) query.push(`budget__lte=${maxBudget}`);
    const queryString = query.length ? `?${query.join("&")}` : "";
    const res = await browseProjects(queryString);
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const projectsData = projects.results || projects;

  return (
    <div className="page" style={{ maxWidth: "1000px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 className="page-title">Browse Projects</h2>
        <div style={{ 
          display: "flex", 
          gap: "12px", 
          flexWrap: "wrap",
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <input 
            placeholder="Search skills or title" 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            style={{ flex: "1", minWidth: "200px" }}
          />
          <input 
            placeholder="Max budget" 
            type="number" 
            value={maxBudget} 
            onChange={e => setMaxBudget(e.target.value)}
            style={{ width: "150px" }}
          />
          <button onClick={fetchProjects}>Filter</button>
        </div>
      </div>

      {projectsData.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"></div>
          <p>No projects found</p>
        </div>
      ) : (
        <div>
          {projectsData.map(p => (
            <div key={p.id} className="list-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <h4 style={{ margin: 0, fontSize: "18px", color: "#111827" }}>{p.title}</h4>
                {p.submitted && (
                  <span style={{ 
                    padding: "4px 12px", 
                    background: "#dbeafe", 
                    color: "#1e40af", 
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "500"
                  }}>Submitted</span>
                )}
              </div>
              <p style={{ color: "#6b7280", marginBottom: "12px", lineHeight: "1.6" }}>
                {p.description}
              </p>
              <div style={{ display: "flex", gap: "20px", marginBottom: "12px", fontSize: "14px", color: "#4b5563" }}>
                <span>Duration: {parseFloat(p.budget).toLocaleString()}</span>
                <span>Duration: {p.duration} days</span>
              </div>
              {p.skills_required && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                  {p.skills_required.split(",").slice(0, 4).map((skill, i) => (
                    <span key={i} style={{
                      padding: "4px 10px",
                      background: "#eff6ff",
                      color: "#1e40af",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "500"
                    }}>
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}
              <Link 
                to={p.submitted ? `/freelancer/projects/${p.id}` : `/freelancer/projects/${p.id}/apply`}
                style={{
                  display: "inline-block",
                  padding: "8px 16px",
                  background: p.submitted ? "#f3f4f6" : "#4f46e5",
                  color: p.submitted ? "#6b7280" : "white",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "14px"
                }}
              >
                {p.submitted ? "View Proposal" : "Submit Proposal"}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseProjects;




// import { useEffect, useState } from "react";
// import { browseProjects } from "../../api/projects";

// function BrowseProjects() {
//   const [projects, setProjects] = useState([]);

//   useEffect(() => {
//     browseProjects().then(res => setProjects(res.data));
//   }, []);

//   return (
//     <div className="page">
//       <h2>Browse Projects</h2>

//       {projects.map(p => (
//         <div key={p.id}
//         // style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
//         className="list-card">
//           <h4>{p.title}</h4>
//           <p>Desc: {p.description}<br/>Budget: {p.budget}<br/>Skills: {p.skills_required}<br/>Duration: {p.duration}</p>
//           <Link to={`/freelancer/projects/${p.id}/apply`}>
//             Submit Proposal
//           </Link>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default BrowseProjects;
