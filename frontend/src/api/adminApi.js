import api from './axios';

export const getAllCompanies = () => api.get('/admin/companies').then(r => r.data);

export const getAllJobs = () => api.get('/admin/jobs').then(r => r.data);

export const getAllApplications = () => api.get('/admin/applications').then(r => r.data);

export const approveJob = (jobId) => api.put(`/admin/jobs/${jobId}/approve`).then(r => r.data);

export const rejectJob = (jobId) => api.put(`/admin/jobs/${jobId}/reject`).then(r => r.data);

export const getPendingJobs = () => api.get('/admin/jobs/pending').then(r => r.data);

