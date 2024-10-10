import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Toast from '../Toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { email, password } = formData;
  const { handleLogin, loading, error, clearErrors } = useAuth();
  const navigate = useNavigate();
  const [verificationNeeded, setVerificationNeeded] = useState(false);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    console.log('Submitting login data:', { email, password });
    if (email === '' || password === '') {
      Toast({ message: 'Please fill in all fields', type: 'error' });
    } else {
      const result = await handleLogin({ email, password });
      if (result.success) {
        navigate('/');
      } else if (result.message === 'Please verify your email before logging in') {
        setVerificationNeeded(true);
      } else {
        Toast({ message: result.message, type: 'error' });
      }
    }
  };

  return (
    <div className='form-container'>
      <h1>Account <span className='text-primary'>Login</span></h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>Email Address</label>
          <input
            type='email'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={onChange}
            required
            minLength='6'
          />
        </div>
        <button type='submit' className='btn btn-primary btn-block' disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {verificationNeeded && (
        <div className="verification-message">
          <p>Please verify your email before logging in. 
            <Link to="/resend-verification">Resend verification email</Link>
          </p>
        </div>
      )}
      {error && <Toast message={error} type="error" onClose={clearErrors} />}
      <p>
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>
      <p>
        Need to verify your email? <Link to="/resend-verification">Resend verification email</Link>
      </p>
    </div>
  );
};

export default Login;