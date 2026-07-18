import api from './axios';

export const getRecommended = () => api.get('/student/jobs').then(r => r.data);
export const createJob = (payload) => api.post('/company/jobs', payload).then(r => r.data);
export const getPendingAdminJobs = () => api.get('/admin/jobs/pending').then(r => r.data);
