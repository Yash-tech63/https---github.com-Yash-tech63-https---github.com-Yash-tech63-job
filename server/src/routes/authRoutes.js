const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validations/authValidation');
const { validate } = require('../middleware/validate');
const { authenticateJwt } = require('../middleware/auth');

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.post('/verify-login-otp', authController.verifyLoginOtp);
router.post('/resend-login-otp', authController.resendLoginOtp);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/email-preview/:type', authController.previewEmail);
router.get('/me', authenticateJwt, authController.getMe);

module.exports = router;
