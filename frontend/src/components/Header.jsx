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
    // reload so app calls /api/auth/me and clears state
    window.location.href = FRONTEND_URL;
  };

  return (
    <header className="p-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold">ProjXpert</Link>
      <nav className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        {user ? (
          <>
            <span className="ml-4">Hi, {user.name || user.email}</span>
            <button onClick={doLogout} className="ml-4 inline-block bg-white/10 px-3 py-1 rounded hover:bg-white/20">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="ml-4 inline-block bg-white/10 px-3 py-1 rounded hover:bg-white/20">Login</Link>
            <Link to="/register" className="ml-2 inline-block bg-white/10 px-3 py-1 rounded hover:bg-white/20">Register</Link>
            <a href="/api/auth/google" className="ml-2 inline-block bg-white/10 px-3 py-1 rounded hover:bg-white/20">Login with Google</a>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
