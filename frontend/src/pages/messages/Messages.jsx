import { useEffect, useRef, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export default function Messages() {
  const { user } = useAuth();

  const [contracts, setContracts] = useState([]);
  const [activeContract, setActiveContract] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // 🔹 unread tracking
  const [unread, setUnread] = useState({});
  const lastSeenRef = useRef({});

  const intervalRef = useRef(null);

  // Load contracts
  useEffect(() => {
    api.get("/contracts/").then((res) => {
      setContracts(res.data);
    });
  }, []);

  const fetchMessages = async (contractId) => {
    const res = await api.get(`/chat/${contractId}/`);
    const newMessages = res.data;

    // unread calculation
    const lastSeenId = lastSeenRef.current[contractId] || 0;
    const unreadCount = newMessages.filter(
      (m) =>
        m.sender_id !== user.id &&
        m.id > lastSeenId
    ).length;

    setUnread((prev) => ({
      ...prev,
      [contractId]: unreadCount,
    }));

    setMessages(newMessages);
  };

  // Polling
  useEffect(() => {
    if (!activeContract) return;

    fetchMessages(activeContract.id);

    intervalRef.current = setInterval(() => {
      fetchMessages(activeContract.id);
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, [activeContract]);

  const openContract = (contract) => {
    setActiveContract(contract);
    lastSeenRef.current[contract.id] =
      messages[messages.length - 1]?.id || 0;

    setUnread((prev) => ({
      ...prev,
      [contract.id]: 0,
    }));
  };

  const sendMessage = async () => {
    if (!text.trim() || !activeContract) return;

    await api.post(
      `/chat/${activeContract.id}/send/`,
      { content: text }
    );

    setText("");
    fetchMessages(activeContract.id);
  };

  return (
    <div className="flex h-[80vh] bg-white rounded shadow">
      {/* LEFT: CONTRACT LIST */}
      <div className="w-1/4 border-r p-4">
        <h3 className="font-bold mb-3">Chats</h3>

        {contracts.map((c) => (
          <button
            key={c.id}
            onClick={() => openContract(c)}
            className="relative block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
          >
            {c.project}

            {/* 🔴 UNREAD BADGE */}
            {unread[c.id] > 0 && (
              <span className="absolute top-2 right-3 bg-red-600 text-white text-xs px-2 rounded-full">
                {unread[c.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* RIGHT: CHAT WINDOW */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {!activeContract && (
            <p className="text-gray-500">
              Select a contract to start chatting
            </p>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[70%] p-2 rounded ${
                m.sender_id === user.id
                  ? "bg-indigo-600 text-white ml-auto"
                  : "bg-gray-100"
              }`}
            >
              <p className="text-sm">{m.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {m.sender_username}
              </p>
            </div>
          ))}
        </div>

        {activeContract && (
          <div className="p-3 border-t flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-indigo-600 text-white px-4 rounded"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
