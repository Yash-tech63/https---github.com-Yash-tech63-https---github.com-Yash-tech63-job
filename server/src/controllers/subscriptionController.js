const subscriptionService = require('../services/subscriptionService');
const Company = require('../models/Company');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Get current active subscription and entitlement status for the logged-in recruiter
 */
const getCurrentSubscription = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    const subscription = await subscriptionService.getActiveSubscription(recruiterId);
    const eligibility = await subscriptionService.canPostJob(recruiterId);
    const company = await Company.findOne({ ownerUserId: recruiterId });

    return successResponse(
      res,
      'Current subscription retrieved',
      {
        subscription,
        eligibility,
        company: company
          ? {
              _id: company._id,
              name: company.name,
              verificationStatus: company.verificationStatus
            }
          : null
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get subscription history for the logged-in recruiter
 */
const getSubscriptionHistory = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    const history = await subscriptionService.getSubscriptionHistory(recruiterId);
    return successResponse(res, 'Subscription history retrieved', history, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Cancel an active subscription
 */
const cancelSubscription = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    const { id } = req.params;
    const subscription = await subscriptionService.cancelSubscription(recruiterId, id);
    return successResponse(res, 'Subscription cancelled successfully', subscription, 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Admin: Get all subscriptions across the platform
 */
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionService.getAllSubscriptions(req.query);
    return successResponse(res, 'All platform subscriptions retrieved', subscriptions, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getCurrentSubscription,
  getSubscriptionHistory,
  cancelSubscription,
  getAllSubscriptions
};
