import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/auth";
import { getUserProfile } from "../utils/user";
import { FaBriefcase, FaFileContract } from "react-icons/fa";

function Dashboard({ setPage, setSelectedProject }) {
  const [role, setRole] = useState("");
  const [stats, setStats] = useState({
    projects: 0,
    proposals: 0,
    accepted: 0,
    contracts: 0,
  });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const profile = await getUserProfile();
        setRole(profile.role);

        // ===== CLIENT =====
        if (profile.role === "client") {
          const projectsRes = await axios.get(
            "http://127.0.0.1:8000/api/projects/",
            getAuthHeaders()
          );

          const contractsRes = await axios.get(
            "http://127.0.0.1:8000/api/contracts/my/",
            getAuthHeaders()
          );

          setStats({
            projects: projectsRes.data.length,
            contracts: contractsRes.data.length,
          });

          setRecent(projectsRes.data.slice(0, 5));
        }

        // ===== FREELANCER =====
        if (profile.role === "freelancer") {
          const proposalsRes = await axios.get(
            "http://127.0.0.1:8000/api/proposals/my/",
            getAuthHeaders()
          );

          const contractsRes = await axios.get(
            "http://127.0.0.1:8000/api/contracts/my/",
            getAuthHeaders()
          );

          const accepted = proposalsRes.data.filter(
            (p) => p.status === "accepted"
          );

          setStats({
            proposals: proposalsRes.data.length,
            accepted: accepted.length,
            contracts: contractsRes.data.length,
          });

          const recentActivity = proposalsRes.data.slice(0, 5).map(p => ({
  id: p.id,
  project_id: p.project,
  project_title: p.project_title,
  status: p.status,
}));

setRecent(recentActivity);

        }
      } catch (err) {
        console.error("Dashboard error", err);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="projects-container">
      <div
        className="project-detail-card"
        style={{ minHeight: "80vh" }}
      >
        <h2 className="project-detail-title">Dashboard</h2>

        {/* ================= STATS ================= */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            marginBottom: "35px",
          }}
        >
          {role === "client" && (
  <>
    <StatCard
      icon={<FaBriefcase />}
      label="Projects Created"
      value={stats.projects}
      onClick={() => setPage("my-projects")}
    />

    <StatCard
      icon={<FaFileContract />}
      label="Active Contracts"
      value={stats.contracts}
      onClick={() => setPage("contracts")}
    />
  </>
)}


{role === "freelancer" && (
  <>
    <StatCard
      icon={<FaBriefcase />}
      label="Proposals Sent"
      value={stats.proposals}
      onClick={() => setPage("my-proposals")}
    />

    <StatCard
      icon={<FaFileContract />}
      label="Active Contracts"
      value={stats.contracts}
      onClick={() => setPage("contracts")}
    />
  </>
)}

        </div>

        {/* ================= RECENT ACTIVITY ================= */}
        <h3 style={{ color: "#e5e7eb", marginBottom: "15px" }}>
          Recent Activity
        </h3>

        {/* {recent.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No recent activity</p>
        ) : (
          recent.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.project) {
                  setSelectedProject(item.project);
                } else {
                  setSelectedProject(item.id);
                }
                setPage("project-detail");
              }}
              style={{
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "12px",
                background: "#020617",
                border: "1px solid #1e293b",
                cursor: "pointer",
                color: "#e5e7eb",
              }}
            >
              <b>{item.title || item.project_title}</b>

              {item.status && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "#94a3b8",
                    marginTop: "4px",
                  }}
                >
                  Status: {item.status}
                </p>
              )}
            </div>
          ))
        )} */}

        {recent.map((item) => (
  <div
    key={item.id}
    onClick={() => {
      setSelectedProject(item.project_id);
      setPage("project-detail");
    }}
    style={{
      padding: "16px",
      marginBottom: "12px",
      borderRadius: "12px",
      background: "#020617",
      border: "1px solid #1e293b",
      cursor: "pointer",
      color: "#e5e7eb",
    }}
  >
    <b>{item.project_title}</b>

    <p
      style={{
        fontSize: "13px",
        marginTop: "6px",
        color:
          item.status === "accepted"
            ? "#22c55e"
            : item.status === "rejected"
            ? "#ef4444"
            : "#facc15",
      }}
    >
      Proposal {item.status}
    </p>
  </div>
))}


        <button
          className="secondary-btn"
          style={{ marginTop: "25px" }}
          onClick={() => setPage("projects")}
        >
          Back to Projects
        </button>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
// function StatCard({ icon, label, value }) {
//   return (
//     <div
//       style={{
//         background: "#020617",
//         padding: "26px",
//         borderRadius: "16px",
//         border: "1px solid #1e293b",
//         display: "flex",
//         alignItems: "center",
//         gap: "18px",
//       }}
//     >
//       <div
//         style={{
//           fontSize: "32px",
//           color: "#60a5fa",
//         }}
//       >
//         {icon}
//       </div>

//       <div>
//         <h3
//           style={{
//             fontSize: "30px",
//             color: "#60a5fa",
//             marginBottom: "4px",
//           }}
//         >
//           {value}
//         </h3>
//         <p style={{ color: "#e5e7eb", fontSize: "14px" }}>
//           {label}
//         </p>
//       </div>
//     </div>
//   );
// }

function StatCard({ icon, label, value, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#020617",
        padding: "26px",
        borderRadius: "16px",
        border: "1px solid #1e293b",
        display: "flex",
        alignItems: "center",
        gap: "18px",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div style={{ fontSize: "32px", color: "#60a5fa" }}>
        {icon}
      </div>

      <div>
        <h3 style={{ fontSize: "30px", color: "#60a5fa" }}>
          {value}
        </h3>
        <p style={{ color: "#e5e7eb", fontSize: "14px" }}>
          {label}
        </p>
      </div>
    </div>
  );
}


export default Dashboard;
