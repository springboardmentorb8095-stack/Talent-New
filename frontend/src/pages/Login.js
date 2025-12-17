import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AuthForm.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const isLoggedIn = localStorage.getItem("access");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/users/login/",
        { email, password }
      );

      // ✅ Store JWT tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      setMessage("Login Successful!");
    } catch (err) {
      setMessage("Invalid email or password");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setMessage("Logged out successfully");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>

        {message && <p className="message">{message}</p>}

        {!isLoggedIn ? (
          <>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                className="auth-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                className="auth-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className="auth-btn" type="submit">
                Login
              </button>
            </form>

            <p style={{ marginTop: "15px" }}>
              New user? <Link to="/register">Register</Link>
            </p>
          </>
        ) : (
          <>
            <button
              className="auth-btn"
              style={{ background: "#dc3545" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
