import { Outlet } from "react-router-dom";
import ContractsSidebar from "../components/ContractsSidebar";

export default function MessagesLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ContractsSidebar />
      <div style={{ flex: 1, borderLeft: "1px solid #ddd" }}>
        <Outlet /> 
      </div>
    </div>
  );
}
