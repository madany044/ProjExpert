import authService from './authService';

const uploadFile = (file, onProgress) => {
  const fd = new FormData();
  fd.append('file', file, file.name);
  return authService.post('/uploads', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
    }
  }).then(r => r.data);
};

const deleteFile = (public_id) => {
  return authService.delete('/uploads', { data: { public_id } }).then(r => r.data);
};

export default { uploadFile, deleteFile };
