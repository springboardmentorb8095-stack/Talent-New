import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login/", data);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      navigate("/home");
    } catch (error) {
    // This will now show the EXACT error from your views.py
    const errorMsg = error.response?.data?.error || "Connection Error";
    alert("Login failed: " + errorMsg);
    console.error("Full Error Object:", error);
  }
  };

  return (
    <>
      <style>{`
        body {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #1abc9c, #2ecc71);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        form {
          background: rgba(255,255,255,0.1);
          padding: 40px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
          box-shadow: 0 0 30px rgba(0,0,0,0.2);
        }
        input, button {
          display: block;
          width: 100%;
          margin: 15px 0;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ddd;
        }
        button {
          background: #16a085;
          color: white;
          border: none;
          cursor: pointer;
        }
      `}</style>

      <form onSubmit={handleSubmit}>
        <h1 style={{ color: "white", textAlign: "center" }}>Talent link</h1>
        <h2 style={{ color: "white", textAlign: "center" }}>Login</h2>
        <input
          placeholder="Username"
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <button type="submit">Login</button>
        <p style={{ color: "white", textAlign: "center" }}>
          Don’t have an account? <a href="/register" style={{color: '#fff', fontWeight: 'bold'}}>Register</a>
        </p>
      </form>
    </>
  );
}