import { createSlice } from '@reduxjs/toolkit';

const initialState = { user: null, status: 'idle' };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
    },
    logout(state) {
      state.user = null;
      // token is stored as httpOnly cookie; nothing to clear client-side
    }
  }
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
