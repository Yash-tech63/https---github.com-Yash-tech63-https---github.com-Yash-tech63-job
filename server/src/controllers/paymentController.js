const paymentService = require('../services/paymentService');
const Payment = require('../models/Payment.model');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * STEP 3 & 4: Create a server-verified Razorpay Order
 */
const createOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    const recruiterId = req.user._id;

    const orderData = await paymentService.createPaymentOrder({ recruiterId, planId });
    return successResponse(res, 'Razorpay order generated successfully', orderData, 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * STEP 7 & 8: Verify Razorpay Payment Signature and activate entitlements
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const recruiterId = req.user._id;

    const result = await paymentService.verifyPayment({
      recruiterId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    return successResponse(res, 'Payment verified and plan activated successfully', result, 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Recruiter: Get Payment History
 */
const getPaymentHistory = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    const history = await paymentService.getRecruiterPaymentHistory(recruiterId);
    return successResponse(res, 'Payment history retrieved', history, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get Payment by ID
 */
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id)
      .populate('planId')
      .populate('companyId');

    if (!payment) {
      return errorResponse(res, 'Payment record not found', 404);
    }

    // Recruiter can only view their own payment; Admin can view any
    if (req.user.role !== 'admin' && payment.recruiterId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized access to payment record', 403);
    }

    return successResponse(res, 'Payment details retrieved', payment, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Admin: View all payments
 */
const getAllPayments = async (req, res) => {
  try {
    const data = await paymentService.getAllPayments(req.query);
    return successResponse(res, 'All payments retrieved', data, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Admin: Process Refund
 */
const processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;
    const adminUserId = req.user._id;

    const result = await paymentService.processAdminRefund({
      paymentId: id,
      amount,
      reason,
      adminUserId
    });

    return successResponse(res, 'Refund processed successfully', result, 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  getPaymentById,
  getAllPayments,
  processRefund
};
