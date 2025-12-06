import React, { useEffect, useState } from 'react';
import API from '../services/authService';
import { useToast } from '../components/ToastProvider';
import { useConfirm } from '../components/ConfirmProvider';

const AdminAttachments = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const confirm = useConfirm();

  const fetch = async () => {
    setLoading(true);
    try {
      const r = await API.get('/admin/attachments');
      setList(r.data.attachments || []);
    } catch (err) {
      toast.push('Failed to load attachments', { type: 'error' });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleCloudCompare = async () => {
    setLoading(true);
    try {
      const r = await API.get('/admin/attachments/cloud');
      const orphans = r.data.orphaned || [];
      if (orphans.length === 0) {
        toast.push('No orphaned attachments found');
      } else {
        toast.push(`${orphans.length} orphaned attachments found`);
        // show a simple confirm and bulk delete
        const ok = await confirm('Delete all orphaned uploads from Cloudinary?');
        if (ok) {
          const pids = orphans.map(o => o.public_id);
          await API.post('/admin/attachments/delete', { public_ids: pids });
          toast.push('Orphans deleted');
          fetch();
        }
      }
    } catch (err) {
      toast.push('Cloud compare failed', { type: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl">Admin — Attachments</h2>
        <div>
          <button onClick={fetch} className="bg-proj-blue px-3 py-1 rounded mr-2">Refresh</button>
          <button onClick={handleCloudCompare} className="bg-yellow-500 px-3 py-1 rounded">Find Orphans</button>
        </div>
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map(a => (
            <div key={a.public_id || a.url || a.filename} className="p-3 bg-white/5 rounded">
              <div className="text-sm font-medium">{a.filename}</div>
              <div className="text-xs text-muted">Task: {a.taskTitle || ''}</div>
              <div className="mt-2 flex gap-2">
                {a.url && <a href={a.url} target="_blank" rel="noreferrer" className="underline text-sm">Open</a>}
                {a.public_id && (
                  <button onClick={async () => {
                    const ok = await confirm('Delete this attachment from Cloudinary and DB?');
                    if (!ok) return;
                    try {
                      await API.post('/admin/attachments/delete', { public_ids: [a.public_id] });
                      toast.push('Deleted');
                      fetch();
                    } catch (err) { toast.push('Delete failed', { type: 'error' }); }
                  }} className="text-sm underline text-red-400">Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAttachments;
