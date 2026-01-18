import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role restricted route
  if (role && user.role !== role) {
    // Redirect client & freelancer correctly
    if (user.role === "client") {
      return <Navigate to="/client/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
