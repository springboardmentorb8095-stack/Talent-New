import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function RoleProtectedRoute({ allowedRole, children }) {
  const { user, isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleProtectedRoute;
