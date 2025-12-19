import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ForgotPassword({ setPage }) {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    // frontend validation
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setSuccessMessage("");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/reset-password/",
        {
          username: username,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }
      );

      // ✅ SUCCESS CASE
      if (res.status === 200) {
        setSuccessMessage("Password updated successfully!");
        setErrorMessage("");

        // optional: redirect after 2 sec
        setTimeout(() => setPage("login"), 2000);
      }
    } catch (err) {
      // ❌ REAL ERROR
      if (err.response && err.response.data?.error) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage("Something went wrong");
      }
      setSuccessMessage("");
    }
  };

  return (
    <>
      <h2>Reset Password</h2>

      <form onSubmit={handleReset}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <div className="password-wrapper">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
            className="eye-icon"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit">Update Password</button>
      </form>

      {/* ✅ GREEN SUCCESS */}
      {successMessage && <p className="success">{successMessage}</p>}

      {/* ❌ RED ERROR */}
      {errorMessage && <p className="error">{errorMessage}</p>}

      <p className="link" onClick={() => setPage("login")}>
        Back to Login
      </p>
    </>
  );
}

export default ForgotPassword;
