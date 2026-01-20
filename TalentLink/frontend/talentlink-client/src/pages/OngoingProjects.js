import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/auth";

function OngoingProjects() {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    fetchOngoing();
  }, []);

  const fetchOngoing = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/ongoing/",
      getAuthHeaders()
    );
    setContracts(res.data);
  };

  return (
    <div className="projects-container">
      <h2 className="project-detail-title">Ongoing Projects</h2>

      {contracts.map((c) => (
        <div key={c.id} className="project-card">
          <h3>{c.project_title}</h3>

          <p>
            Client: <b>{c.client_username}</b> | Freelancer:{" "}
            <b>{c.freelancer_username}</b>
          </p>

          {/* PROGRESS BAR */}
          <div className="progress-wrapper">
            <div
              className="progress-bar"
              style={{ width: `${c.progress || 0}%` }}
            />
          </div>

          <p>{c.progress || 0}% completed</p>
        </div>
      ))}
    </div>
  );
}

export default OngoingProjects;
