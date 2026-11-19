const authService = require('../services/authService');
const emailService = require('../services/emailService');
const {
  getLoginOtpEmailHtml,
  getLoginSuccessEmailHtml,
  getApplicationConfirmationEmailHtml,
  getRecruiterApplicationNotificationHtml
} = require('../utils/emailTemplates');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const { email, password, role, name, companyName } = req.body;
    const result = await authService.register({ email, password, role, name, companyName });
    return successResponse(res, 'User registered successfully', result, 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Primary Login controller
 * Checks password and verifies role. If candidate/recruiter -> sends OTP and returns challengeId.
 * If admin -> returns JWT directly.
 */
const login = async (req, res, next) => {
  try {
    const { email, password, expectedRole, role } = req.body;
    const targetRole = expectedRole || role;
    const result = await authService.login({ email, password, expectedRole: targetRole });
    if (result.requiresOtp) {
      return successResponse(res, result.message, result, 200);
    }
    return successResponse(res, 'Login successful', result, 200);
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};

/**
 * Verify Login OTP controller
 * Validates 6-digit OTP against challengeId and expectedRole, returns JWT on success.
 */
const verifyLoginOtp = async (req, res, next) => {
  try {
    const { challengeId, otp, expectedRole, role } = req.body;
    const targetRole = expectedRole || role;
    const result = await authService.verifyLoginOtp({ challengeId, otp, expectedRole: targetRole });
    return successResponse(res, 'Login verification successful', result, 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Resend Login OTP controller with 60-second cooldown
 */
const resendLoginOtp = async (req, res, next) => {
  try {
    const { challengeId } = req.body;
    const result = await authService.resendLoginOtp({ challengeId });
    return successResponse(res, result.message, result, 200);
  } catch (error) {
    const status = error.statusCode || 400;
    return errorResponse(res, error.message, status);
  }
};

const previewEmail = async (req, res, next) => {
  try {
    const { type } = req.params;
    let html = '';

    if (type === 'otp' || type === 'login-otp') {
      const otp = req.query.otp || '592814';
      const name = req.query.name || 'Alex Chen';
      html = getLoginOtpEmailHtml({ userName: name, otp, expiryMinutes: 5 });
    } else if (type === 'login-success') {
      html = getLoginSuccessEmailHtml({
        userName: req.query.name || 'Alex Chen',
        email: req.query.email || 'alex.dev@stanford.edu',
        role: req.query.role || 'candidate'
      });
    } else if (type === 'application') {
      html = getApplicationConfirmationEmailHtml({
        candidateName: req.query.name || 'Alex Chen',
        jobTitle: req.query.job || 'Senior Full Stack Engineer',
        companyName: req.query.company || 'Linear Technologies Inc.',
        location: req.query.location || 'San Francisco, CA (Hybrid)',
        jobType: req.query.type || 'Full-Time',
        salary: req.query.salary || '$145,000 - $180,000 / yr',
        applicationId: 'APP-' + Math.floor(100000 + Math.random() * 900000)
      });
    } else if (type === 'recruiter-alert') {
      html = getRecruiterApplicationNotificationHtml({
        candidateName: req.query.name || 'Alex Chen',
        jobTitle: req.query.job || 'Senior Full Stack Engineer',
        applicationId: 'APP-' + Math.floor(100000 + Math.random() * 900000)
      });
    } else {
      return errorResponse(res, 'Invalid template type. Use "otp", "login-success", "application", or "recruiter-alert".', 400);
    }

    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user._id);
    return successResponse(res, 'Current user retrieved', user, 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword({ email });
    return successResponse(res, result.message, result, 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    const result = await authService.resetPassword({ email, resetCode, newPassword });
    return successResponse(res, result.message, result, 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  register,
  login,
  verifyLoginOtp,
  resendLoginOtp,
  forgotPassword,
  resetPassword,
  previewEmail,
  getMe
};
