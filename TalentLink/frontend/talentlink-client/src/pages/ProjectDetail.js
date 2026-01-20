// import React, { useEffect, useState } from "react";
import { useEffect, useState, useCallback } from "react";

import axios from "axios";
import { getAuthHeaders } from "../utils/auth";
import { getUserProfile } from "../utils/user";

function ProjectDetail({ projectId, setPage, setChatUserId }) {
  const [project, setProject] = useState(null);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [myProposal, setMyProposal] = useState(null);

  // Only client can fetch accepted proposal from proposal list
  const [acceptedProposal, setAcceptedProposal] = useState(null);
  const proposalDecided = !!acceptedProposal;

  /* ---------------- FETCH PROJECT ---------------- */
const fetchProject = useCallback(async () => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/projects/${projectId}/`,
      getAuthHeaders()
    );
    setProject(res.data);
  } catch {
    setError("Failed to load project details");
  }
}, [projectId]);


  /* ---------------- FETCH ROLE ---------------- */
const fetchUserRole = useCallback(async () => {
  try {
    const profile = await getUserProfile();
    setRole(profile.role);
  } catch {
    setRole("");
  }
}, []);


  /* ---------------- FETCH MY PROPOSAL (FREELANCER) ---------------- */
const fetchMyProposal = useCallback(async () => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/proposals/my-proposal/${projectId}/`,
      getAuthHeaders()
    );
    setMyProposal(res.data);
  } catch {
    setMyProposal(null);
  }
}, [projectId]);


  const canEditProposal =
  role === "freelancer" && myProposal?.status === "pending";

  /* ---------------- FETCH ACCEPTED PROPOSAL (CLIENT ONLY) ---------------- */
const fetchAcceptedProposal = useCallback(async () => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/projects/${projectId}/proposals/list/`,
      getAuthHeaders()
    );

    const accepted = res.data.find(p => p.status === "accepted");
    setAcceptedProposal(accepted || null);
  } catch {
    setAcceptedProposal(null);
  }
}, [projectId]);


  /* ---------------- EFFECTS ---------------- */
useEffect(() => {
  if (projectId) {
    fetchProject();
    fetchUserRole();
  }
}, [projectId, fetchProject, fetchUserRole]);


useEffect(() => {
  if (role === "freelancer") fetchMyProposal();
  if (role === "client") fetchAcceptedProposal();
}, [role, fetchMyProposal, fetchAcceptedProposal]);


  /* ---------------- ERROR / LOADING ---------------- */
  if (error) return <p className="error">{error}</p>;
  if (!project) return <p>Loading project...</p>;

const isProjectOwner =
  role === "client" &&
  project.client_username === localStorage.getItem("username");



  /* ---------------- CHAT VISIBILITY LOGIC ---------------- */
  const showChat =
    (role === "freelancer" && myProposal?.status === "accepted");

  /* ======================= UI ======================= */
  return (
    <div className="projects-container">
      <div className="project-detail-card">
        
        <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 className="project-detail-title">{project.title}</h2>

{isProjectOwner && (
  <button
    className="icon-btn"
    onClick={() => setPage("edit-project")}
    title="Edit Project"
  >
    ✏️
  </button>
)}


            </div>


        <p className="project-detail-text">{project.description}</p>

        {project.budget && (
          <p className="project-budget">
            <b>Budget:</b> {project.budget} {project.currency}
          </p>
        )}

        {/* ACTION BUTTONS */}
        <div style={{ marginTop: "25px", display: "flex", gap: "12px" }}>
          <button className="primary-btn" onClick={() => setPage("projects")}>
            Back to Projects
          </button>

          {/* FREELANCER */}
          {role === "freelancer" && !myProposal && (
            <button
              className="primary-btn"
              onClick={() => setPage("submit-proposal")}
            >
              Submit Proposal
            </button>
          )}

{role === "freelancer" && myProposal && !canEditProposal && (
  <button className="primary-btn" disabled>
    Proposal Already Submitted
  </button>
)}


{canEditProposal && (
  <button
    className="secondary-btn"
    onClick={() => setPage("edit-proposal")}
  >
    Edit Proposal
  </button>
)}


          {/* CLIENT */}
          {isProjectOwner && !proposalDecided && (
  <button
    className="primary-btn"
    onClick={() => setPage("project-proposals")}
  >
    View Proposals
  </button>
)}




          {/* ✅ CHAT BUTTON (FINAL FIX) */}
          {showChat && (
            <button
              className="secondary-btn"
              onClick={() => {
                const otherUserId =
                  role === "client"
                    ? acceptedProposal.freelancer_id   // client → freelancer
                    : project.client_id;               // freelancer → client

                setChatUserId(otherUserId);
                setPage("chat");
              }}
            >
              Chat
            </button>
          )}
        </div>

        {/* STATUS (FREELANCER) */}
        {role === "freelancer" && myProposal && (
          <p style={{ marginTop: "12px", fontWeight: "bold", color: "white" }}>
            Status: {myProposal.status.toUpperCase()}
          </p>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;
