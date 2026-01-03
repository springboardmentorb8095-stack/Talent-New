export default function DashboardLayout({ title, children }) {
  return (
    <div style={{ background: "#f4f6f8", minHeight: "100vh", padding: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>{title}</h2>
      {children}
    </div>
  );
}
