import { useEffect, useState } from "react";
import API from "../services/api";

function Messages({ setPage }) {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeContract, setActiveContract] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    API.get("profile/").then((res) => {
      setCurrentUser(res.data.user);
    });
  }, []);

  /* ================= LOAD CHATS ================= */
  const loadChats = async () => {
    try {
      const res = await API.get("chats/");
      setChats(res.data);
    } catch {
      alert("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD MESSAGES ================= */
  const loadMessages = async (contractId) => {
    try {
      const res = await API.get("messages/", {
        params: { contract: contractId },
      });
      setMessages(res.data);
    } catch {
      alert("Failed to load messages");
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!activeContract || !content.trim()) return;

    try {
      await API.post("messages/", {
        contract: activeContract.id,
        content,
      });
      setContent("");
      loadMessages(activeContract.id);
    } catch {
      alert("Failed to send message");
    }
  };

  if (loading || !currentUser) {
    return <div className="loading-screen">Loading messages...</div>;
  }

  return (
    <div className="dashboard-layout">
      <div className="dashboard-main">
        {/* ================= HEADER ================= */}
        <header className="dashboard-topbar">
          <div>
            <h2>Messages</h2>
            <p className="muted">Contract-based secure messaging</p>
          </div>

          <button
            className="secondary-btn"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>
        </header>

        {/* ================= CHAT WRAPPER ================= */}
        <div
          className="card fade"
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            height: "70vh",
            padding: 0,
          }}
        >
          {/* ================= LEFT: CHAT LIST ================= */}
          <div
            style={{
              borderRight: "1px solid var(--border-glass)",
              padding: 20,
            }}
          >
            <h4 style={{ marginBottom: 16 }}>Conversations</h4>

            {chats.length === 0 ? (
              <p className="muted">No active contracts</p>
            ) : (
              chats.map((c) => {
                const otherUser =
                  c.client.id === currentUser.id
                    ? c.freelancer
                    : c.client;

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setActiveContract(c);
                      loadMessages(c.id);
                    }}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 12,
                      cursor: "pointer",
                      marginBottom: 10,
                      background:
                        activeContract?.id === c.id
                          ? "rgba(59,130,246,.15)"
                          : "rgba(255,255,255,.05)",
                    }}
                  >
                    <strong>{otherUser.username}</strong>
                    <p className="muted" style={{ fontSize: 13 }}>
                      {c.project.title}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* ================= RIGHT: CHAT ================= */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
              {!activeContract ? (
                <div style={{ textAlign: "center", marginTop: 80 }}>
                  <h3>Select a conversation</h3>
                  <p className="muted">
                    Choose a contract to start chatting
                  </p>
                </div>
              ) : messages.length === 0 ? (
                <p className="muted">No messages yet</p>
              ) : (
                messages.map((m) => {
                  const isMine = m.sender.id === currentUser.id;

                  return (
                    <div
                      key={m.id}
                      style={{
                        display: "flex",
                        justifyContent: isMine
                          ? "flex-end"
                          : "flex-start",
                        marginBottom: 14,
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "65%",
                          padding: "14px 18px",
                          borderRadius: 18,
                          background: isMine
                            ? "linear-gradient(135deg, var(--primary), var(--primary-dark))"
                            : "rgba(255,255,255,0.08)",
                          color: isMine ? "#fff" : "var(--text-light)",
                        }}
                      >
                        <div>{m.content}</div>
                        <div
                          style={{
                            fontSize: 11,
                            opacity: 0.6,
                            marginTop: 6,
                            textAlign: "right",
                          }}
                        >
                          {new Date(m.sent_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* INPUT */}
            {activeContract && (
              <div
                style={{
                  padding: 16,
                  borderTop: "1px solid var(--border-glass)",
                  display: "flex",
                  gap: 12,
                }}
              >
                <input
                  placeholder="Type your message..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button className="primary-btn" onClick={sendMessage}>
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
