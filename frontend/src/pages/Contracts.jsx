// import { useEffect, useState } from "react";
// import axios from "axios";

// function Contracts() {
//   const [contracts, setContracts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchContracts = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");

//         const res = await axios.get(
//           "http://127.0.0.1:8000/api/contracts/my/",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setContracts(res.data);
//       } catch (err) {
//         console.error("Error fetching contracts", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContracts();
//   }, []);

//   if (loading) return <p>Loading contracts...</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>My Contracts</h2>

//       {contracts.length === 0 && <p>No contracts found</p>}

//       {contracts.map((contract) => (
//         <div
//           key={contract.id}
//           style={{
//             border: "1px solid #ccc",
//             padding: "10px",
//             marginBottom: "10px",
//           }}
//         >
//           <p><strong>Project:</strong> {contract.project_title}</p>
//           <p><strong>Client:</strong> {contract.client_name}</p>
//           <p><strong>Freelancer:</strong> {contract.freelancer_name}</p>
//           <p><strong>Amount:</strong> ₹{contract.amount}</p>
//           <p><strong>Status:</strong> {contract.status}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Contracts;

// 16 jan

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function Contracts() {
//   const [contracts, setContracts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const role = localStorage.getItem("role");
//   const token = localStorage.getItem("accessToken");

//   const navigate = useNavigate();

//   // 🔄 Fetch contracts
//   useEffect(() => {
//     const fetchContracts = async () => {
//       try {
//         const res = await axios.get(
//           "http://127.0.0.1:8000/api/contracts/my/",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setContracts(res.data);
//       } catch (err) {
//         console.error("Error fetching contracts", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContracts();
//   }, [token]);

//   // ✅ Client completes contract
//   const completeContract = async (contractId) => {
//     try {
//       await axios.patch(
//         `http://127.0.0.1:8000/api/contracts/${contractId}/status/`,
//         { status: "completed" },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Refresh contracts after update
//       const res = await axios.get(
//         "http://127.0.0.1:8000/api/contracts/my/",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setContracts(res.data);
//     } catch (err) {
//       console.error("Error completing contract", err);
//       alert("Failed to complete contract");
//     }
//   };

//   if (loading) {
//     return <p style={{ padding: "20px" }}>Loading contracts...</p>;
//   }

//   return (
//     <div style={{ padding: "30px" }}>
//       <h2 style={{ marginBottom: "20px" }}>My Contracts</h2>

//       {contracts.length === 0 && <p>No contracts found</p>}

//       {contracts.map((contract) => (
//         <div
//           key={contract.id}
//           style={{
//             background: "#ffffff",
//             borderRadius: "8px",
//             padding: "20px",
//             marginBottom: "20px",
//             boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           <h3 style={{ marginBottom: "10px" }}>
//             {contract.project_title}
//           </h3>

//           <p>
//             <strong>Client:</strong> {contract.client_name}
//           </p>
//           <p>
//             <strong>Freelancer:</strong> {contract.freelancer_name}
//           </p>
//           <p>
//             <strong>Amount:</strong> ₹{contract.amount}
//           </p>

//           {/* ✅ Status Badge */}
//           <span
//             style={{
//               display: "inline-block",
//               marginTop: "10px",
//               padding: "6px 14px",
//               borderRadius: "20px",
//               fontSize: "13px",
//               fontWeight: "bold",
//               color: "#fff",
//               backgroundColor:
//                 contract.status === "completed" ? "#28a745" : "#007bff",
//             }}
//           >
//             {contract.status.toUpperCase()}
//           </span>

//           {/* ✅ OPEN CHAT BUTTON */}
//           <div>
//             <button
//               style={{
//                 marginTop: "10px",
//                 padding: "6px 12px",
//                 cursor: "pointer",
//               }}
//               onClick={() =>
//                 (window.location.href = `/contracts/${contract.id}/chat`)
//               }
//             >
//               Open Chat
//             </button>
//           </div>

//           {/* 🟢 LEAVE REVIEW BUTTON (ADDED) */}
//           {contract.status === "completed" && (
//             <div style={{ marginTop: "12px" }}>
//               <button
//                 onClick={() =>
//                   navigate(`/contracts/${contract.id}/review`)
//                 }
//                 style={{
//                   padding: "8px 16px",
//                   backgroundColor: "#2563eb",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Leave a Review
//               </button>
//             </div>
//           )}

//           {/* ✅ Client-only Complete Button */}
//           {role === "client" && contract.status === "active" && (
//             <div style={{ marginTop: "15px" }}>
//               <button
//                 onClick={() => completeContract(contract.id)}
//                 style={{
//                   padding: "8px 16px",
//                   backgroundColor: "#28a745",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Complete Contract
//               </button>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Contracts;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyContracts, updateContractStatus } from "../services/contractService";
import "./Contracts.css";

function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔄 Fetch contracts
  useEffect(() => {
    getMyContracts()
      .then((res) => {
        setContracts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching contracts", err);
        setLoading(false);
      });
  }, []);

  // ✅ Complete contract
  const completeContract = async (contractId) => {
    try {
      await updateContractStatus(contractId, "completed");
      setContracts((prev) =>
        prev.map((c) =>
          c.id === contractId ? { ...c, status: "completed" } : c
        )
      );
    } catch (err) {
      console.error("Error updating contract", err);
      alert("Failed to complete contract");
    }
  };

  // ❌ Cancel contract
  const cancelContract = async (contractId) => {
    try {
      await updateContractStatus(contractId, "cancelled");
      setContracts((prev) =>
        prev.map((c) =>
          c.id === contractId ? { ...c, status: "cancelled" } : c
        )
      );
    } catch (err) {
      console.error("Error cancelling contract", err);
      alert("Failed to cancel contract");
    }
  };

  if (loading) return <p>Loading contracts...</p>;

  return (
    <div className="contracts-page">
      <h2>My Contracts</h2>

      {contracts.length === 0 && <p>No contracts found</p>}

      {contracts.map((contract) => (
        <div key={contract.id} className="contract-card">
          <p><strong>Project:</strong> {contract.project_title}</p>
          <p><strong>Client:</strong> {contract.client_name}</p>
          <p><strong>Freelancer:</strong> {contract.freelancer_name}</p>
          <p><strong>Amount:</strong> ₹{contract.amount}</p>
          <p><strong>Status:</strong> {contract.status}</p>

          {contract.status === "active" && (
            <div className="contract-actions">
              <button onClick={() => completeContract(contract.id)}>
                Complete
              </button>
              <button onClick={() => cancelContract(contract.id)}>
                Cancel
              </button>
            </div>
          )}

          {contract.status === "completed" && (
            <button onClick={() => navigate(`/contracts/${contract.id}/review`)}>
              Leave Review
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Contracts;
