import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import API from "../services/api";

export default function Register() {
  const [data, setData] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    role: "client" ,// Default role matching your serializer
    // Add these even if they are empty strings initially
    skills: "",
    portfolio: "",
    hourly_rate: 0 ,
  });
  
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send request to /api/register/
      const res = await API.post("/register/", data); 
      
      if (res.status === 201) {
        alert("Registration successful! Please login.");
        navigate("/"); // Redirect to Login page after success
      }
    } catch (error) {
    // Log this to the console so you can read the error easily
    console.error("FULL ERROR:", error.response?.data);
    
    // Show a simpler alert
    alert("Registration failed. Check the console (F12) for details.");
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
          width: 350px;
        }
        input, select, button {
          display: block;
          width: 100%;
          margin: 15px 0;
          padding: 12px;
          border-radius: 10px;
          border: none;
          box-sizing: border-box;
        }
        button {
          background: #16a085;
          color: white;
          cursor: pointer;
          font-weight: bold;
        }
      `}</style>

      <form onSubmit={handleSubmit}>
        <h1 style={{ color: "white", textAlign: "center" }}>Talent link</h1>
        <h2 style={{ color: "white", textAlign: "center" }}>Create Account</h2>
        
        <input
          placeholder="Username"
          onChange={(e) => setData({ ...data, username: e.target.value })}
          required
        />
        
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
          required
        />

        <select 
          value={data.role} 
          onChange={(e) => setData({ ...data, role: e.target.value })}
        >
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
        </select>

        <button type="submit">Register</button>

        <p style={{ color: "white", textAlign: "center" }}>
          Already have an account? <a href="/" style={{color: "white", fontWeight: "bold"}}>Login</a>
        </p>
      </form>
    </>
  );
}