import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/profile/")
      .then((res) => {
        setProfile(res.data);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  if (!profile) return <p style={{ color: "white", textAlign: "center" }}>Loading...</p>;

  return (
    <>
      <style>{`
        body {
          background: linear-gradient(135deg, #1abc9c, #2ecc71);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          background: white;
          padding: 40px;
          width: 420px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
      `}</style>
      <h1 style={{ color: "white", textAlign: "center" }}>Talent link</h1>

      <div className="container">
        
        <h1>Welcome {profile.username}</h1>
        <p>You are registered as <strong>{profile.role}</strong></p>
        <button 
          onClick={() => { localStorage.clear(); navigate("/"); }}
          style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#e74c3c', color: 'white', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
    </>
  );
}