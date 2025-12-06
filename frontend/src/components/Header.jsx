import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const Header = () => {
  const user = useSelector(state => state.auth.user);

  const doLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      // ignore
    }
    window.location.href = FRONTEND_URL;
  };

  return (
    <header className="sticky top-0 z-40 bg-dark-card/95 backdrop-blur border-b border-gray-700 shadow-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-p rounded-lg flex items-center justify-center font-bold text-white">
              P
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:inline">ProjXpert</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                <div className="text-right hidden xs:block">
                  <div className="text-sm text-gray-300">Hi, {user.name || user.email}</div>
                </div>
                <Link to="/profile" className="btn-secondary text-sm py-1 px-3">Profile</Link>
                <button onClick={doLogout} className="btn-danger text-sm py-1 px-3">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-1 px-3 hidden sm:inline-block">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-1 px-3">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
