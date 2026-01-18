import { useState } from "react";
import API from "../services/api";

function VerifyOTP({ setPage }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= VERIFY OTP ================= */
  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      alert("Please enter the OTP sent to your email");
      return;
    }

    const email = localStorage.getItem("verify_email");

    if (!email) {
      alert("Session expired. Please register again.");
      setPage("register");
      return;
    }

    try {
      setLoading(true);

      await API.post("auth/verify-otp/", {
        email,
        otp,
      });

      localStorage.removeItem("verify_email");

      alert("Email verified successfully!");
      setPage("login");
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Invalid or expired OTP. Please try again."
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
      <h1>Verify your email</h1>
      <p className="muted" style={{ marginBottom: 30 }}>
        Enter the verification code sent to your email
      </p>

      {/* ================= OTP INPUT ================= */}
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) =>
          setOtp(e.target.value.replace(/\D/g, ""))
        }
        style={{
          textAlign: "center",
          fontSize: "20px",
          letterSpacing: "6px",
          fontWeight: 600,
        }}
      />

      {/* ================= ACTION ================= */}
      <button
        onClick={handleVerify}
        disabled={loading}
        style={{ marginTop: 24 }}
      >
        {loading ? "Verifying..." : "Verify & Continue"}
      </button>

      {/* ================= LINKS ================= */}
      <div
        className="link"
        style={{ marginTop: 18 }}
        onClick={() => setPage("register")}
      >
        Didn’t receive the code? Register again
      </div>

      {/* ================= FOOTER ================= */}
      <div
        style={{
          marginTop: 26,
          fontSize: 13,
          opacity: 0.6,
        }}
      >
        🔒 Secure verification · One-time use only
      </div>
    </div>
  );
}

export default VerifyOTP;
