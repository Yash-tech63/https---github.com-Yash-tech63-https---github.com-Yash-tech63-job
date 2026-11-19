import api from './api';

export const planService = {
  // Public & Recruiter: Get available pricing plans
  async getPlans() {
    const response = await api.get('/plans');
    return response.data;
  },

  // Get plan by ID or Slug
  async getPlanById(id) {
    const response = await api.get(`/plans/${id}`);
    return response.data;
  },

  // Admin: Create new pricing plan
  async createPlan(planData) {
    const response = await api.post('/plans', planData);
    return response.data;
  },

  // Admin: Update pricing plan
  async updatePlan(id, planData) {
    const response = await api.put(`/plans/${id}`, planData);
    return response.data;
  },

  // Recruiter: Get current active subscription & eligibility
  async getCurrentSubscription() {
    const response = await api.get('/subscriptions/current');
    return response.data;
  },

  // Recruiter: Get subscription history
  async getSubscriptionHistory() {
    const response = await api.get('/subscriptions/history');
    return response.data;
  },

  // Recruiter: Cancel active subscription
  async cancelSubscription(id) {
    const response = await api.post(`/subscriptions/${id}/cancel`);
    return response.data;
  },

  // Admin: Get all platform subscriptions
  async getAllSubscriptions(params = {}) {
    const response = await api.get('/subscriptions', { params });
    return response.data;
  }
};

export default planService;
