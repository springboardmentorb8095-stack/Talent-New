import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Get role from localStorage on mount
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav style={navStyle}>
      <h3>TalentLink</h3>

      <div style={menuStyle}>
        {/* PUBLIC */}
        {!role && (
          <>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}

        {/* CLIENT */}
        {role === "client" && (
          <>
            <Link to="/client/dashboard" style={linkStyle}>Dashboard</Link>
            <Link to="/projects" style={linkStyle}>My Projects</Link>
            <button onClick={logout} style={btnStyle}>Logout</button>
          </>
        )}

        {/* FREELANCER */}
        {role === "freelancer" && (
          <>
            <Link to="/freelancer/dashboard" style={linkStyle}>Dashboard</Link>
            <Link to="/freelancer/projects" style={linkStyle}>Project Feed</Link> {/* NEW */}
            <Link to="/projects" style={linkStyle}>Find Work</Link>
            <button onClick={logout} style={btnStyle}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

/* STYLES */
const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 30px",
  background: "#1f2937",
  color: "#fff"
};

const menuStyle = {
  display: "flex",
  gap: "15px",
  alignItems: "center"
};

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: "500"
};

const btnStyle = {
  padding: "6px 12px",
  background: "#ef4444",
  border: "none",
  borderRadius: "6px",
  color: "#fff",
  cursor: "pointer"
};


