import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fairshare_token'));
  const [loading, setLoading] = useState(true);

  // Load authenticated user profile on app startup if a token exists
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('fairshare_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiRequest('/auth/me');
        if (response.success && response.user) {
          setUser(response.user);
          setToken(storedToken);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.warn('Failed to verify saved session:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Log in an existing user
   */
  const login = async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    if (data.success && data.token) {
      localStorage.setItem('fairshare_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  /**
   * Register a new user
   */
  const register = async (name, email, password) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });

    if (data.success && data.token) {
      localStorage.setItem('fairshare_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  /**
   * Log out the current user
   */
  const logout = () => {
    localStorage.removeItem('fairshare_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook for accessing authentication state & actions
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
