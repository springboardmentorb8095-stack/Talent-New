import { useState } from "react";
import ContractsSidebar from "../components/ContractsSidebar";
import ChatFrame from "../components/ChatFrame";

export default function ConversationsPage() {
  const [activeContractId, setActiveContractId] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ContractsSidebar onOpenChat={(id) => setActiveContractId(id)} />

      <ChatFrame contractId={activeContractId} />
    </div>
  );
}
