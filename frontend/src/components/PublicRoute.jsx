import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    // Redirect logged-in users based on role
    if (user?.role === "client") {
      return <Navigate to="/client/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
