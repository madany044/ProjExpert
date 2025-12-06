import React, { useEffect, useState } from 'react';
import API from '../services/authService';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, addTask } from '../features/tasks/taskSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';
import TaskForm from '../components/TaskForm';

const Tasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { push: toast } = useToast();
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
      toast('Failed to load tasks', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (payload) => {
    try {
      const resp = await API.post('/tasks', payload);
      dispatch(addTask(resp.data));
      setCreating(false);
      toast('Task created successfully!', { type: 'success' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Create failed';
      toast(msg, { type: 'error' });
      throw err;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Tasks</h1>
          <p className="text-gray-400">Manage your project submissions</p>
        </div>
        <button
          onClick={() => setCreating(!creating)}
          className={`btn-primary ${creating ? 'bg-error' : ''} whitespace-nowrap`}
        >
          {creating ? '✕ Cancel' : '➕ New Task'}
        </button>
      </div>

      {/* Create Form */}
      {creating && (
        <div className="card mb-8 fade-in">
          <h2 className="text-2xl font-bold mb-6">Create New Task</h2>
          <TaskForm onSubmit={handleCreate} submitText="Create Task" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card bg-red-900/20 border-red-700 text-red-200 mb-8">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="card text-center">
          <p className="text-gray-400">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
          <p className="text-gray-400 mb-6">Create your first task to get started</p>
          <button
            onClick={() => setCreating(true)}
            className="btn-primary"
          >
            Create Your First Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((t) => (
            <Link
              key={t._id}
              to={`/tasks/${t._id}`}
              className="card-hover group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white group-hover:text-proj-blue transition flex-1">
                  {t.title}
                </h3>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  t.status === 'completed' ? 'bg-success/20 text-success' :
                  t.status === 'in-progress' ? 'bg-warning/20 text-warning' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {t.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {t.description}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  {t.attachments?.length || 0} files
                </span>
                <span className={`font-semibold ${
                  t.priority === 'high' ? 'text-error' :
                  t.priority === 'medium' ? 'text-warning' :
                  'text-success'
                }`}>
                  {t.priority} priority
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
