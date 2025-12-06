import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import API from '../services/authService';
import { setUser } from '../features/auth/authSlice';
import { useToast } from '../components/ToastProvider';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { push: toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast('Please fill in all fields', { type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      const user = res.data.user;
      const meRes = await API.get('/auth/me');
      dispatch(setUser({ user: meRes.data.user }));
      localStorage.setItem('projxpert_auth', JSON.stringify({ user: meRes.data.user }));
      toast('Login successful!', { type: 'success' });
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast(msg, { type: 'error' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md fade-in">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-400 mb-8">Sign in to continue to ProjXpert</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-center py-3 font-semibold disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-center text-gray-400">
            Don't have an account?{' '}
            <a href="/register" className="text-proj-blue hover:text-proj-purple font-semibold">
              Sign up
            </a>
          </p>
        </div>

        <div className="mt-6">
          <a
            href="/api/auth/google"
            className="btn-secondary w-full text-center py-3 font-semibold block"
          >
            🔐 Sign in with Google
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
