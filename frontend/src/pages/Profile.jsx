import React, { useEffect, useState } from 'react';
import API from '../services/authService';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';

const Profile = () => {
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatarUrl(user.avatarUrl || '');
    } else {
      // fetch user if not in store
      API.get('/auth/me').then(r => dispatch(setUser({ user: r.data.user }))).catch(() => {});
    }
  }, [user, dispatch]);

  const save = async (e) => {
    e.preventDefault();
    setStatus('saving');
    try {
      const resp = await API.put('/auth/me', { name, avatarUrl });
      dispatch(setUser({ user: resp.data.user }));
      setStatus('saved');
      setEditing(false);
    } catch (err) {
      setStatus('error');
    }
  };

  if (!user) return <div className="max-w-2xl mx-auto mt-8 p-6 bg-white/10 rounded">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white/10 rounded">
      <div className="flex items-center gap-4">
        <img src={user.avatarUrl || 'https://via.placeholder.com/80'} alt="avatar" className="w-20 h-20 rounded-full" />
        <div>
          <h2 className="text-2xl font-semibold">{user.name || user.email}</h2>
          <div className="text-sm">Role: <span className="font-medium">{user.role}</span> {user.role === 'admin' && <span className="ml-2 inline-block bg-yellow-500 text-black px-2 py-0.5 rounded">ADMIN</span>}</div>
          <div className="mt-2">
            <button onClick={() => setEditing(!editing)} className="bg-proj-blue px-3 py-1 rounded">{editing ? 'Cancel' : 'Edit Profile'}</button>
          </div>
        </div>
      </div>

      {editing && (
        <form onSubmit={save} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2 rounded bg-white/5" />
          </div>
          <div>
            <label className="block text-sm">Avatar URL</label>
            <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} className="w-full p-2 rounded bg-white/5" />
          </div>
          <div>
            <button className="bg-proj-blue px-4 py-2 rounded">Save</button>
            {status === 'saving' && <span className="ml-3">Saving...</span>}
            {status === 'saved' && <span className="ml-3 text-green-300">Saved</span>}
            {status === 'error' && <span className="ml-3 text-red-300">Error saving</span>}
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
