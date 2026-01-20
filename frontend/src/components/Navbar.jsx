import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon"></span>
          <img src="/src/static/images/icon.png" alt="" />
          <span className="logo-text">TalentLink</span>
        </Link>

        <div className="navbar-links">
          {isLoggedIn ? (
            <>
              {user.role === "client" && (
                <>
                  <Link to="/client/dashboard">Dashboard</Link>
                  <Link to="/client/projects">My Projects</Link>
                  <Link to="/client/create-project">Post Project</Link>
                  <Link to="/contracts/my-contracts">Contracts</Link>
                </>
              )}
              {user.role === "freelancer" && (
                <>
                  <Link to="/freelancer/dashboard">Dashboard</Link>
                  <Link to="/freelancer/browse">Browse Projects</Link>
                  <Link to="/freelancer/proposals">My Proposals</Link>
                  <Link to="/contracts/my-contracts">Contracts</Link>
                </>
              )}
              {/* <Link to="/contracts/my-contracts">Messages</Link> */}
              <Link to="/notifications">Notifications</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-register">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
