import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setMessage(err.response.data.message || 'Login failed');
      if (err.response.data.message === 'Please verify your email before logging in') {
        // Add a button to resend verification email
        setMessage(err.response.data.message + ' Click here to resend verification email.');
      }
    }
  };

  const resendVerification = async () => {
    try {
      await axios.post('/api/auth/resend-verification', { email });
      setMessage('Verification email sent. Please check your inbox.');
    } catch (err) {
      setMessage(err.response.data.message || 'Failed to resend verification email');
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && (
        <p>
          {message}
          {message.includes('verify your email') && (
            <button onClick={resendVerification}>Resend Verification Email</button>
          )}
        </p>
      )}
    </div>
  );
};

export default Login;