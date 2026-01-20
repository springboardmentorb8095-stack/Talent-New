import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMessages, sendMessage } from "../api/messages";

export default function ChatWindow() {
  const { contractId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!contractId) return;
    getMessages(contractId).then(res => setMessages(res.data));
  }, [contractId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const res = await sendMessage(contractId, text);
    setMessages(prev => [...prev, res.data]);
    setText("");
  };

  if (!contractId) return <p>Select a contract to start chat.</p>;

  return (
    <div style={{ padding: "10px" }}>
      <h3>Chat</h3>
      <div style={{ height: "70vh", overflowY: "auto", border: "1px solid #ddd", padding: "10px" }}>
        {messages.map(m => (
          <div key={m.id} style={{ marginBottom: "8px" }}>
            <b>{m.sender}:</b> {m.content}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "10px" }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
          style={{ width: "80%", padding: "6px" }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
