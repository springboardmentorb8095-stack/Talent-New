import { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser } from "../api/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      const access = localStorage.getItem("access");
      if (access) {
        try {
          const data = await getCurrentUser(); // Axios interceptor adds access
          setUser(data);
          setIsLoggedIn(true);
        } catch (err) {
          console.log("Token invalid or refresh failed, logging out");
          localStorage.clear();
          setUser(null);
          setIsLoggedIn(false);
        }
      }
      setLoading(false);
    };
    initializeUser();
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, setUser, setIsLoggedIn, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};