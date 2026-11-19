import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('truehire_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('truehire_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('truehire_token');
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res && res.data) {
            setUser(res.data);
            localStorage.setItem('truehire_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Initial login call:
   * Returns { requiresOtp: true, challengeId, email, role } for Candidate & Recruiter
   * Returns user object directly for Admin
   */
  const login = async (email, password, expectedRole) => {
    const response = await authService.login({ email, password, expectedRole });
    const payload = response.data || response;
    const data = payload.data || payload;

    // Check if OTP challenge is required
    if (data.requiresOtp) {
      return data;
    }

    // Direct login (Admin)
    const receivedToken = data.token || payload.token;
    const receivedUser = data.user || payload.user;
    if (receivedToken && receivedUser) {
      // Validate role consistency
      if (expectedRole && receivedUser.role !== expectedRole) {
        throw new Error(`Unauthorized role access: Expected ${expectedRole}, got ${receivedUser.role}`);
      }
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('truehire_token', receivedToken);
      localStorage.setItem('truehire_user', JSON.stringify(receivedUser));
      return receivedUser;
    }

    return data;
  };

  /**
   * Complete OTP verification and establish authenticated session
   */
  const verifyLoginOtp = async (challengeId, otp, expectedRole) => {
    const response = await authService.verifyLoginOtp({ challengeId, otp, expectedRole });
    const payload = response.data || response;
    const data = payload.data || payload;
    const receivedToken = data.token || payload.token;
    const receivedUser = data.user || payload.user;

    if (receivedToken && receivedUser) {
      if (expectedRole && receivedUser.role !== expectedRole) {
        throw new Error(`Unauthorized role access: Expected ${expectedRole}, got ${receivedUser.role}`);
      }
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('truehire_token', receivedToken);
      localStorage.setItem('truehire_user', JSON.stringify(receivedUser));
      return receivedUser;
    }

    return data;
  };

  const forgotPassword = async (email) => {
    const response = await authService.forgotPassword({ email });
    return response.data || response;
  };

  const resetPassword = async (email, resetCode, newPassword) => {
    const response = await authService.resetPassword({ email, resetCode, newPassword });
    return response.data || response;
  };

  /**
   * Resend OTP code with cooldown
   */
  const resendLoginOtp = async (challengeId) => {
    const response = await authService.resendLoginOtp({ challengeId });
    return response.data || response;
  };

  const register = async (data) => {
    const response = await authService.register(data);
    const payload = response.data || response;
    const rawData = payload.data || payload;
    const receivedToken = rawData.token || payload.token;
    const receivedUser = rawData.user || payload.user;

    if (receivedToken && receivedUser) {
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('truehire_token', receivedToken);
      localStorage.setItem('truehire_user', JSON.stringify(receivedUser));
      return receivedUser;
    }

    return rawData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('truehire_token');
    localStorage.removeItem('truehire_user');
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getCurrentUser();
      if (res && res.data) {
        setUser(res.data);
        localStorage.setItem('truehire_user', JSON.stringify(res.data));
      }
    } catch (e) {
      console.error('Failed to refresh user', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        role: user?.role,
        loading,
        login,
        verifyLoginOtp,
        resendLoginOtp,
        forgotPassword,
        resetPassword,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
