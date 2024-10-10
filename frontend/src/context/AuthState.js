import React, { createContext, useReducer } from 'react';
import AuthReducer from './AuthReducer';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null
};

export const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // Set auth token
  const setAuthToken = token => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
    }
  };

  // Load User
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      console.log('Attempting to load user...');
      const res = await axios.get(`${API_BASE_URL}/api/auth`);
      console.log('User loaded successfully:', res.data);
      dispatch({ type: 'USER_LOADED', payload: res.data });
    } catch (err) {
      console.error('Error loading user:', err.response ? err.response.data : err.message);
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Register User
  const register = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      console.log('Sending registration request with data:', formData);
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, formData, config);
      console.log('Registration response:', res.data);
      dispatch({ 
        type: 'REGISTER_SUCCESS', 
        payload: { msg: res.data.msg } 
      });
      // Remove the loadUser() call from here
    } catch (err) {
      console.error('Registration error:', err.response ? err.response.data : err.message);
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.msg || 'Registration failed'
      });
    }
  };

  // Login User
  const login = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      console.log('Attempting login with:', formData.email);
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, formData, config);
      console.log('Login response:', res.data);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      setAuthToken(res.data.token);
      await loadUser();
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.msg || 'Login failed'
      });
    }
  };

  // Logout
  const logout = () => {
    setAuthToken(null);
    dispatch({ type: 'LOGOUT' });
  };

  // Clear Errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;