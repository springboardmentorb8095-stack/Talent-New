import { Link } from "react-router-dom";
import "./Auth.css";

function AuthPage() {
  return (
    <div className="auth-landing">
      <div className="auth-card-landing">

        <h1 className="auth-title">Talentlink</h1>
        <p className="auth-tagline">
          Connect. Collaborate. Create Your Future.
        </p>

        <div className="auth-buttons">
          <Link to="/login" className="auth-btn-landing">Login</Link>
          <Link to="/register" className="auth-btn-landing">Register</Link>
        </div>

      </div>
    </div>
  );
}

export default AuthPage;
