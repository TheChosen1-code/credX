import api from './axios';

export const login = (payload) => api.post('/auth/login', payload).then(r => r.data);
export const signup = (payload) => api.post('/auth/signup', payload).then(r => r.data);
export const refresh = (refreshToken) => api.post('/auth/refresh', { refreshToken }).then(r => r.data);
