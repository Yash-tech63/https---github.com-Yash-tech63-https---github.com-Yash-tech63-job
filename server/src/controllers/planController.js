const Plan = require('../models/Plan.model');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Get all active plans (Public / Recruiter)
 */
const getPlans = async (req, res) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { isActive: true };
    const plans = await Plan.find(filter).sort({ price: 1 });
    return successResponse(res, 'Pricing plans retrieved', plans, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get plan by ID or Slug
 */
const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = id.match(/^[0-9a-fA-F]{24}$/)
      ? await Plan.findById(id)
      : await Plan.findOne({ slug: id });

    if (!plan) {
      return errorResponse(res, 'Pricing plan not found', 404);
    }
    return successResponse(res, 'Plan details retrieved', plan, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Admin: Create new Plan
 */
const createPlan = async (req, res) => {
  try {
    const { name, slug, description, price, billingType, durationDays, jobPostingLimit, featuredListing, analyticsEnabled, multipleRecruiters, features } = req.body;

    const existing = await Plan.findOne({ slug: slug || name.toLowerCase().replace(/\s+/g, '-') });
    if (existing) {
      return errorResponse(res, 'A plan with this slug already exists', 400);
    }

    const plan = await Plan.create({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      price: Number(price),
      billingType: billingType || 'monthly',
      durationDays: Number(durationDays) || 30,
      jobPostingLimit: Number(jobPostingLimit) || 1,
      featuredListing: !!featuredListing,
      analyticsEnabled: !!analyticsEnabled,
      multipleRecruiters: !!multipleRecruiters,
      features: Array.isArray(features) ? features : [],
      isActive: true
    });

    return successResponse(res, 'Pricing plan created successfully', plan, 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Admin: Update Plan
 */
const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const plan = await Plan.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!plan) {
      return errorResponse(res, 'Plan not found', 404);
    }

    return successResponse(res, 'Pricing plan updated successfully', plan, 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan
};
