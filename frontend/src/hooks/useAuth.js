import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthState';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { register, login, logout, clearErrors } = context;

  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await register(userData);
      setLoading(false);
      return { success: true, message: 'Registration successful! Please check your email to verify your account.' };
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
      setLoading(false);
      return { success: false, message: err.response?.data?.msg || 'Registration failed' };
    }
  };

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      await login(credentials);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Login failed';
      setError(errorMessage);
      setLoading(false);
      return { success: false, message: errorMessage };
    }
  };

  const handleLogout = () => {
    logout();
  };

  return {
    ...context,
    handleRegister,
    handleLogin,
    handleLogout,
    loading,
    error,
    clearErrors
  };
};