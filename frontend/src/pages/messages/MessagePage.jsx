import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatInput from "../../components/chat/ChatInput";
import MessageBubble from "../../components/chat/MessageBubble";

export default function MessagesPage({ contractId: propId }) {
  const { contractId: routeId } = useParams();
  // const { contractId: routeContractId } = useParams();
  const id = propId || routeId;
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const pollingRef = useRef(null);         // will store cancel token + running flag
  const lastIdRef = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const waitForMessages = async () => {
    if (!pollingRef.current?.running) return;

    const source = axios.CancelToken.source();
    pollingRef.current.cancel = source.cancel;

    try {
      const res = await axiosInstance.get(
        `/api/messages/${id}/long/`,
        {
          params: { last_id: lastIdRef.current },
          cancelToken: source.token
        }
      );

      if (res.data.length > 0) {
        setMessages(prev => {
          const ids = new Set(prev.map(m => m.id));
          const incoming = res.data.filter(m => !ids.has(m.id));
          return [...prev, ...incoming];
        });

        lastIdRef.current = res.data[res.data.length - 1].id;
      }

      // loop if component is still mounted
      if (pollingRef.current?.running) {
        waitForMessages();
      }

    } catch (err) {
      if (axios.isCancel(err)) {
        // cleanup cancel, no retry
        return;
      }
      console.log("Long poll error:", err);
      if (pollingRef.current?.running) {
        setTimeout(() => waitForMessages(), 1500);
      }
    }
  };

  const sendMessage = (text, file) => {
    const formData = new FormData();
    if (text) formData.append("text", text);
    if (file) formData.append("file", file);

    axiosInstance.post(`/api/messages/${id}/send/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).catch(err => console.log(err.response?.data));
  };

  useEffect(() => {
    // reset everything
    setMessages([]);
    lastIdRef.current = 0;

    // start polling
    pollingRef.current = { running: true, cancel: null };
    waitForMessages();

    // cleanup on unmount or contract change
    return () => {
      if (pollingRef.current?.cancel) pollingRef.current.cancel();
      pollingRef.current.running = false;
    };
  }, [id]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "80vh",
      width: "60%",
      margin: "auto",
      border: "1px solid #ccc",
      borderRadius: 8,
      padding: 10
    }}>
      <ChatHeader title={`Contract Chat #${id}`} />

      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: 10,
        background: "#f8f8f8",
        borderRadius: 6,
        marginBottom: 10
      }}>
        {messages.map(m => <MessageBubble key={m.id} message={m} />)}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={(text, file) => sendMessage(text, file)} />
    </div>
  );
}
