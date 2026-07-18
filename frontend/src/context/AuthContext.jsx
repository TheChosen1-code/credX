import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    return token ? { token, role } : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    if (token) setUser({ token, role });
  }, []);

  const login = async (payload) => {
    const res = await authApi.login(payload);
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    if (res.role) localStorage.setItem('role', res.role);
    setUser({ token: res.accessToken, role: res.role });
    return res;
  };

  const signup = async (payload) => {
    const res = await authApi.signup(payload);
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    if (res.role) localStorage.setItem('role', res.role);
    setUser({ token: res.accessToken, role: res.role });
    return res;
  };

  const setRole = (role) => {
    localStorage.setItem('role', role);
    setUser((u) => (u ? { ...u, role } : { token: localStorage.getItem('accessToken'), role }));
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, setRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
