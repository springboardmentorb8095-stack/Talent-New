import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/auth";

function Chat() {
  const [chatList, setChatList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const loggedInUser = localStorage.getItem("username");

  /* ================= FETCH CHAT LIST (LEFT) ================= */
  const fetchChatList = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/chat/list/",
        getAuthHeaders()
      );
      setChatList(res.data);
    } catch {
      setError("Failed to load chats");
    }
  };

  /* ================= FETCH MESSAGES (RIGHT) ================= */
  const fetchMessages = async (userId) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/chat/${userId}/`,
        getAuthHeaders()
      );
      setMessages(res.data);
    } catch {
      setError("Failed to load messages");
    }
  };

  /* ================= SEND MESSAGE ================= */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() || !selectedUser) return;

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/chat/send/",
        {
          receiver_id: selectedUser.user_id,
          content: content,
        },
        getAuthHeaders()
      );
      setContent("");
      fetchMessages(selectedUser.user_id);
      fetchChatList();
    } catch {
      setError("Failed to send message");
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchChatList();
  }, []);

  /* ================= POLLING ================= */
  useEffect(() => {
    if (!selectedUser) return;

    fetchMessages(selectedUser.user_id);
    const interval = setInterval(() => {
      fetchMessages(selectedUser.user_id);
      fetchChatList();
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedUser]);

  return (
    <div className="projects-container">
      <div
        style={{
          display: "flex",
          height: "88vh",
          background: "#020617",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {/* ================= LEFT: CHAT LIST ================= */}
        <div
          style={{
            width: "30%",
            borderRight: "1px solid #334155",
            overflowY: "auto",
          }}
        >
          <h3 style={{ padding: "15px", color: "#60a5fa" }}>Chats</h3>

          {/* {chatList.map((chat) => (
            <div
              key={chat.user_id}
              onClick={() => {
                setSelectedUser(chat);
                fetchMessages(chat.user_id);
              }}
              style={{
                padding: "12px 15px",
                cursor: "pointer",
                background:
                  selectedUser?.user_id === chat.user_id
                    ? "#1e293b"
                    : "transparent",
                color: "white",
              }}
            >
              <b>{chat.username}</b>
              <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                {chat.last_message}
              </p>
            </div>
          ))} */}




          {chatList.map((chat) => (
            <div
              key={chat.user_id}
              onClick={() => {
                setSelectedUser(chat);
                fetchMessages(chat.user_id);
              }}
              className={`chat-box ${
                selectedUser?.user_id === chat.user_id ? "active-chat" : ""
              }`}
            >
              <div className="chat-name">{chat.username}</div>
              <div className="chat-preview">{chat.last_message}</div>
            </div>
          ))}

        </div>

        {/* ================= RIGHT: MESSAGES ================= */}
        <div
          style={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {!selectedUser ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
              }}
            >
              Start your conversation
            </div>
          ) : (
            <>
              {/* HEADER */}
              <div
                style={{
                  padding: "15px",
                  borderBottom: "1px solid #334155",
                  color: "white",
                }}
              >
                Chat with <b>{selectedUser.username}</b>
              </div>

              {/* MESSAGES */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "15px",
                }}
              >
                {messages.map((msg, idx) => {
                  const isMine = msg.sender === loggedInUser;

                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: isMine
                          ? "flex-end"
                          : "flex-start",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          background: isMine ? "#2563eb" : "#334155",
                          color: "white",
                          padding: "10px 14px",
                          borderRadius: "14px",
                          maxWidth: "70%",
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* INPUT */}
              <form
                onSubmit={handleSend}
                style={{
                  display: "flex",
                  padding: "12px",
                  gap: "10px",
                  borderTop: "1px solid #334155",
                }}
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #334155",
                  }}
                />
                <button type="submit" className="primary-btn">
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Chat;
