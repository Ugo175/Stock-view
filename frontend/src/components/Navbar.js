import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            StockView
          </Link>
          
          <ul className="navbar-nav">
            <li><Link to="/">Home</Link></li>
            {user && (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/portfolio">Portfolio</Link></li>
              </>
            )}
          </ul>

          <div className="auth-buttons">
            {user ? (
              <>
                <span style={{ color: 'white', marginRight: '1rem' }}>
                  Welcome, {user.firstName}!
                </span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
