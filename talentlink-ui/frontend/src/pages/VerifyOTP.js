import { useState } from "react";
import API from "../services/api";

function VerifyOTP({ setPage }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    const email = localStorage.getItem("verify_email");

    if (!email) {
      alert("Registration session expired. Please register again.");
      setPage("register");
      return;
    }

    try {
      setLoading(true);

      await API.post("auth/verify-otp/", {
        email,
        otp,
      });

      // Cleanup
      localStorage.removeItem("verify_email");

      alert("Email verified successfully! You can now login.");
      setPage("login");
    } catch (error) {
      alert(
        error.response?.data?.error || "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card fade">
      <h2>Verify Email</h2>

      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
}

export default VerifyOTP;
