import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Get JWT tokens
      const tokenRes = await API.post("/token/", {
        username,
        password,
      });

      localStorage.setItem("access_token", tokenRes.data.access);
      localStorage.setItem("refresh_token", tokenRes.data.refresh);

      // 2️⃣ Fetch user profile
      const profileRes = await API.get("/profile/", {
        headers: {
          Authorization: `Bearer ${tokenRes.data.access}`,
        },
      });

      const role = profileRes.data.role;
      localStorage.setItem("role", role);

      toast.success("Login successful!");

      // 3️⃣ Redirect based on role
      if (role === "client") {
        navigate("/client/dashboard");
      } else if (role === "freelancer") {
        navigate("/freelancer/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid username or password");
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={loginWrapper}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />

        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

/* ---------- STYLES ---------- */

const loginWrapper = {
  maxWidth: "400px",
  margin: "60px auto",
  padding: "30px",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #89f7fe, #66a6ff)",
  boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
  textAlign: "center",
  color: "#fff",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  marginTop: "20px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  fontSize: "16px",
};

const btnStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  background: "#ff7e5f",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
};
