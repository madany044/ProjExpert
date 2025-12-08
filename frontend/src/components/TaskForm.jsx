import React, { useState, useEffect, useRef } from 'react';
import UploadService from '../services/uploadService';
import { useToast } from './ToastProvider';
import { useConfirm } from './ConfirmProvider';

const TaskForm = ({ initial = {}, onSubmit, submitText = 'Save' }) => {
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');
  const [priority, setPriority] = useState(initial.priority || 'medium');
  const [tags, setTags] = useState((initial.tags || []).join(', '));
  const [error, setError] = useState(null);
  const [attachments, setAttachments] = useState(initial.attachments || []);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const { push: toast } = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    setTitle(initial.title || '');
    setDescription(initial.description || '');
    setPriority(initial.priority || 'medium');
    setTags((initial.tags || []).join(', '));
    const initAtt = (initial.attachments || []).map(a => ({ id: a.public_id || a.url || a.filename || (Date.now()+Math.random()), ...a }));
    setAttachments(initAtt);
  }, [initial.title, initial.description, initial.priority, initial.tags, initial.attachments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }
    const payload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    ,
      attachments
    };
    onSubmit(payload).catch(err => setError(err.message || 'Failed'));
  };

  // Handle files (upload immediately)
  const addFiles = async (files) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    
    // Validate file types - only images allowed
    const validImages = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = list.filter(f => !validImages.includes(f.type));
    
    if (invalidFiles.length > 0) {
      toast('Only image files (JPEG, PNG, GIF, WebP) are allowed', { type: 'warning' });
      return;
    }

    setUploading(true);
    for (const file of list) {
      // optimistic local entry while uploading
      const local = { id: Date.now() + Math.random(), filename: file.name, mimeType: file.type, url: null, progress: 0 };
      setAttachments(prev => [...prev, local]);
      try {
        const idx = attachments.length; // best-effort
        const data = await UploadService.uploadFile(file, (p) => {
          // update progress for local entry
          setAttachments(prev => prev.map(a => (a.id === local.id ? { ...a, progress: p } : a)));
        });
        // replace local entry with returned data
        setAttachments(prev => prev.map(a => (a.id === local.id ? { ...a, url: data.url, filename: data.filename || a.filename, mimeType: data.mimeType || a.mimeType, public_id: data.public_id, progress: 100 } : a)));
        toast('Image uploaded successfully', { type: 'success' });
      } catch (err) {
        console.error('Upload failed', err);
        toast(`Upload failed: ${err.message}`, { type: 'error' });
        setAttachments(prev => prev.map(a => (a.id === local.id ? { ...a, error: true } : a)));
      }
    }
    setUploading(false);
  };

  const handleFileSelect = (e) => {
    addFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const removeAttachment = async (att) => {
    // if uploaded, attempt delete via API
    if (att.public_id) {
      try {
        await UploadService.deleteFile(att.public_id);
      } catch (err) {
        console.warn('Failed to delete remote file', err);
      }
    }
    setAttachments(prev => prev.filter(a => a.id !== att.id && a.public_id !== att.public_id));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-300">{error}</div>}
      <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} className="p-3 border-dashed border-2 border-white/10 rounded">
        <div className="flex items-center justify-between">
          <div className="text-sm">Attachments</div>
          <div>
            <button type="button" onClick={() => fileInputRef.current.click()} className="text-sm underline">Add files</button>
          </div>
        </div>
        <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFileSelect} className="hidden" />
        <div className="mt-2 grid grid-cols-3 gap-2">
          {attachments.map(att => (
            <div key={att.id || att.public_id || att.filename} className="p-2 bg-white/5 rounded relative">
              {att.mimeType && att.mimeType.startsWith('image') && att.url ? (
                <img src={att.url} alt={att.filename} className="w-full h-24 object-cover rounded" />
              ) : (
                <div className="w-full h-24 flex items-center justify-center text-sm">{att.filename}</div>
              )}
              <div className="text-xs mt-1">{att.filename}</div>
              {att.progress !== undefined && att.progress < 100 && <div className="text-xs">Uploading: {att.progress}%</div>}
              {att.error && <div className="text-xs text-red-400">Upload failed</div>}
              <button type="button" onClick={async () => {
                const ok = await confirm('Remove this attachment?');
                if (!ok) return;
                await removeAttachment(att);
                toast.push('Attachment removed');
              }} className="absolute top-1 right-1 text-xs bg-red-600 px-2 py-1 rounded">×</button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm">Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 rounded bg-white/5" />
      </div>
      <div>
        <label className="block text-sm">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 rounded bg-white/5" rows={6} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Priority</label>
          <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full p-2 rounded bg-white/5">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Tags (comma separated)</label>
          <input value={tags} onChange={e => setTags(e.target.value)} className="w-full p-2 rounded bg-white/5" />
        </div>
      </div>
      <div>
        <button className="bg-proj-blue px-4 py-2 rounded">{submitText}</button>
      </div>
    </form>
  );
};

export default TaskForm;
