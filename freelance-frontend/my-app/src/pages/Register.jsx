import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await registerUser(formData);

    // ✅ Redirect to login after successful registration
    if (success) {
      alert("Registration successful! Please login.");
      navigate("/login");
    }
     else {
      alert("Registration failed!");
     }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Register</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
