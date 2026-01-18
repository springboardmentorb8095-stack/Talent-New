import { useState } from "react";
import API from "../services/api";

function Register({ setPage }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CLIENT");
  const [loading, setLoading] = useState(false);

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    if (!email || !username || !password) {
      alert("All fields are required");
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

      localStorage.setItem("verify_email", email);
      alert("OTP has been sent to your email");
      setPage("otp");
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="card fade"
      style={{
        maxWidth: 460,
        margin: "80px auto",
        textAlign: "center",
      }}
    >
      {/* ================= HEADER ================= */}
      <h1>Create your account</h1>
      <p className="muted" style={{ marginBottom: 30 }}>
        Join <strong>TalentLink</strong> and start collaborating
      </p>

      {/* ================= FORM ================= */}
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* ================= ROLE SELECT ================= */}
      <div style={{ marginTop: 14, textAlign: "left" }}>
        <label
          style={{
            fontSize: 13,
            opacity: 0.7,
            marginBottom: 6,
            display: "block",
          }}
        >
          Select your role
        </label>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="CLIENT">Client – Hire talent</option>
          <option value="FREELANCER">
            Freelancer – Find work
          </option>
        </select>
      </div>

      {/* ================= ACTION ================= */}
      <button
        onClick={handleRegister}
        disabled={loading}
        style={{ marginTop: 20 }}
      >
        {loading ? "Sending OTP..." : "Create Account"}
      </button>

      {/* ================= LINKS ================= */}
      <div
        className="link"
        style={{ marginTop: 18 }}
        onClick={() => setPage("login")}
      >
        Already have an account? Sign in
      </div>

      {/* ================= FOOTER ================= */}
      <div
        style={{
          marginTop: 26,
          fontSize: 13,
          opacity: 0.6,
        }}
      >
        Secure signup · Email verification · No spam
      </div>
    </div>
  );
}

export default Register;
