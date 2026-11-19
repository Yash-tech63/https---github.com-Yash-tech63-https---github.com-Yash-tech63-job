const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authenticateJwt } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

// Recruiter: Current active subscription & posting eligibility
router.get('/current', authenticateJwt, requireRole('recruiter'), subscriptionController.getCurrentSubscription);

// Recruiter: Subscription history
router.get('/history', authenticateJwt, requireRole('recruiter'), subscriptionController.getSubscriptionHistory);

// Recruiter: Cancel active subscription
router.post('/:id/cancel', authenticateJwt, requireRole('recruiter'), subscriptionController.cancelSubscription);

// Admin: View all subscriptions across all companies
router.get('/', authenticateJwt, requireRole('admin'), subscriptionController.getAllSubscriptions);

module.exports = router;
