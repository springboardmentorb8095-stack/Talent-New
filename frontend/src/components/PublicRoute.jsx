import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PublicRoute({ children }) {
  const { isLoggedIn, user } = useContext(AuthContext);

  if (isLoggedIn && user) {
    // Redirect logged-in users based on role
    if (user.role === "client") {
      return <Navigate to="/client/dashboard" replace />;
    }
    if (user.role === "freelancer") {
      return <Navigate to="/freelancer/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;
