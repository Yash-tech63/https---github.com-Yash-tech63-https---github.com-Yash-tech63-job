const Company = require('../models/Company');
const Job = require('../models/Job');
const User = require('../models/User');

class AdminService {
  /**
   * Get all companies categorized or filtered by verification status
   */
  async getCompanies(statusFilter = null) {
    const query = {};
    if (statusFilter && ['pending', 'valid', 'invalid'].includes(statusFilter)) {
      query.verificationStatus = statusFilter;
    }

    const companies = await Company.find(query)
      .populate('ownerUserId', 'email createdAt')
      .populate('reviewedBy', 'email')
      .sort({ createdAt: -1 });

    // Aggregate job counts for each company
    const companyIds = companies.map((c) => c._id);
    const jobs = await Job.find({ companyId: { $in: companyIds } }).select('companyId status title type createdAt');

    const companiesWithDetails = companies.map((company) => {
      const companyJobs = jobs.filter((j) => j.companyId.toString() === company._id.toString());
      return {
        ...company.toObject(),
        jobsCount: companyJobs.length,
        publishedJobsCount: companyJobs.filter((j) => j.status === 'published').length,
        jobs: companyJobs
      };
    });

    return companiesWithDetails;
  }

  /**
   * Verify or Reject a company
   */
  async verifyCompany(adminUserId, companyId, { status, adminNote = '' }) {
    if (!['valid', 'invalid'].includes(status)) {
      throw new Error('Verification status must be either "valid" or "invalid"');
    }

    if (status === 'invalid' && (!adminNote || adminNote.trim() === '')) {
      throw new Error('Admin note is mandatory when rejecting or marking a company invalid');
    }

    const company = await Company.findById(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    company.verificationStatus = status;
    company.adminNote = adminNote || (status === 'valid' ? 'Company verified by Platform Trust & Safety team' : '');
    company.reviewedBy = adminUserId;
    company.reviewedAt = new Date();

    await company.save();

    return await company.populate(['ownerUserId', 'reviewedBy']);
  }

  /**
   * Admin dashboard metrics & audit timeline
   */
  async getAdminDashboardMetrics() {
    const [pendingCount, validCount, invalidCount, totalJobs, totalUsers] = await Promise.all([
      Company.countDocuments({ verificationStatus: 'pending' }),
      Company.countDocuments({ verificationStatus: 'valid' }),
      Company.countDocuments({ verificationStatus: 'invalid' }),
      Job.countDocuments(),
      User.countDocuments()
    ]);

    // Recent audits
    const auditLogs = await Company.find({ reviewedAt: { $ne: null } })
      .populate('ownerUserId', 'email')
      .populate('reviewedBy', 'email')
      .sort({ reviewedAt: -1 })
      .limit(10);

    return {
      stats: {
        pendingCount,
        validCount,
        invalidCount,
        totalCompanies: pendingCount + validCount + invalidCount,
        totalJobs,
        totalUsers
      },
      auditLogs
    };
  }

  /**
   * User Management: Fetch users with role and search filters
   */
  async getUsers(roleFilter = null, searchQuery = '') {
    const query = {};
    if (roleFilter && ['candidate', 'recruiter', 'admin'].includes(roleFilter)) {
      query.role = roleFilter;
    }
    if (searchQuery && searchQuery.trim()) {
      query.email = { $regex: searchQuery.trim(), $options: 'i' };
    }

    const users = await User.find(query)
      .select('-password -otp -otpHash')
      .sort({ createdAt: -1 });

    return users;
  }

  /**
   * User Management: Update user status (active / ban)
   */
  async updateUserStatus(userId, { isActive, isBanned }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (isActive !== undefined) user.isActive = isActive;
    if (isBanned !== undefined) user.isBanned = isBanned;

    await user.save();
    return user;
  }

  /**
   * Job Moderation: Fetch all jobs across the platform
   */
  async getAllJobs(statusFilter = null, searchQuery = '') {
    const query = {};
    if (statusFilter && ['published', 'draft', 'closed'].includes(statusFilter)) {
      query.status = statusFilter;
    }
    if (searchQuery && searchQuery.trim()) {
      query.title = { $regex: searchQuery.trim(), $options: 'i' };
    }

    const jobs = await Job.find(query)
      .populate('companyId', 'name verificationStatus location')
      .sort({ createdAt: -1 });

    return jobs;
  }

  /**
   * Job Moderation: Update job status
   */
  async moderateJob(jobId, status) {
    if (!['published', 'draft', 'closed'].includes(status)) {
      throw new Error('Invalid status for moderation');
    }

    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error('Job opening not found');
    }

    job.status = status;
    await job.save();
    return job;
  }
}

module.exports = new AdminService();
