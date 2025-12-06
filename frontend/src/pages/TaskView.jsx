import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import API from '../services/authService';
import TaskForm from '../components/TaskForm';
import { useDispatch } from 'react-redux';
import { updateTask as updateTaskAction } from '../features/tasks/taskSlice';
import ImageModal from '../components/ImageModal';
import { useToast } from '../components/ToastProvider';
import { useConfirm } from '../components/ConfirmProvider';

const TaskView = () => {
  const { id } = useParams();
  const [search] = useSearchParams();
  const editMode = search.get('edit') === '1';
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewer, setViewer] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    API.get(`/tasks/${id}`).then(r => setTask(r.data)).catch(e => setError('Failed to load')).finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (payload) => {
    try {
      const resp = await API.put(`/tasks/${id}`, payload);
      setTask(resp.data);
      dispatch(updateTaskAction(resp.data));
      navigate(`/tasks/${id}`);
    } catch (err) {
      throw err.response?.data || new Error('Update failed');
    }
  };

  const handleDelete = async () => {
    const ok = await confirm('Delete this task?');
    if (!ok) return;
    try {
      await API.delete(`/tasks/${id}`);
      toast.push('Task deleted');
      navigate('/tasks');
    } catch (err) {
      setError('Delete failed');
      toast.push('Delete failed', { type: 'error' });
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-300">{error}</div>;
  if (!task) return <div className="p-6">Not found</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white/10 rounded">
      {editMode ? (
        <TaskForm initial={task} onSubmit={handleUpdate} submitText="Update Task" />
      ) : (
        <>
          <h2 className="text-2xl font-semibold">{task.title}</h2>
          <div className="text-sm mt-2">Status: {task.status} • Priority: {task.priority}</div>
          <p className="mt-4 whitespace-pre-wrap">{task.description}</p>
          <div className="mt-4">
            <div className="flex gap-2 items-center">
              { (task.attachments||[]).map(att => (
                <div key={att.public_id || att.url || att.filename} className="mr-2">
                  {att.mimeType && att.mimeType.startsWith('image') && att.url ? (
                    <img src={att.url} alt={att.filename} className="w-20 h-20 object-cover rounded cursor-pointer" onClick={() => setViewer(att.url)} />
                  ) : (
                    <a href={att.url} target="_blank" rel="noreferrer" className="underline text-sm">{att.filename || 'file'}</a>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => navigate(`/tasks/${id}?edit=1`)} className="bg-proj-blue px-3 py-1 rounded">Edit</button>
            <button onClick={handleDelete} className="bg-red-600 px-3 py-1 rounded">Delete</button>
          </div>
        </>
      )}
      <ImageModal src={viewer} onClose={() => setViewer(null)} />
    </div>
  );
};

export default TaskView;
