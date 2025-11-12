import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/auth.service";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Auth status check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const register = async (email, password, name) => {
    try {
      const session = await authService.createAccount(email, password, name);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return { success: true, data: session };
    } catch (error) {
      console.error("Registration failed:", error);
      return { success: false, error };
    }
  };

  const login = async (email, password) => {
    try {
      const session = await authService.login(email, password);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return { success: true, data: session };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error("Logout failed:", error);
      return { success: false, error };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};