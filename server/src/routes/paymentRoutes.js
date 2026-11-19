const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { handleRazorpayWebhook } = require('../controllers/webhookController');
const { authenticateJwt } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

// Public Webhook listener for Razorpay servers
router.post('/webhook', handleRazorpayWebhook);

// Recruiter: Create server-calculated order
router.post('/create-order', authenticateJwt, requireRole('recruiter'), paymentController.createOrder);

// Recruiter: Verify payment signature and activate plan
router.post('/verify', authenticateJwt, requireRole('recruiter'), paymentController.verifyPayment);

// Recruiter: View personal payment history
router.get('/history', authenticateJwt, requireRole('recruiter'), paymentController.getPaymentHistory);

// Admin: View all payments across the system
router.get('/', authenticateJwt, requireRole('admin'), paymentController.getAllPayments);

// Recruiter or Admin: View specific payment details
router.get('/:id', authenticateJwt, paymentController.getPaymentById);

// Admin: Initiate full or partial refund
router.post('/:id/refund', authenticateJwt, requireRole('admin'), paymentController.processRefund);

module.exports = router;
