import api from './api';

export const candidateService = {
  async getProfile() {
    const response = await api.get('/candidate/profile');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/candidate/profile', data);
    return response.data;
  },

  async uploadResume(file, onUploadProgress) {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/candidate/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
    return response.data;
  },

  async deleteResume() {
    const response = await api.delete('/candidate/resume');
    return response.data;
  },

  async saveJob(jobId) {
    const response = await api.post(`/candidate/save-job/${jobId}`);
    return response.data;
  },

  async unsaveJob(jobId) {
    const response = await api.delete(`/candidate/save-job/${jobId}`);
    return response.data;
  },

  async getSavedJobs() {
    const response = await api.get('/candidate/saved-jobs');
    return response.data;
  },

  async getDashboard() {
    const response = await api.get('/candidate/dashboard');
    return response.data;
  },

  async applyJob(jobId, notes = '') {
    const response = await api.post(`/candidate/apply/${jobId}`, { notes });
    return response.data;
  },

  async getApplications() {
    const response = await api.get('/candidate/applications');
    return response.data;
  }
};
