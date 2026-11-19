const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const subscriptionService = require('./subscriptionService');

class JobService {
  /**
   * Recruiter creates a job
   * Strictly enforces:
   * 1. Company must be verified ('valid')
   * 2. Recruiter must hold active subscription with available quota
   */
  async createJob(userId, jobData) {
    const company = await Company.findOne({ ownerUserId: userId });
    if (!company) {
      throw new Error('Please set up your company profile before posting a job');
    }

    if (company.verificationStatus !== 'valid') {
      throw new Error(`Your company verification status is ${company.verificationStatus}. Only admin-approved companies can publish jobs to the marketplace.`);
    }

    // Check & consume entitlement
    const subscription = await subscriptionService.consumeJobEntitlement(userId);

    // Apply plan perks if available
    const isFeatured = jobData.featured && subscription?.features?.featuredListing;

    // Format salary display string if not explicitly passed
    let formattedSalary = jobData.salary;
    if (jobData.hideSalary) {
      formattedSalary = 'Not Disclosed';
    } else if (jobData.type === 'internship') {
      if (jobData.isPaid === false) {
        formattedSalary = 'Unpaid Internship';
      } else if (jobData.stipendMin && jobData.stipendMax) {
        formattedSalary = `₹${Number(jobData.stipendMin).toLocaleString('en-IN')} - ₹${Number(jobData.stipendMax).toLocaleString('en-IN')}/mo`;
      } else if (jobData.stipendMin) {
        formattedSalary = `₹${Number(jobData.stipendMin).toLocaleString('en-IN')}/mo`;
      }
    } else if (jobData.salaryMin && jobData.salaryMax) {
      formattedSalary = `₹${Number(jobData.salaryMin).toLocaleString('en-IN')} - ₹${Number(jobData.salaryMax).toLocaleString('en-IN')}/${jobData.salaryPeriod || 'year'}`;
    } else if (jobData.salaryMin) {
      formattedSalary = `₹${Number(jobData.salaryMin).toLocaleString('en-IN')}/${jobData.salaryPeriod || 'year'}`;
    }

    const job = await Job.create({
      ...jobData,
      salary: formattedSalary || jobData.salary || 'Competitive',
      featured: !!isFeatured,
      companyId: company._id,
      createdBy: userId,
      status: jobData.status || 'published'
    });

    return await job.populate('companyId');
  }

  /**
   * Recruiter deletes a job
   */
  async deleteJob(userId, jobId) {
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error('Job listing not found');
    }

    if (job.createdBy.toString() !== userId.toString()) {
      throw new Error('Unauthorized to delete this job');
    }

    if (job.status === 'published') {
      await subscriptionService.releaseJobEntitlement(job.companyId);
    }

    await Job.findByIdAndDelete(jobId);
    return { success: true, message: 'Job deleted successfully' };
  }

  /**
   * Recruiter gets their own jobs
   */
  async getRecruiterJobs(userId) {
    const company = await Company.findOne({ ownerUserId: userId });
    if (!company) {
      return { jobs: [], company: null };
    }

    const jobs = await Job.find({ companyId: company._id })
      .populate('companyId')
      .sort({ createdAt: -1 });

    // Count applications for each job
    const jobIds = jobs.map((j) => j._id);
    const applications = await Application.find({ jobId: { $in: jobIds } });

    const jobsWithCounts = jobs.map((job) => {
      const appCount = applications.filter((a) => a.jobId.toString() === job._id.toString()).length;
      return {
        ...job.toObject(),
        applicationCount: appCount
      };
    });

    return {
      company,
      jobs: jobsWithCounts
    };
  }

  /**
   * Recruiter updates/edits a job
   */
  async updateJob(userId, jobId, updateData) {
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error('Job listing not found');
    }

    if (job.createdBy.toString() !== userId.toString()) {
      throw new Error('Unauthorized to modify this job');
    }

    const wasPublished = job.status === 'published';
    const isNowClosed = updateData.status === 'closed';

    Object.assign(job, updateData);
    await job.save();

    // If a published job is closed, release an active slot
    if (wasPublished && isNowClosed) {
      await subscriptionService.releaseJobEntitlement(job.companyId);
    }

    return await job.populate('companyId');
  }

  /**
   * Recruiter deletes a job
   */
  async deleteJob(userId, jobId) {
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error('Job listing not found');
    }

    if (job.createdBy.toString() !== userId.toString()) {
      throw new Error('Unauthorized to delete this job');
    }

    if (job.status === 'published') {
      await subscriptionService.releaseJobEntitlement(job.companyId);
    }

    await Job.findByIdAndDelete(jobId);
    return { success: true, message: 'Job deleted successfully' };
  }

  /**
   * Recruiter dashboard metrics
   */
  async getRecruiterDashboardData(userId) {
    let company = await Company.findOne({ ownerUserId: userId });
    if (!company) {
      company = await Company.create({
        ownerUserId: userId,
        name: 'My Company',
        verificationStatus: 'pending'
      });
    }

    const jobs = await Job.find({ companyId: company._id }).sort({ createdAt: -1 });
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status === 'published').length;
    const draftJobs = jobs.filter((j) => j.status === 'draft').length;
    const closedJobs = jobs.filter((j) => j.status === 'closed').length;
    const now = new Date();
    const expiredJobs = jobs.filter((j) => (j.deadline && new Date(j.deadline) < now) || j.status === 'closed').length;

    const jobIds = jobs.map((j) => j._id);
    const allApplications = await Application.find({ jobId: { $in: jobIds } });
    const totalApplications = allApplications.length;
    const pendingApplications = allApplications.filter((a) => a.status === 'applied' || a.status === 'under_review').length;
    const shortlistedCount = allApplications.filter((a) => a.status === 'shortlisted').length;
    const rejectedCount = allApplications.filter((a) => a.status === 'rejected').length;
    const scheduledInterviews = allApplications.filter((a) => a.status === 'interview_scheduled').length;

    const recentApplications = await Application.find({ jobId: { $in: jobIds } })
      .populate({
        path: 'candidateId',
        select: 'email'
      })
      .populate('jobId', 'title type')
      .sort({ appliedAt: -1 })
      .limit(10);

    // Attach applicationCount and viewsCount to each job
    const jobsWithCounts = jobs.map((job) => {
      const appCount = allApplications.filter((a) => a.jobId.toString() === job._id.toString()).length;
      return {
        ...job.toObject(),
        applicationCount: appCount,
        viewsCount: job.viewsCount || 0
      };
    });

    // Fetch active subscription details
    const activeSubscription = await subscriptionService.getActiveSubscription(userId);

    return {
      company,
      stats: {
        totalJobs,
        activeJobs,
        draftJobs,
        closedJobs,
        expiredJobs,
        totalApplications,
        pendingApplications,
        shortlistedCount,
        rejectedCount,
        scheduledInterviews
      },
      jobs: jobsWithCounts,
      recentApplications,
      canBePublic: company.verificationStatus === 'valid',
      subscription: activeSubscription
    };
  }

  /**
   * PUBLIC JOB BOARD
   * STRICT ENFORCEMENT: ONLY jobs from companies with verificationStatus === 'valid'
   * and status === 'published'.
   */
  async getPublicJobs({ search, location, skills, workMode, type, limit = 20, page = 1 }) {
    // 1. Find all verified companies
    const validCompanies = await Company.find({ verificationStatus: 'valid' }).select('_id');
    const validCompanyIds = validCompanies.map((c) => c._id);

    // Build job query
    const query = {
      companyId: { $in: validCompanyIds },
      status: 'published'
    };

    if (type && type !== 'all') {
      query.type = type;
    }

    if (workMode && workMode !== 'all') {
      query.workMode = workMode;
    }

    if (location && location.trim() !== '') {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { skills: { $in: [new RegExp(search.trim(), 'i')] } }
      ];
    }

    if (skills) {
      const skillsArray = Array.isArray(skills)
        ? skills
        : skills.split(',').map((s) => s.trim()).filter(Boolean);

      if (skillsArray.length > 0) {
        query.skills = { $in: skillsArray.map((s) => new RegExp(s, 'i')) };
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('companyId', 'name website industry size location logoUrl verificationStatus')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Job.countDocuments(query)
    ]);

    return {
      jobs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    };
  }

  /**
   * Get single job details (public only if company is valid)
   */
  async getJobById(jobId, currentUser = null) {
    const job = await Job.findById(jobId).populate('companyId');
    if (!job) {
      throw new Error('Job listing not found');
    }

    const isCompanyValid = job.companyId && job.companyId.verificationStatus === 'valid';
    const isOwner =
      currentUser &&
      (job.createdBy.toString() === currentUser._id.toString() || currentUser.role === 'admin');

    if (!isCompanyValid && !isOwner) {
      throw new Error('This job listing is currently under administrative company verification and is not publicly visible');
    }

    // Increment view count for tracking
    await Job.findByIdAndUpdate(jobId, { $inc: { viewsCount: 1 } });
    job.viewsCount = (job.viewsCount || 0) + 1;

    return job;
  }
}

module.exports = new JobService();
