import api from './api';

export const adminService = {
  async getCompanies(status = '') {
    const response = await api.get('/admin/companies', {
      params: status ? { status } : {}
    });
    return response.data;
  },

  async verifyCompany(id, payload) {
    const response = await api.patch(`/admin/companies/${id}/verify`, payload);
    return response.data;
  },

  async getDashboard() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  async getUsers(role = '', search = '') {
    const response = await api.get('/admin/users', {
      params: { ...(role ? { role } : {}), ...(search ? { search } : {}) }
    });
    return response.data;
  },

  async updateUserStatus(id, payload) {
    const response = await api.patch(`/admin/users/${id}/status`, payload);
    return response.data;
  },

  async getAllJobs(status = '', search = '') {
    const response = await api.get('/admin/jobs', {
      params: { ...(status ? { status } : {}), ...(search ? { search } : {}) }
    });
    return response.data;
  },

  async moderateJob(id, status) {
    const response = await api.patch(`/admin/jobs/${id}/moderate`, { status });
    return response.data;
  }
};
