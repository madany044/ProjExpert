import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || '/api', withCredentials: true });

const uploadFile = (file, onProgress) => {
  const fd = new FormData();
  fd.append('file', file, file.name);
  return API.post('/uploads', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
    }
  }).then(r => r.data);
};

const deleteFile = (public_id) => {
  return API.delete('/uploads', { data: { public_id } }).then(r => r.data);
};

export default { uploadFile, deleteFile };
