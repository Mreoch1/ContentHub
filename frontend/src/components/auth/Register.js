import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Toast from '../Toast';
import PasswordStrengthMeter from '../PasswordStrengthMeter';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const { name, email, password, password2 } = formData;
  const { handleRegister, loading, error, clearErrors } = useAuth();
  const navigate = useNavigate();
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      Toast({ message: "Passwords don't match", type: 'error' });
    } else {
      const result = await handleRegister({ name, email, password });
      if (result.success) {
        setRegistrationStatus('Registration successful. Please check your email to verify your account.');
        // Don't navigate to home page
      } else {
        setRegistrationStatus(result.message);
      }
    }
  };

  return (
    <div className='form-container'>
      <h1>Account <span className='text-primary'>Register</span></h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            name='name'
            value={name}
            onChange={onChange}
            required
          />
        </div>
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
          <PasswordStrengthMeter password={password} />
        </div>
        <div className='form-group'>
          <label htmlFor='password2'>Confirm Password</label>
          <input
            type='password'
            name='password2'
            value={password2}
            onChange={onChange}
            required
            minLength='6'
          />
        </div>
        <button type='submit' className='btn btn-primary btn-block' disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {registrationStatus && <Toast message={registrationStatus} type={registrationStatus.includes('successful') ? 'success' : 'error'} onClose={() => setRegistrationStatus(null)} />}
      {error && <Toast message={error} type="error" onClose={clearErrors} />}
    </div>
  );
};

export default Register;