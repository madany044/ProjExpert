import { createSlice } from '@reduxjs/toolkit';

const initialState = { list: [], status: 'idle' };

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action) {
      state.list = action.payload;
    },
    addTask(state, action) {
      state.list.unshift(action.payload);
    },
    updateTask(state, action) {
      state.list = state.list.map(t => (t._id === action.payload._id ? action.payload : t));
    }
  }
});

export const { setTasks, addTask, updateTask } = taskSlice.actions;
export default taskSlice.reducer;
