import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthState';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const onLogout = () => {
    logout();
  };

  const authLinks = (
    <>
      <li>Hello, {user && user.name}</li>
      <li><Link to="/profile">Profile</Link></li>
      <li>
        <a onClick={onLogout} href="#!">
          <i className="fas fa-sign-out-alt"></i> <span className="hide-sm">Logout</span>
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </>
  );

  return (
    <nav className="navbar">
      <h1>
        <Link to="/"><i className="fas fa-code"></i> ContentHub</Link>
      </h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        {isAuthenticated ? authLinks : guestLinks}
        <li>
          <button onClick={toggleTheme} className="btn-theme-toggle">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;