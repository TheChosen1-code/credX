import api from './axios';

export const getCompanyJobs = () => api.get('/company/jobs').then(r => r.data);

export const getJobApplicants = (jobId) => api.get(`/company/jobs/${jobId}/applications`).then(r => r.data);

export const updateApplicationStatus = (applicationId, status) => {
  return api.put(`/company/applications/${applicationId}/status`, null, {
    params: { status },
  }).then(r => r.data);
};
