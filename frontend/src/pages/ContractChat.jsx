// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// function ContractChat() {
//   const { contractId } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("accessToken");
//   const userRole = localStorage.getItem("role");

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const res = await axios.get(
//           `http://127.0.0.1:8000/api/messages/contract/${contractId}/`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setMessages(res.data);
//       } catch (err) {
//         console.error("Error loading messages", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMessages();
//   }, [contractId, token]);

//   if (loading) return <p style={{ padding: "20px" }}>Loading chat...</p>;

//   return (
//     <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
//       <h2>Contract Chat</h2>

//       <div
//         style={{
//           border: "1px solid #ccc",
//           padding: "15px",
//           borderRadius: "6px",
//           marginTop: "15px",
//         }}
//       >
//         {messages.length === 0 && <p>No messages yet</p>}

//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             style={{
//               marginBottom: "12px",
//               textAlign:
//                 msg.sender_name === (userRole === "client" ? "hi" : "freelancer")
//                   ? "right"
//                   : "left",
//             }}
//           >
//             <div
//               style={{
//                 display: "inline-block",
//                 background:
//                   msg.sender_name === "hi" ? "#d1ecf1" : "#e2e3e5",
//                 padding: "8px 12px",
//                 borderRadius: "10px",
//                 maxWidth: "80%",
//               }}
//             >
//               <strong>{msg.sender_name}</strong>
//               <p style={{ margin: "5px 0" }}>{msg.content}</p>
//               <small style={{ fontSize: "11px" }}>
//                 {new Date(msg.timestamp).toLocaleTimeString()}
//               </small>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ContractChat;
 // read only first code 

 // 17 jan

//  import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// function ContractChat() {
//   const { contractId } = useParams();

//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("accessToken");
//   const currentUserName =
//     localStorage.getItem("role") === "client" ? "hi" : "freelancer";

//   // 🔁 Fetch messages + Polling
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const res = await axios.get(
//           `http://127.0.0.1:8000/api/messages/contract/${contractId}/`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setMessages(res.data);
//       } catch (err) {
//         console.error("Error loading messages", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMessages(); // initial load
//     const interval = setInterval(fetchMessages, 3000); // polling

//     return () => clearInterval(interval);
//   }, [contractId, token]);

//   // ✉️ Send message
//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;

//     try {
//       await axios.post(
//         "http://127.0.0.1:8000/api/messages/send/",
//         {
//           contract: contractId,
//           content: newMessage,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setNewMessage("");
//     } catch (err) {
//       console.error("Error sending message", err);
//       alert("Failed to send message");
//     }
//   };

//   if (loading) {
//     return <p style={{ padding: "20px" }}>Loading chat...</p>;
//   }

//   return (
//     <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
//       <h2>Contract Chat</h2>

//       {/* 💬 Messages */}
//       <div
//         style={{
//           border: "1px solid #ccc",
//           padding: "15px",
//           borderRadius: "6px",
//           height: "400px",
//           overflowY: "auto",
//           marginTop: "15px",
//         }}
//       >
//         {messages.length === 0 && <p>No messages yet</p>}

//         {messages.map((msg) => {
//           const isMe = msg.sender_name === currentUserName;

//           return (
//             <div
//               key={msg.id}
//               style={{
//                 marginBottom: "12px",
//                 textAlign: isMe ? "right" : "left",
//               }}
//             >
//               <div
//                 style={{
//                   display: "inline-block",
//                   background: isMe ? "#d1ecf1" : "#e2e3e5",
//                   padding: "8px 12px",
//                   borderRadius: "10px",
//                   maxWidth: "80%",
//                 }}
//               >
//                 <strong>{msg.sender_name}</strong>
//                 <p style={{ margin: "5px 0" }}>{msg.content}</p>
//                 <small style={{ fontSize: "11px" }}>
//                   {new Date(msg.timestamp).toLocaleTimeString()}
//                 </small>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* ✉️ Send box */}
//       <div
//         style={{
//           display: "flex",
//           marginTop: "15px",
//           gap: "10px",
//         }}
//       >
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           style={{
//             flex: 1,
//             padding: "10px",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//           }}
//         />

//         <button
//           onClick={handleSendMessage}
//           style={{
//             padding: "10px 16px",
//             backgroundColor: "#007bff",
//             color: "#fff",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//           }}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ContractChat;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import "./ContractChat.css";

function ContractChat() {
  const { contractId } = useParams();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUserName = localStorage.getItem("name") || "You";

  // 🔁 Fetch messages + Polling
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(
          `/messages/contract/${contractId}/`
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Error loading messages", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages(); // initial load
    const interval = setInterval(fetchMessages, 3000); // polling every 3 seconds

    return () => clearInterval(interval);
  }, [contractId]);

  // 💬 Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      await api.post("/messages/send/", {
        contract_id: contractId,
        content: newMessage,
      });

      setNewMessage("");

      // Refresh messages
      const res = await api.get(`/messages/contract/${contractId}/`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error sending message", err);
      alert("Failed to send message");
    }
  };

  if (loading) return <p>Loading chat...</p>;

  return (
    <div className="contract-chat">
      <h2>Contract Chat - {contractId}</h2>

      {/* Messages */}
      <div className="messages-container">
        {messages.length === 0 && <p>No messages yet. Start the conversation!</p>}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.sender_name === currentUserName ? "sent" : "received"
            }`}
          >
            <strong>{msg.sender_name}</strong>
            <p>{msg.content}</p>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ContractChat;
