import { useState } from "react";
import API from "../services/api";

function Register({ setPage }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CLIENT");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !username || !password) {
      alert("Email, Username and Password are required");
      return;
    }

    try {
      setLoading(true);

      await API.post("auth/register/", {
        email,
        username,
        password,
        role,
      });

      // Save email for OTP verification step
      localStorage.setItem("verify_email", email);

      alert("OTP has been sent to your email");
      setPage("otp");
    } catch (error) {
      alert(
        error.response?.data?.error || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card fade">
      <h2>Create Account</h2>

      <input
        type="email"
        placeholder="Email *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Username *"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password *"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="CLIENT">Client</option>
        <option value="FREELANCER">Freelancer</option>
      </select>

      <button onClick={handleRegister} disabled={loading}>
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>

      <div className="link" onClick={() => setPage("login")}>
        Back to Login
      </div>
    </div>
  );
}

export default Register;
