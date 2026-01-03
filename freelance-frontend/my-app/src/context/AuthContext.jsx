import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (access) {
      const payload = JSON.parse(atob(access.split(".")[1]));
      setUser({ username: payload.username });
    }
  }, []);

  // ✅ REGISTER
  const registerUser = async ({ username, email, password, password2 }) => {
    try {
      await API.post("/register/", {
        username,
        email,
        password,
        password2,
      });
      return true;
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data || error);
      return false;
    }
  };

  // ✅ LOGIN
  const loginUser = async ({ username, password }) => {
    try {
      const res = await API.post("/token/", { username, password });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      setUser({ username });
      return true;
    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data || error);
      return false;
    }
  };

  // ✅ LOGOUT
  const logoutUser = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        registerUser, // 🔥 THIS WAS MISSING
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

