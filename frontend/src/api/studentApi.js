import api from './axios';

export const getProfile = () => api.get('/student/profile').then(r => r.data);

export const updateProfile = (data) => api.put('/student/profile', data).then(r => r.data);

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/student/upload-resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(r => r.data);
};
