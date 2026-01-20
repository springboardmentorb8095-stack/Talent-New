// import MessagesPage from "pages/MessagesPage";
import MessagesPage from "../pages/messages/MessagePage";

export default function ChatFrame({ contractId }) {
  if (!contractId) {
    return (
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <p>Select a contract to open chat.</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1 }}>
      <MessagesPage contractId={contractId} />
    </div>
  );
}
