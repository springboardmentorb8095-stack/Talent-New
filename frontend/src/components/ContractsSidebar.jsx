import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { getMyContracts } from "../api/contracts";

export default function ContractsSidebar({ onOpenChat }) {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    const res = await getMyContracts();
    setContracts(res.data.results || []);
  };

  const markCompleted = async (id) => {
    try {
      await axiosInstance.patch(`/contracts/${id}/status/`, { status: "completed" });
      loadContracts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      width: "280px",
      borderRight: "1px solid #ddd",
      padding: "10px",
      overflowY: "auto"
    }}>
      <h3>Contracts</h3>

      {contracts.length === 0 && <p>No contracts yet.</p>}

      {contracts.map(c => (
        <div key={c.id}
          style={{
            marginBottom: "10px",
            padding: "8px",
            border: "1px solid #eee",
            borderRadius: "6px"
          }}
        >
          <strong>{c.project_title}</strong><br />
          <small>Status: {c.status}</small><br />

          <button style={{ marginTop: "6px" }} onClick={() => onOpenChat(c.id)}>
            Open Chat
          </button>

          {user.role === "client" && c.status === "active" && (
            <button
              style={{ marginTop: "6px", background: "#4caf50", color: "white" }}
              onClick={() => markCompleted(c.id)}
            >
              Mark Completed
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
