import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ role, children }) {
  const token = localStorage.getItem("access_token");
  const userRole = localStorage.getItem("role");

  // Not logged in
  if (!token || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch
  if (userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


