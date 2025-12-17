import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AuthForm.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/users/register/",
        { name, email, password, role }
      );

      // SUCCESS message from backend
      setMessage(res.data.message);

    } catch (err) {
      // Backend validation message
      if (err.response && err.response.data.message) {
        setMessage(err.response.data.message);
      } else if (err.response && err.response.status === 400) {
        setMessage("User already registered. Please login.");
      } else {
        setMessage("Registration Failed");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>

        {message && <p className="message">{message}</p>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            className="auth-input"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="auth-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>

          <button className="auth-btn" type="submit">
            Register
          </button>
        </form>

        <p style={{ marginTop: "15px" }}>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
