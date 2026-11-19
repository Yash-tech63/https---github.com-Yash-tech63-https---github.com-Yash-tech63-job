const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const { authenticateJwt } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { companyValidation } = require('../validations/companyValidation');
const { validate } = require('../middleware/validate');

router.use(authenticateJwt);
router.use(requireRole('recruiter'));

router.get('/company', recruiterController.getCompany);
router.put('/company', companyValidation, validate, recruiterController.updateCompany);
router.get('/dashboard', recruiterController.getDashboard);

module.exports = router;
