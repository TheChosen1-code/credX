import api from './axios';

export const getMyApplications = () => api.get('/student/applications').then(r => r.data);
export const applyToJob = (jobId) => api.post(`/student/jobs/${jobId}/apply`).then(r => r.data);
