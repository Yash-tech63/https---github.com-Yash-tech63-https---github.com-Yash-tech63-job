import api from './api';

export const jobService = {
  async getPublicJobs(params = {}) {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  async getJobById(id) {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  async getRecruiterJobs() {
    const response = await api.get('/jobs/mine');
    return response.data;
  },

  async createJob(jobData) {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  async updateJob(id, jobData) {
    const response = await api.patch(`/jobs/${id}`, jobData);
    return response.data;
  },

  async deleteJob(id) {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  }
};
