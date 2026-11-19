import api from './api';

export const paymentService = {
  // Recruiter: Create server-calculated order
  async createOrder(planId) {
    const response = await api.post('/payments/create-order', { planId });
    return response.data;
  },

  // Recruiter: Verify payment signature and activate plan
  async verifyPayment(verificationData) {
    const response = await api.post('/payments/verify', verificationData);
    return response.data;
  },

  // Recruiter: Get personal payment history
  async getPaymentHistory() {
    const response = await api.get('/payments/history');
    return response.data;
  },

  // View specific payment details
  async getPaymentById(id) {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  // Admin: View all platform transactions
  async getAllPayments(params = {}) {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  // Admin: Process full or partial refund
  async processRefund(paymentId, payload) {
    const response = await api.post(`/payments/${paymentId}/refund`, payload);
    return response.data;
  }
};

export default paymentService;
