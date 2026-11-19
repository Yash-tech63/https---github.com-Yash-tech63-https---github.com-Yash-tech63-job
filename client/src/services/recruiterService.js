import api from './api';

export const recruiterService = {
  async getCompany() {
    const response = await api.get('/recruiter/company');
    return response.data;
  },

  async updateCompany(data) {
    const response = await api.put('/recruiter/company', data);
    return response.data;
  },

  async getDashboard() {
    const response = await api.get('/recruiter/dashboard');
    return response.data;
  }
};
