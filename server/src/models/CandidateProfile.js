const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    headline: {
      type: String,
      trim: true,
      default: ''
    },
    education: [
      {
        college: { type: String, default: '' },
        degree: { type: String, default: '' },
        gradYear: { type: String, default: '' }
      }
    ],
    skills: {
      type: [String],
      default: []
    },
    experience: [
      {
        title: { type: String, default: '' },
        company: { type: String, default: '' },
        duration: { type: String, default: '' },
        description: { type: String, default: '' }
      }
    ],
    preferences: {
      preferredRole: { type: String, default: '' },
      location: { type: String, default: '' }
    },
    links: {
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' }
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    resumeOriginalName: {
      type: String,
      default: ''
    },
    resumeSize: {
      type: Number,
      default: 0
    },
    resumeMimeType: {
      type: String,
      default: ''
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
      }
    ],
    profileComplete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Method to compute profile completeness percentage
candidateProfileSchema.methods.calculateCompleteness = function () {
  let score = 0;
  if (this.name && this.name.trim().length > 0) score += 15;
  if (this.headline && this.headline.trim().length > 0) score += 15;
  if (this.education && this.education.length > 0 && this.education[0].college) score += 20;
  if (this.skills && this.skills.length > 0) score += 20;
  if (this.experience && this.experience.length > 0) score += 10;
  if (this.resumeUrl) score += 20;
  return Math.min(100, score);
};

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
