import React, { useEffect, useState } from 'react';
import API from '../services/authService';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, addTask, updateTask } from '../features/tasks/taskSlice';
import { Link, useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';

const Tasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector(s => s.tasks.list || []);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const resp = await API.get('/tasks');
      dispatch(setTasks(resp.data));
    } catch (err) {
      setError('Failed to load tasks');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleCreate = async (payload) => {
    try {
      const resp = await API.post('/tasks', payload);
      dispatch(addTask(resp.data));
      setCreating(false);
    } catch (err) {
      throw err.response?.data || new Error('Create failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl">Tasks</h2>
        <div>
          <button onClick={() => setCreating(!creating)} className="bg-proj-blue px-3 py-1 rounded">{creating ? 'Close' : 'New Task'}</button>
        </div>
      </div>
      {creating && (
        <div className="mb-6 bg-white/5 p-4 rounded">
          <TaskForm onSubmit={handleCreate} submitText="Create Task" />
        </div>
      )}

      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map(t => (
            <div key={t._id} className="p-4 bg-white/5 rounded">
              <h3 className="text-lg font-semibold">{t.title}</h3>
              <p className="text-sm mt-1">{t.description.substring(0, 140)}{t.description.length>140?'...':''}</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs">Status: {t.status}</div>
                <div className="space-x-2">
                  <Link to={`/tasks/${t._id}`} className="text-sm underline">View</Link>
                  <button onClick={() => navigate(`/tasks/${t._id}?edit=1`)} className="text-sm underline">Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <div className="text-red-300 mt-4">{error}</div>}
    </div>
  );
};

export default Tasks;
