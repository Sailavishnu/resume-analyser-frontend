import apiClient from './apiClient';

export const studentService = {
  async getJobs() {
    const response = await apiClient.get('/jobs', { params: { page: 1, page_size: 100 } });
    return response.data?.data || [];
  },
  async getApplications() {
    const response = await apiClient.get('/applications', { params: { page: 1, page_size: 100 } });
    return response.data?.data || [];
  },
  async getProfile() {
    const response = await apiClient.get('/users/student/profile');
    return response.data?.data || {};
  },
  async updateProfile(profile) {
    const response = await apiClient.patch('/users/student/profile', profile);
    return response.data?.data || {};
  },
  async updateUser(profile) {
    const response = await apiClient.patch('/users/me', profile);
    return response.data?.data || {};
  },
  async getAnalytics() {
    const response = await apiClient.get('/analytics/student');
    return response.data?.data || {};
  },
  async applyToJob(jobId, resumeId) {
    const response = await apiClient.post('/applications', { job_id: jobId, resume_id: resumeId });
    return response.data?.data || response.data;
  },
};
