// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useMemo } from 'react';

interface User {
  _id: string;       // <-- fix: remove dot
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (userData: Omit<User, '_id'> & { password: string }) => Promise<boolean>; // <-- omit _id
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BASE_URL = "http://localhost:3000/api/users";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // --- LOGIN ---
  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return null;

      const data = await res.json();

      const loggedInUser: User = {
        _id: data.user.userId,       // <-- use _id
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        username: data.user.username,
      };

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  };

  // --- REGISTER ---
  const register = async (userData: Omit<User, '_id'> & { password: string }): Promise<boolean> => {
    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) return false;

      const data = await res.json();

      const newUser: User = {
        _id: data.user.userId,      
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        username: data.user.username,
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
