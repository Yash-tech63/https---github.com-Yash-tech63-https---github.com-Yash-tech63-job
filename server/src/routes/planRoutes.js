const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { authenticateJwt } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

// Public / Recruiter: List all available plans
router.get('/', planController.getPlans);

// Public / Recruiter: Get plan by id or slug
router.get('/:id', planController.getPlanById);

// Admin: Create a new plan
router.post('/', authenticateJwt, requireRole('admin'), planController.createPlan);

// Admin: Update existing plan
router.put('/:id', authenticateJwt, requireRole('admin'), planController.updatePlan);

module.exports = router;
