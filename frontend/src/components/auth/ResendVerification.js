import React, { useState } from 'react';
import axios from 'axios';
import Toast from '../Toast';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Attempting to resend verification email to:', email);
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/resend-verification`, { email });
      console.log('Resend verification response:', res.data);
      setMessage(res.data.msg);
    } catch (err) {
      console.error('Resend verification error:', err.response?.data || err.message);
      if (err.response?.data?.msg === 'User not found') {
        setMessage('No account found with this email address. Please check your email or register a new account.');
      } else if (err.response?.data?.msg === 'This account is already verified') {
        setMessage('This account is already verified. You can proceed to login.');
      } else {
        setMessage(err.response?.data?.msg || 'An error occurred while resending verification email');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Resend Verification Email</h2>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Resend Verification'}
        </button>
      </form>
      {message && <Toast message={message} type={message.includes('success') ? 'success' : 'error'} />}
    </div>
  );
};

export default ResendVerification;