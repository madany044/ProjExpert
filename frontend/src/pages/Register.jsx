import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import API from '../services/authService';
import { setUser } from '../features/auth/authSlice';
import { useToast } from '../components/ToastProvider';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { push: toast } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast('Please fill in all fields', { type: 'error' });
      return;
    }
    
    if (password !== confirmPassword) {
      toast('Passwords do not match', { type: 'error' });
      return;
    }
    
    if (password.length < 6) {
      toast('Password must be at least 6 characters', { type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await API.post('/auth/register', { name, email, password });
      const resp = await API.get('/auth/me');
      dispatch(setUser({ user: resp.data.user }));
      localStorage.setItem('projxpert_auth', JSON.stringify({ user: resp.data.user }));
      toast('Registration successful!', { type: 'success' });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast(msg, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md fade-in">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-gray-400 mb-8">Join ProjXpert today</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="John Doe"
              disabled={loading}
              required
            />
          </div>
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
              placeholder="At least 6 characters"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              placeholder="Re-enter your password"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-center py-3 font-semibold disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-center text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="text-proj-blue hover:text-proj-purple font-semibold">
              Sign in
            </a>
          </p>
        </div>

        <div className="mt-6">
          <a
            href="/api/auth/google"
            className="btn-secondary w-full text-center py-3 font-semibold block"
          >
            🔐 Sign up with Google
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
