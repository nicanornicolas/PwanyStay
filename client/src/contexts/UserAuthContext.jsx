import React, { createContext, useContext, useState, useEffect } from 'react';
import { post } from '../lib/api';

const UserAuthContext = createContext();

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

export const UserAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('userToken') || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // For now, just check if token exists and is valid by making a simple request
      if (token) {
        // You could add a /me endpoint to verify token
        setIsAuthenticated(true);
        // Extract user from token if needed
      }
    } catch {
      setIsAuthenticated(false);
      setToken(null);
      localStorage.removeItem('userToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await post('/api/auth/login', { email, password });
      if (response.success) {
        const userToken = response.data.token;
        const userData = response.data.user;
        setToken(userToken);
        setUser(userData);
        localStorage.setItem('userToken', userToken);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch {
      return { success: false, message: 'Login failed' };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await post('/api/auth/register', { email, password });
      if (response.success) {
        // Registration successful, but email verification required
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch {
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      // Optional: call logout endpoint if exists
      // await post('/api/auth/logout', {});
    } catch {
      console.error('Logout error');
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('userToken');
      setIsAuthenticated(false);
    }
  };

  const value = {
    isAuthenticated,
    loading,
    token,
    user,
    login,
    register,
    logout,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};