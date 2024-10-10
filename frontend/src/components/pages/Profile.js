import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthState';
import { ThemeContext } from '../../context/ThemeContext';
import axios from 'axios';
import Toast from '../Toast';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const Profile = () => {
  const { user, loadUser } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: ''
  });
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setFormData({ ...formData, name: user.name, email: user.email });
    }
  }, [user]);

  const { name, email, password, newPassword } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_BASE_URL}/api/users/profile`, formData);
      setMessage({ text: 'Profile updated successfully', type: 'success' });
      loadUser();
    } catch (err) {
      setMessage({ text: err.response.data.msg || 'Error updating profile', type: 'error' });
    }
  };

  return (
    <div className='profile-container'>
      <h1>User Profile</h1>
      <div className="profile-tabs">
        <button 
          className={activeTab === 'profile' ? 'active' : ''} 
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''} 
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>
      {activeTab === 'profile' && (
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
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Current Password</label>
            <input
              type='password'
              name='password'
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='newPassword'>New Password (optional)</label>
            <input
              type='password'
              name='newPassword'
              value={newPassword}
              onChange={onChange}
            />
          </div>
          <button type='submit' className='btn btn-primary'>Update Profile</button>
        </form>
      )}
      {activeTab === 'settings' && (
        <div className="settings-container">
          <h2>App Settings</h2>
          <div className="setting-item">
            <label htmlFor="theme-toggle">Dark Mode</label>
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="theme-toggle"
                checked={isDarkMode}
                onChange={toggleTheme}
              />
              <label htmlFor="theme-toggle"></label>
            </div>
          </div>
          {/* Add more settings here */}
        </div>
      )}
      {message && <Toast message={message.text} type={message.type} />}
    </div>
  );
};

export default Profile;