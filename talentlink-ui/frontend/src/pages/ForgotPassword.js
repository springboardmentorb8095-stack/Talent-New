import { useState } from "react";
import API from "../services/api";

function ForgotPassword({ setPage }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      alert("Please enter your registered email");
      return;
    }

    try {
      setLoading(true);

      await API.post("auth/forgot-password/", {
        email,
      });

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
    <div className="card fade">
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Registered Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleReset} disabled={loading}>
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      <div className="link" onClick={() => setPage("login")}>
        Back to Login
      </div>
    </div>
  );
}

export default ForgotPassword;
