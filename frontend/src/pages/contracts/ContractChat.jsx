// src/pages/contracts/ContractChat.jsx
import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import MessageBubble from "../../components/chat/MessageBubble";
import ChatInput from "../../components/chat/ChatInput";
import ChatHeader from "../../components/chat/ChatHeader";

function ContractChat({ contractId, contractTitle }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollingRef = useRef(null);

  // Fetch messages for long-polling
  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get(`/messages/${contractId}/`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoading(false);
    }
  };

  // Send new message
  const sendMessage = async (body, attachment = null) => {
    if (!body && !attachment) return;

    const formData = new FormData();
    if (body) formData.append("body", body);
    if (attachment) formData.append("attachment", attachment);

    try {
      await axiosInstance.post(`/messages/${contractId}/send/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchMessages(); // Refresh after sending
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll every 2 seconds
    pollingRef.current = setInterval(fetchMessages, 2000);

    return () => clearInterval(pollingRef.current);
  }, [contractId]);

  if (loading) return <p>Loading chat...</p>;

  return (
    <div className="contract-chat-container" style={{ maxWidth: "700px", margin: "0 auto" }}>
      <ChatHeader title={contractTitle || `Contract #${contractId}`} />

      <div
        className="messages-container"
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "400px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
}

export default ContractChat;
