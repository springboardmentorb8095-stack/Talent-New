import { useAuth } from "../../context/AuthContext";

export default function MessageBubble({ message }) {
  const { user } = useAuth();
  const mine = message.sender_name === user.username;

  // Base backend domain (modify if needed)
  const BASE = "http://127.0.0.1:8000";

  // let ava = message.avatar;
  // console.log(ava);

  // Final file URL (only if exists)
  const fileUrl = message.file
    ? (message.file.startsWith("http") ? message.file : BASE + message.file)
    : null;

  return (
    <div style={{
      display: "flex",
      justifyContent: mine ? "flex-end" : "flex-start",
      marginBottom: "6px",
      gap: 8
    }}>

      {/* Avatar (temporary placeholder) */}
      {!mine && (
        <img
          // src="/static/images/default-avatar.png"
          src={message.avatar ? message.avatar : "/static/images/default-avatar.png"}
          alt="avatar"
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            objectFit: "cover",
            marginTop: 4
          }}
        />
      )}

      <div style={{
        maxWidth: "60%",
        padding: "8px 12px",
        borderRadius: 10,
        background: mine ? "#DCF8C6" : "#fff",
        border: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        gap: 4
      }}>
        <div style={{ fontSize: 12, color: "#666" }}>
          {message.sender_name}
        </div>

        {/* TEXT */}
        {message.text && (
          <div style={{ whiteSpace: "pre-wrap" }}>
            {message.text}
          </div>
        )}

        {/* IMAGE PREVIEW */}
        {message.message_type === "image" && fileUrl && (
          <img
            src={fileUrl}
            alt="uploaded"
            style={{ maxWidth: "200px", borderRadius: 6 }}
          />
        )}

        {/* FILE PREVIEW */}
        {message.message_type === "file" && fileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "blue",
              textDecoration: "underline",
              wordBreak: "break-all"
            }}
          >
            📎 {fileUrl.split("/").pop()}
          </a>
        )}
      </div>
    </div>
  );
}
