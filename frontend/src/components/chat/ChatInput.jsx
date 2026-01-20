import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(text, file);
    setText("");
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex" }}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ marginRight: "5px" }} />
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ flex: 1, marginRight: "5px" }}
      />
      <button type="submit" disabled={!text && !file}>Send</button>
    </form>
  );
}
