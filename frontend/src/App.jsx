import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import API from './services/authService';
import { setUser, logout } from './features/auth/authSlice';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/Auth';
import Tasks from './pages/Tasks';
import TaskView from './pages/TaskView';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Login from './pages/Login';
import Header from './components/Header';
import ToastProvider from './components/ToastProvider';
import ConfirmProvider from './components/ConfirmProvider';
import AdminAttachments from './pages/AdminAttachments';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // On app start, if we have a token in persisted storage, validate it and fetch user profile
    const raw = localStorage.getItem('projxpert_auth');
    if (!raw) return;
    try {
      const { token } = JSON.parse(raw);
      if (!token) return;
      // call /api/auth/me to validate and get the latest profile
      API.get('/auth/me')
        .then(resp => {
          const user = resp.data.user;
          dispatch(setUser({ user, token }));
        })
        .catch(err => {
          console.warn('Session validation failed, logging out', err?.response?.status);
          dispatch(logout());
          localStorage.removeItem('projxpert_auth');
        });
    } catch (e) {
      // ignore JSON parse errors
    }
  }, [dispatch]);
  return (
    <ConfirmProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gradient-to-br from-proj-purple to-proj-blue text-white">
          <Header />
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/:id" element={<TaskView />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth/success" element={<AuthCallback />} />
              <Route path="/auth/failure" element={<AuthCallback />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/attachments" element={<AdminAttachments />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </ConfirmProvider>
  );
};

export default App;
