import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login({ setPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/login/",
        { username, password }
      );

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // setMessage("Login successful!");
      setSuccessMessage("Login successful!");
      setErrorMessage("");
    } catch {
      setErrorMessage("Invalid username or password");
      setSuccessMessage("");
    }
  };

  return (
    <>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit">Login</button>
      </form>

      {/* <p className="error">{message}</p> */}

      <p className="success">{successMessage}</p>
      <p className="error">{errorMessage}</p>

      <p className="link" onClick={() => setPage("forgot")}>
        Forgot Password?
      </p>

      <p>
        New user?{" "}
        <span className="link" onClick={() => setPage("register")}>
          Register
        </span>
      </p>
    </>
  );
}

export default Login;
