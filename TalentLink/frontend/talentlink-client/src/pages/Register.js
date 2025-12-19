import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register({ setPage }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Invalid username or password");
      setSuccessMessage("");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/auth/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setSuccessMessage("Register successful!");
      setErrorMessage("");
    } catch {
      setErrorMessage("Invalid username or password");
      setSuccessMessage("");
    }
  };

  return (
    <>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
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

        <button type="submit">Register</button>
      </form>

      <p className="success">{successMessage}</p>
      <p className="error">{errorMessage}</p>

      <p className="link" onClick={() => setPage("login")}>
        Back to Login
      </p>
    </>
  );
}

export default Register;
