import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import API from '../services/authService';
import { setUser } from '../features/auth/authSlice';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await API.post('/auth/register', { name, email, password });
      // server sets httpOnly cookie; validate and fetch profile
      const resp = await API.get('/auth/me');
      dispatch(setUser({ user: resp.data.user }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white/10 p-8 rounded">
      <h2 className="text-xl mb-4">Register</h2>
      {error && <div className="mb-3 text-red-300">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm">Name</label>
          <input className="w-full p-2 rounded bg-white/5" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input className="w-full p-2 rounded bg-white/5" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" className="w-full p-2 rounded bg-white/5" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div>
          <button type="submit" className="bg-proj-blue px-4 py-2 rounded">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
