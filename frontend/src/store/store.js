import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import taskReducer from '../features/tasks/taskSlice';

// NOTE: with httpOnly cookie-based sessions we avoid storing tokens in localStorage.
// We still create the store and populate auth via /api/auth/me on app start.
const store = configureStore({
  reducer: { auth: authReducer, tasks: taskReducer }
});

export default store;
