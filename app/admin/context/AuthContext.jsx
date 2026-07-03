"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Start with null to match server-rendered state (no localStorage on server)
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('mbv-admin-token');
      const savedAdmin = localStorage.getItem('mbv-admin-user');
      if (token && savedAdmin) {
        const parsed = JSON.parse(savedAdmin);
        if (parsed && typeof parsed === 'object') {
          setAdmin(parsed);
        }
      }
    } catch (err) {
      // Corrupted localStorage data — clear it to prevent repeated failures
      console.error('Failed to parse saved admin data:', err.message);
      localStorage.removeItem('mbv-admin-token');
      localStorage.removeItem('mbv-admin-user');
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    localStorage.setItem('mbv-admin-token', data.token);
    localStorage.setItem('mbv-admin-user', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('mbv-admin-token');
    localStorage.removeItem('mbv-admin-user');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
