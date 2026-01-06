// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { getAuthHeaders } from "../utils/auth";
// import { getUserProfile } from "../utils/user";

// function ProjectDetail({ projectId, setPage }) {
//   const [project, setProject] = useState(null);
//   const [role, setRole] = useState("");
//   const [error, setError] = useState("");
//   const [myProposal, setMyProposal] = useState(null);

//   const fetchProject = async () => {
//     try {
//       const res = await axios.get(
//         `http://127.0.0.1:8000/api/projects/${projectId}/`,
//         getAuthHeaders()
//       );
//       setProject(res.data);
//     } catch {
//       setError("Failed to load project details");
//     }
//   };

//   const fetchUserRole = async () => {
//     try {
//       const profile = await getUserProfile();
//       setRole(profile.role);
//     } catch {
//       setRole("");
//     }
//   };


//   const fetchMyProposal = async () => {
//     try {
//       const res = await axios.get(
//         `http://127.0.0.1:8000/api/proposals/my-proposal/${projectId}/`,
//         getAuthHeaders()
//       );
//       setMyProposal(res.data);
//     } catch {
//       setMyProposal(null);
//     }
//   };

 
//   useEffect(() => {
//     if (projectId) {
//       fetchProject();
//       fetchUserRole();
//     }
//   }, [projectId]);


//   useEffect(() => {
//     if (role === "freelancer") {
//       fetchMyProposal();
//     }
//   }, [role]);

 
//   if (error) {
//     return (
//       <div className="projects-container">
//         <p className="error">{error}</p>
//         <button className="primary-btn" onClick={() => setPage("projects")}>
//           Back to Projects
//         </button>
//       </div>
//     );
//   }


//   if (!project) {
//     return (
//       <div className="projects-container">
//         <p>Loading project details...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="projects-container">
//       <div className="project-detail-card">
//         <h2 className="project-detail-title">{project.title}</h2>

//         <p className="project-detail-text">{project.description}</p>

//         {project.budget && (
//           <p className="project-budget">
//             <b>Budget:</b> {project.budget} {project.currency}
//           </p>
//         )}

        
//         <div
//           style={{
//             marginTop: "30px",
//             display: "flex",
//             gap: "12px",
//             flexWrap: "wrap",
//           }}
//         >
      
//           <button className="primary-btn" onClick={() => setPage("projects")}>
//             Back to Projects
//           </button>

          
//           {role === "freelancer" && !myProposal && (
//             <button
//               className="primary-btn"
//               onClick={() => setPage("submit-proposal")}
//             >
//               Submit Proposal
//             </button>
//           )}

//           {role === "freelancer" && myProposal && (
//             <button className="primary-btn" disabled>
//               Proposal Already Submitted
//             </button>
//           )}

        
//           {role === "client" &&
//             project.client === localStorage.getItem("username") && (
//               <button
//                 className="primary-btn"
//                 onClick={() => setPage("project-proposals")}
//               >
//                 View Proposals
//               </button>
//             )}
//         </div>

      
//         {role === "freelancer" && myProposal && (
//           <p style={{ marginTop: "12px", fontWeight: "bold" ,color:"white"}}>
//             Status:&nbsp;
//             <span
//               style={{
//                 color:
//                   myProposal.status === "accepted"
//                     ? "#22c55e"
//                     : myProposal.status === "rejected"
//                     ? "#ef4444"
//                     : "#facc15",
//               }}
//             >
//               {myProposal.status.toUpperCase()}
//             </span>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProjectDetail;






import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { getAuthHeaders } from "../utils/auth";
import { getUserProfile } from "../utils/user";

function ProjectDetail({ projectId, setPage }) {
  const [project, setProject] = useState(null);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [myProposal, setMyProposal] = useState(null);

  // EDIT STATE
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    currency: "INR",
  });

  /* ---------------- FETCH PROJECT ---------------- */
  const fetchProject = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/projects/${projectId}/`,
        getAuthHeaders()
      );
      setProject(res.data);
      setFormData({
        title: res.data.title,
        description: res.data.description,
        budget: res.data.budget || "",
        currency: res.data.currency || "INR",
      });
    } catch {
      setError("Failed to load project details");
    }
  };

  /* ---------------- FETCH ROLE ---------------- */
  const fetchUserRole = async () => {
    try {
      const profile = await getUserProfile();
      setRole(profile.role);
    } catch {
      setRole("");
    }
  };

  /* ---------------- FETCH MY PROPOSAL ---------------- */
  const fetchMyProposal = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/proposals/my-proposal/${projectId}/`,
        getAuthHeaders()
      );
      setMyProposal(res.data);
    } catch {
      setMyProposal(null);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchUserRole();
    }
  }, [projectId]);

  useEffect(() => {
    if (role === "freelancer") {
      fetchMyProposal();
    }
  }, [role]);

  /* ---------------- EDIT HANDLERS ---------------- */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/projects/${projectId}/`,
        {
          title: formData.title,
          description: formData.description,
          budget: formData.budget || null,
          currency: formData.currency,
        },
        getAuthHeaders()
      );
      setIsEditing(false);
      fetchProject();
    } catch {
      alert("Failed to update project");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/projects/${projectId}/`,
        getAuthHeaders()
      );
      setPage("projects");
    } catch {
      alert("Failed to delete project");
    }
  };

  /* ---------------- ERROR / LOADING ---------------- */
  if (error) return <p className="error">{error}</p>;
  if (!project) return <p>Loading project...</p>;

  const isOwner =
    role === "client" &&
    project.client === localStorage.getItem("username");

  /* ======================= UI ======================= */
  return (
    <div className="projects-container">
      <div className="project-detail-card" style={{ position: "relative" }}>
        
        {/* ===== EDIT ICON (CLIENT OWNER ONLY) ===== */}
        {isOwner && !isEditing && (
          <FaEdit
            onClick={() => setIsEditing(true)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              cursor: "pointer",
              color: "#60a5fa",   // visible blue
              fontSize: "20px",
            }}
            title="Edit Project"
          />
        )}

        {/* ================= EDIT MODE ================= */}
{isEditing ? (
  <div className="project-detail-card">
    <h2 className="project-detail-title">Edit Project</h2>

    {/* TITLE */}
    <label className="form-label">Project Title *</label>
    <input
      type="text"
      className="form-input"
      name="title"
      value={formData.title}
      onChange={handleChange}
      placeholder="Enter project title"
      required
    />

    {/* DESCRIPTION */}
    <label className="form-label">Project Description *</label>
    <textarea
      className="form-textarea"
      name="description"
      value={formData.description}
      onChange={handleChange}
      placeholder="Describe your project"
      rows="5"
      required
    />

    {/* BUDGET */}
    <label className="form-label">Budget (optional)</label>
    <div className="budget-row">
      <input
        className="form-input"
        type="number"
        name="budget"
        value={formData.budget}
        onChange={handleChange}
        placeholder="Amount"
      />

      <select
        className="form-select"
        name="currency"
        value={formData.currency}
        onChange={handleChange}
      >
        <option value="INR">INR</option>
        <option value="USD">USD</option>
      </select>
    </div>

    {/* ACTION BUTTONS */}
    <div className="form-actions">
      <button className="secondary-btn" onClick={() => setIsEditing(false)}>
        Cancel
      </button>

      <button className="primary-btn" onClick={handleSave}>
        Save
      </button>

      <button className="danger-btn" onClick={handleDelete}>
        Delete
      </button>
    </div>
  </div>
) : (

          /* ================= VIEW MODE ================= */
          <>
            <h2 className="project-detail-title">{project.title}</h2>
            <p className="project-detail-text">{project.description}</p>

            {project.budget && (
              <p className="project-budget">
                <b>Budget:</b> {project.budget} {project.currency}
              </p>
            )}

            <div style={{ marginTop: "25px", display: "flex", gap: "12px" }}>
              <button className="primary-btn" onClick={() => setPage("projects")}>
                Back to Projects
              </button>

              {/* Freelancer */}
              {role === "freelancer" && !myProposal && (
                <button
                  className="primary-btn"
                  onClick={() => setPage("submit-proposal")}
                >
                  Submit Proposal
                </button>
              )}

              {role === "freelancer" && myProposal && (
                <button className="primary-btn" disabled>
                  Proposal Already Submitted
                </button>
              )}

              {/* Client */}
              {isOwner && (
                <button
                  className="primary-btn"
                  onClick={() => setPage("project-proposals")}
                >
                  View Proposals
                </button>
              )}
            </div>

            {/* Proposal Status */}
            {role === "freelancer" && myProposal && (
              <p style={{ marginTop: "12px", fontWeight: "bold", color: "white" }}>
                Status: {myProposal.status.toUpperCase()}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;
