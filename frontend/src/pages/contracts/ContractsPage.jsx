import { useState } from "react";
import ContractList from "./ContractList";
import MessagesPage from "../messages/MessagePage";

export default function ContractsPage() {
  const [activeContract, setActiveContract] = useState(null);

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      {/* <ContractList onOpenChat={(id) => console.log("open chat", id)} /> */}

      <ContractList onOpenChat={(id) => setActiveContract(id)} />
      
      <div style={{ flex: 1 }}>
        {activeContract ? (
          <MessagesPage contractId={activeContract} />
        ) : (
          <p style={{ padding: 20 }}>Select a contract to open chat.</p>
        )}
      </div>

    </div>
  );
}
