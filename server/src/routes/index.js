const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const candidateRoutes = require('./candidateRoutes');
const recruiterRoutes = require('./recruiterRoutes');
const jobRoutes = require('./jobRoutes');
const adminRoutes = require('./adminRoutes');
const planRoutes = require('./planRoutes');
const paymentRoutes = require('./paymentRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');

router.use('/auth', authRoutes);
router.use('/candidate', candidateRoutes);
router.use('/recruiter', recruiterRoutes);
router.use('/jobs', jobRoutes);
router.use('/admin', adminRoutes);
router.use('/plans', planRoutes);
router.use('/payments', paymentRoutes);
router.use('/subscriptions', subscriptionRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'TrueHire SaaS Platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;
