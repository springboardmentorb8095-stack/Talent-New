import { useEffect, useRef } from "react";

export default function useContractSocket(contractId, onMessage) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/contracts/${contractId}/`);

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      onMessage(data);
    };

    return () => socketRef.current.close();
  }, [contractId]);

  const sendMessage = (content) => {
    socketRef.current.send(JSON.stringify({ content }));
  };

  return { sendMessage };
}
