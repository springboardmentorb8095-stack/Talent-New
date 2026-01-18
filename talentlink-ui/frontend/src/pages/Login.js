import { useState } from "react";
import API from "../services/api";

function Login({ setPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter your username and password");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ LOGIN
      const res = await API.post("auth/login/", {
        username,
        password,
      });

      // 2️⃣ SAVE TOKENS
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // 3️⃣ FETCH PROFILE
      const profileRes = await API.get("profile/");
      const profile = profileRes.data;

      // 4️⃣ REDIRECT
      if (
        profile.title ||
        profile.bio ||
        profile.location ||
        profile.hourly_rate ||
        profile.company_name
      ) {
        setPage("dashboard");
      } else {
        setPage("profile");
      }
    } catch {
      alert("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="card fade"
      style={{
        maxWidth: 420,
        margin: "80px auto",
        textAlign: "center",
      }}
    >
      {/* ================= HEADER ================= */}
      <h1>Welcome Back</h1>
      <p className="muted" style={{ marginBottom: 28 }}>
        Sign in to continue to <strong>TalentLink</strong>
      </p>

      {/* ================= FORM ================= */}
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
        {loading ? "Signing in..." : "Sign In"}
      </button>

      {/* ================= LINKS ================= */}
      <div
        className="link"
        style={{ marginTop: 16 }}
        onClick={() => setPage("forgot")}
      >
        Forgot your password?
      </div>

      <div
        className="link"
        style={{ marginTop: 10 }}
        onClick={() => setPage("register")}
      >
        Don’t have an account? Create one
      </div>

      {/* ================= FOOTER ================= */}
      <div
        style={{
          marginTop: 28,
          fontSize: 13,
          opacity: 0.6,
        }}
      >
        Secure login · JWT Auth · Encrypted
      </div>
    </div>
  );
}

export default Login;
