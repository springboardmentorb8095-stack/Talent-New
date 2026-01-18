import { useState } from "react";
import API from "../services/api";

function ForgotPassword({ setPage }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= SEND RESET LINK ================= */
  const handleReset = async () => {
    if (!email) {
      alert("Please enter your registered email");
      return;
    }

    try {
      setLoading(true);

      await API.post("auth/forgot-password/", { email });

      alert("Password reset link has been sent to your email");
      setPage("login");
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Email not found. Please register first."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="card fade"
      style={{
        maxWidth: 420,
        margin: "100px auto",
        textAlign: "center",
      }}
    >
      {/* ================= HEADER ================= */}
      <h1>Reset your password</h1>
      <p className="muted" style={{ marginBottom: 30 }}>
        Enter your registered email and we’ll send you a secure reset link
      </p>

      {/* ================= INPUT ================= */}
      <input
        type="email"
        placeholder="Registered email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* ================= ACTION ================= */}
      <button
        onClick={handleReset}
        disabled={loading}
        style={{ marginTop: 24 }}
      >
        {loading ? "Sending reset link..." : "Send reset link"}
      </button>

      {/* ================= LINKS ================= */}
      <div
        className="link"
        style={{ marginTop: 18 }}
        onClick={() => setPage("login")}
      >
        ← Back to Login
      </div>

      {/* ================= FOOTER ================= */}
      <div
        style={{
          marginTop: 26,
          fontSize: 13,
          opacity: 0.6,
        }}
      >
        🔒 Secure password recovery · Email verification required
      </div>
    </div>
  );
}

export default ForgotPassword;
