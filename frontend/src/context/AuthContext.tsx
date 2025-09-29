// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useMemo } from 'react';

// Mock user type
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string; // for leaderboard
}

// Mock auth context type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const mockUsers: User[] = [
  { id: '1', firstName: 'John', lastName: 'Doe', email: 'user@example.com', username: 'EcoWarrior' },
];

// Mock password hashing (for demonstration only)
const hashPassword = (password: string) => `hashed_${password}_secret`;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Check localStorage for a persistent mock login state
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('mockUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login logic
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call delay

    const foundUser = mockUsers.find(u => u.email === email);
    // In a real app, you would check the hashed password here.
    const isPasswordValid = hashPassword(password) === 'hashed_password123_secret' || foundUser; 
    
    if (foundUser && isPasswordValid) {
      setUser(foundUser);
      localStorage.setItem('mockUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    // Mock register logic
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call delay
    
    // Check if username or email already exists
    if (mockUsers.some(u => u.email === userData.email || u.username === userData.username)) {
      return false; 
    }

    const newUser: User = { 
      ...userData, 
      id: Date.now().toString() 
    };

    // Store hash (mock)
    console.log(`Saving user: ${newUser.email} with hashed password: ${hashPassword(userData.password)}`);
    
    mockUsers.push(newUser); // Add to mock DB
    setUser(newUser);
    localStorage.setItem('mockUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};