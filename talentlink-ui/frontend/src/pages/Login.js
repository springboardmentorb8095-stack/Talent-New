import { useState } from "react";
import { login } from "../services/api";

function Login({ setPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await login({ username, password });

      // ✅ MUST match api.js
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      setPage("profile");
    } catch (error) {
      alert("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card fade">
      <h2>Welcome Back</h2>

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

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="link" onClick={() => setPage("forgot")}>
        Forgot Password?
      </div>

      <div className="link" onClick={() => setPage("register")}>
        Create Account
      </div>
    </div>
  );
}

export default Login;
