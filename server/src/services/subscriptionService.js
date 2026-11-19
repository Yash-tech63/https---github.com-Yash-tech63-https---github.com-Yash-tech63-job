const Subscription = require('../models/Subscription.model');
const Plan = require('../models/Plan.model');
const Company = require('../models/Company');
const Job = require('../models/Job');

class SubscriptionService {
  /**
   * Get recruiter's current active subscription (auto-expires outdated records)
   */
  async getActiveSubscription(recruiterId) {
    const company = await Company.findOne({ ownerUserId: recruiterId });
    if (!company) {
      return null;
    }

    // Find active subscription
    let subscription = await Subscription.findOne({
      companyId: company._id,
      status: 'active'
    })
      .populate('planId')
      .sort({ createdAt: -1 });

    if (!subscription) {
      return null;
    }

    // Auto-expire if past endDate
    if (new Date() > new Date(subscription.endDate)) {
      subscription.status = 'expired';
      await subscription.save();
      return null;
    }

    // Sync active published jobs count safely
    const actualActiveJobs = await Job.countDocuments({
      companyId: company._id,
      status: 'published'
    });
    if (subscription.activeJobCount !== actualActiveJobs) {
      subscription.activeJobCount = actualActiveJobs;
      await subscription.save();
    }

    return subscription;
  }

  /**
   * Activate entitlement/subscription after verified captured payment
   */
  async activateSubscription({ recruiterId, companyId, planId, paymentId }) {
    const plan = await Plan.findById(planId);
    if (!plan) {
      throw new Error('Plan not found for subscription activation');
    }

    const durationDays = plan.durationDays || 30;
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // Expire any existing active subscription of same company
    await Subscription.updateMany(
      { companyId, status: 'active' },
      { status: 'expired' }
    );

    // Calculate current active published jobs
    const currentActiveJobs = await Job.countDocuments({
      companyId,
      status: 'published'
    });

    const subscription = await Subscription.create({
      recruiterId,
      companyId,
      planId: plan._id,
      paymentId: paymentId || null,
      status: 'active',
      startDate,
      endDate,
      jobPostingLimit: plan.jobPostingLimit,
      usedJobPostings: 0,
      activeJobCount: currentActiveJobs,
      autoRenew: false,
      features: {
        featuredListing: !!plan.featuredListing,
        analyticsEnabled: !!plan.analyticsEnabled,
        multipleRecruiters: !!plan.multipleRecruiters
      }
    });

    return await subscription.populate('planId');
  }

  /**
   * Check if recruiter is eligible to post a job
   * Enforces:
   * 1. Company verification status === 'valid'
   * 2. Active, non-expired subscription exists
   * 3. Remaining job quota available
   */
  async canPostJob(recruiterId) {
    const company = await Company.findOne({ ownerUserId: recruiterId });
    if (!company) {
      return {
        allowed: false,
        reason: 'Company profile not found. Please set up your company details first.'
      };
    }

    // Separate Verification check:
    // Only admin-approved companies can publish jobs
    if (company.verificationStatus !== 'valid') {
      return {
        allowed: false,
        reason: `Your company verification is ${company.verificationStatus}. Only admin-approved companies can publish jobs to the marketplace.`,
        verificationPending: true,
        company
      };
    }

    // Check payment entitlement:
    const subscription = await this.getActiveSubscription(recruiterId);
    if (!subscription) {
      return {
        allowed: false,
        reason: 'No active subscription or job posting credits found. Please choose a plan to post jobs.',
        needsPlan: true,
        company
      };
    }

    // Check quota limits
    if (subscription.usedJobPostings >= subscription.jobPostingLimit) {
      return {
        allowed: false,
        reason: `You have reached your plan limit of ${subscription.jobPostingLimit} job postings. Please upgrade or renew your plan.`,
        quotaExceeded: true,
        subscription,
        company
      };
    }

    if (subscription.activeJobCount >= subscription.jobPostingLimit) {
      return {
        allowed: false,
        reason: `You currently have ${subscription.activeJobCount} active jobs, reaching your limit of ${subscription.jobPostingLimit}. Please close an existing job or upgrade.`,
        limitReached: true,
        subscription,
        company
      };
    }

    return {
      allowed: true,
      subscription,
      company
    };
  }

  /**
   * Safely consume one job posting credit from active subscription
   */
  async consumeJobEntitlement(recruiterId) {
    const check = await this.canPostJob(recruiterId);
    if (!check.allowed) {
      throw new Error(check.reason);
    }

    const subscription = check.subscription;
    subscription.usedJobPostings += 1;
    subscription.activeJobCount += 1;
    await subscription.save();

    return subscription;
  }

  /**
   * Release an active job credit when a job is closed
   */
  async releaseJobEntitlement(companyId) {
    const subscription = await Subscription.findOne({
      companyId,
      status: 'active'
    });

    if (subscription && subscription.activeJobCount > 0) {
      subscription.activeJobCount = Math.max(0, subscription.activeJobCount - 1);
      await subscription.save();
    }
  }

  /**
   * Cancel an active subscription
   */
  async cancelSubscription(recruiterId, subscriptionId) {
    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      recruiterId
    });

    if (!subscription) {
      throw new Error('Subscription not found or unauthorized');
    }

    subscription.status = 'cancelled';
    await subscription.save();
    return subscription;
  }

  /**
   * Get recruiter's subscription history
   */
  async getSubscriptionHistory(recruiterId) {
    const company = await Company.findOne({ ownerUserId: recruiterId });
    if (!company) {
      return [];
    }

    return await Subscription.find({ companyId: company._id })
      .populate('planId')
      .populate('paymentId')
      .sort({ createdAt: -1 });
  }

  /**
   * Get all subscriptions (Admin)
   */
  async getAllSubscriptions(query = {}) {
    const filter = {};
    if (query.status && query.status !== 'all') {
      filter.status = query.status;
    }

    return await Subscription.find(filter)
      .populate('recruiterId', 'email')
      .populate('companyId', 'name verificationStatus')
      .populate('planId', 'name price slug')
      .populate('paymentId', 'amount paymentStatus razorpayPaymentId')
      .sort({ createdAt: -1 });
  }
}

module.exports = new SubscriptionService();
