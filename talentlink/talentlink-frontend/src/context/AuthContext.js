

// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await api.get('profile/');
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // ✅ REGISTER (DO NOT SAVE TOKENS HERE)
  const register = async (data) => {
    await api.post('register/', data);
    // backend returns 201 only → no tokens → no profile call
  };

  // ✅ LOGIN (USERNAME + PASSWORD ONLY)
  const login = async (data) => {
    const res = await api.post('login/', {
      username: data.username,
      password: data.password,
    });

    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);

    const profile = await api.get('profile/');
    setUser(profile.data);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await api.put('profile/', data);
    setUser(res.data);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ THIS MUST EXIST
export const useAuth = () => React.useContext(AuthContext);
