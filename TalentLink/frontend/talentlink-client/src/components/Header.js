import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { getUserProfile } from "../utils/user";

function Header({ setPage, searchTerm, setSearchTerm }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    async function fetchRole() {
      try {
        const data = await getUserProfile();
        setRole(data.role); // client / freelancer
      } catch {
        setRole("");
      }
    }
    fetchRole();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setPage("login");
  };

  return (
    <div className="header">
      {/* LEFT */}
      <div className="logo">TalentLink</div>

      {/* CENTER SEARCH BAR */}
      <input
        type="text"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="header-search"
      />

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* CLIENT → Create Project */}
        {role === "client" && (
          <button
            className="primary-btn"
            onClick={() => setPage("create-project")}
          >
            Create Project
          </button>
        )}

        {/* PROFILE */}
        <div className="profile-area">
          <FaUserCircle
            className="profile-icon"
            onClick={() => setOpen(!open)}
          />

          {open && (
            <div className="dropdown">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
