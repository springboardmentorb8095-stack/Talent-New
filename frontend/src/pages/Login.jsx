import { useState, useContext } from "react";
import { loginUser, getCurrentUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setIsLoggedIn, setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const tokens = await loginUser({ username, password });
      localStorage.setItem("access", tokens.access);
      localStorage.setItem("refresh", tokens.refresh);

      const user = await getCurrentUser(); // no token needed
      setUser(user);
      setIsLoggedIn(true);

      // Role-based redirect
      if (user.role === "client") {
        navigate("/client/dashboard", { replace: true });
      } else if (user.role === "freelancer") {
        navigate("/freelancer/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="page-center">
      <div className="card">
    <h2 className="page-title">Login</h2>

    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit">Login</button>

      {error && <p className="error">{error}</p>}
    </form>
    </div>
  </div>

  );
}

export default Login;
