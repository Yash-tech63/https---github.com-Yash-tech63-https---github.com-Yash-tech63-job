const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateJwt } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { jobValidation } = require('../validations/jobValidation');
const { validate } = require('../middleware/validate');

// Optional auth helper for single job inspection
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const { verifyToken } = require('../utils/jwtToken');
      const User = require('../models/User');
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      req.user = await User.findById(decoded.id).select('-passwordHash');
    } catch (e) {
      // ignore token error for optional auth
    }
  }
  next();
};

// Public routes
router.get('/', jobController.getPublicJobs);
router.get('/:id', optionalAuth, jobController.getJobById);

// Recruiter protected routes
router.post('/', authenticateJwt, requireRole('recruiter'), jobValidation, validate, jobController.createJob);
router.get('/mine', authenticateJwt, requireRole('recruiter'), jobController.getRecruiterJobs);
router.patch('/:id', authenticateJwt, requireRole('recruiter'), jobController.updateJob);
router.delete('/:id', authenticateJwt, requireRole('recruiter'), jobController.deleteJob);

module.exports = router;
