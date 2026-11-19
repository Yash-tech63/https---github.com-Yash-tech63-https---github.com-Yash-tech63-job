const fs = require('fs');
const path = require('path');
const CandidateProfile = require('../models/CandidateProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');
const User = require('../models/User');
const emailService = require('./emailService');

class CandidateService {
  async getProfile(userId) {
    let profile = await CandidateProfile.findOne({ userId });
    if (!profile) {
      profile = await CandidateProfile.create({
        userId,
        name: 'New Candidate',
        profileComplete: false
      });
    }

    const completeness = profile.calculateCompleteness();
    return {
      profile,
      completeness
    };
  }

  async updateProfile(userId, profileData) {
    let profile = await CandidateProfile.findOne({ userId });
    if (!profile) {
      profile = new CandidateProfile({ userId, ...profileData });
    } else {
      Object.assign(profile, profileData);
    }

    const completeness = profile.calculateCompleteness();
    profile.profileComplete = completeness >= 70;
    await profile.save();

    return {
      profile,
      completeness
    };
  }

  async updateResume(userId, file, fileUrl) {
    const profile = await CandidateProfile.findOne({ userId });
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    // Clean up old resume file if replacing
    if (profile.resumeUrl) {
      try {
        const oldFilename = profile.resumeUrl.replace(/^\/uploads\//, '');
        const oldFilePath = path.join(__dirname, '../../uploads', oldFilename);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (err) {
        console.warn('[CandidateService] Failed to remove previous resume file:', err.message);
      }
    }

    profile.resumeUrl = fileUrl;
    profile.resumeOriginalName = file.originalname;
    profile.resumeSize = file.size || 0;
    profile.resumeMimeType = file.mimetype || '';

    const completeness = profile.calculateCompleteness();
    profile.profileComplete = completeness >= 70;
    await profile.save();

    return {
      profile,
      completeness,
      resumeUrl: fileUrl,
      resumeOriginalName: file.originalname,
      resumeSize: file.size
    };
  }

  async deleteResume(userId) {
    const profile = await CandidateProfile.findOne({ userId });
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    if (profile.resumeUrl) {
      try {
        const filename = profile.resumeUrl.replace(/^\/uploads\//, '');
        const filePath = path.join(__dirname, '../../uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.warn('[CandidateService] Failed to delete resume file from disk:', err.message);
      }
    }

    profile.resumeUrl = '';
    profile.resumeOriginalName = '';
    profile.resumeSize = 0;
    profile.resumeMimeType = '';

    const completeness = profile.calculateCompleteness();
    profile.profileComplete = completeness >= 70;
    await profile.save();

    return {
      profile,
      completeness
    };
  }

  async saveJob(userId, jobId) {
    let profile = await CandidateProfile.findOne({ userId });
    if (!profile) {
      profile = await CandidateProfile.create({ userId, name: 'Candidate' });
    }

    if (!profile.savedJobs) {
      profile.savedJobs = [];
    }

    if (!profile.savedJobs.some(id => id.toString() === jobId.toString())) {
      profile.savedJobs.push(jobId);
      await profile.save();
    }

    return profile.savedJobs;
  }

  async unsaveJob(userId, jobId) {
    const profile = await CandidateProfile.findOne({ userId });
    if (!profile) return [];

    if (profile.savedJobs) {
      profile.savedJobs = profile.savedJobs.filter(id => id.toString() !== jobId.toString());
      await profile.save();
    }

    return profile.savedJobs;
  }

  async getSavedJobs(userId) {
    const profile = await CandidateProfile.findOne({ userId }).populate({
      path: 'savedJobs',
      populate: {
        path: 'companyId',
        select: 'name website verificationStatus location'
      }
    });

    return profile ? profile.savedJobs : [];
  }

  async getDashboardData(userId) {
    const { profile, completeness } = await this.getProfile(userId);

    // Get candidate applications
    const applications = await Application.find({ candidateId: userId })
      .populate({
        path: 'jobId',
        select: 'title type duration workMode salary location status'
      })
      .populate({
        path: 'companyId',
        select: 'name website verificationStatus location'
      })
      .sort({ appliedAt: -1 });

    // Fetch verified companies
    const verifiedCompanies = await Company.find({ verificationStatus: 'valid' }).select('_id');
    const verifiedCompanyIds = verifiedCompanies.map((c) => c._id);

    // Recommended jobs matching skills or general verified active jobs
    const userSkills = profile.skills || [];
    let recommendedQuery = {
      companyId: { $in: verifiedCompanyIds },
      status: 'published'
    };

    if (userSkills.length > 0) {
      recommendedQuery.skills = { $in: userSkills };
    }

    let recommendedJobs = await Job.find(recommendedQuery)
      .populate('companyId', 'name website verificationStatus location')
      .limit(6)
      .sort({ createdAt: -1 });

    // If matching by skills returned fewer than 3, fallback to top published verified jobs
    if (recommendedJobs.length < 3) {
      recommendedJobs = await Job.find({
        companyId: { $in: verifiedCompanyIds },
        status: 'published'
      })
        .populate('companyId', 'name website verificationStatus location')
        .limit(6)
        .sort({ createdAt: -1 });
    }

    // Recommended internships
    const recommendedInternships = await Job.find({
      companyId: { $in: verifiedCompanyIds },
      status: 'published',
      type: 'internship'
    })
      .populate('companyId', 'name website verificationStatus location')
      .limit(6)
      .sort({ createdAt: -1 });

    // Populate saved jobs
    const populatedProfile = await CandidateProfile.findOne({ userId }).populate({
      path: 'savedJobs',
      populate: {
        path: 'companyId',
        select: 'name website verificationStatus location'
      }
    });

    return {
      profile,
      completeness,
      resumeStatus: profile.resumeUrl ? 'Uploaded' : 'Missing',
      resumeUrl: profile.resumeUrl,
      resumeOriginalName: profile.resumeOriginalName,
      resumeSize: profile.resumeSize || 0,
      applicationsCount: applications.length,
      applications,
      recommendedJobs,
      recommendedInternships,
      savedJobs: populatedProfile?.savedJobs || []
    };
  }

  async applyToJob(userId, jobId, notes = '') {
    const job = await Job.findById(jobId).populate('companyId');
    if (!job) {
      throw new Error('Job listing not found');
    }

    if (job.status !== 'published') {
      throw new Error('This position is no longer accepting applications');
    }

    if (job.companyId.verificationStatus !== 'valid') {
      throw new Error('Applications can only be submitted to verified companies');
    }

    // Check if already applied
    const existing = await Application.findOne({ candidateId: userId, jobId });
    if (existing) {
      throw new Error('You have already applied for this position');
    }

    const application = await Application.create({
      jobId,
      candidateId: userId,
      companyId: job.companyId._id,
      notes,
      status: 'applied'
    });

    // Send application confirmation email to Candidate & notification to Recruiter
    try {
      const candidateUser = await User.findById(userId);
      const profile = await CandidateProfile.findOne({ userId });
      const candidateName = profile?.name || (candidateUser ? candidateUser.email.split('@')[0] : 'Candidate');
      const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      if (candidateUser && candidateUser.email) {
        await emailService.sendApplicationConfirmation(candidateUser.email, {
          candidateName,
          jobTitle: job.title,
          companyName: job.companyId.name,
          jobType: job.type || 'Full-Time',
          location: job.location || 'Remote',
          applicationId: application._id.toString(),
          appliedDate: formattedDate,
          status: 'Applied'
        });
      }

      // Optional Recruiter notification via Company.ownerUserId
      if (job.companyId && job.companyId.ownerUserId) {
        const recruiterUser = await User.findById(job.companyId.ownerUserId);
        if (recruiterUser && recruiterUser.email) {
          await emailService.sendRecruiterApplicationNotification(recruiterUser.email, {
            candidateName,
            jobTitle: job.title,
            applicationId: application._id.toString(),
            appliedDate: formattedDate,
            status: 'Applied'
          });
        }
      }
    } catch (emailErr) {
      console.warn('[CandidateService] Email notification error (application safely recorded):', emailErr.message);
    }

    return application;
  }

  async getApplications(userId) {
    return await Application.find({ candidateId: userId })
      .populate('jobId')
      .populate('companyId')
      .sort({ appliedAt: -1 });
  }
}

module.exports = new CandidateService();
