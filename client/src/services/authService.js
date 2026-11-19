import api from './api';

export const authService = {
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async verifyLoginOtp(data) {
    const response = await api.post('/auth/verify-login-otp', data);
    return response.data;
  },

  async resendLoginOtp(data) {
    const response = await api.post('/auth/resend-login-otp', data);
    return response.data;
  },

  async forgotPassword(data) {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  async resetPassword(data) {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  async sendOtp(data) {
    const response = await api.post('/auth/send-otp', data);
    return response.data;
  },

  async verifyOtp(data) {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
