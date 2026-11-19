const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['job', 'internship'],
      required: [true, 'Job type (job or internship) is required'],
      default: 'internship'
    },
    description: {
      type: String,
      required: [true, 'Job description is required']
    },
    skills: {
      type: [String],
      default: []
    },
    salary: {
      type: String,
      default: 'Not Disclosed'
    },
    salaryMin: {
      type: Number,
      default: null
    },
    salaryMax: {
      type: Number,
      default: null
    },
    currency: {
      type: String,
      default: 'INR'
    },
    salaryPeriod: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly'
    },
    hideSalary: {
      type: Boolean,
      default: false
    },
    isNegotiable: {
      type: Boolean,
      default: false
    },
    isPaid: {
      type: Boolean,
      default: true
    },
    stipendMin: {
      type: Number,
      default: null
    },
    stipendMax: {
      type: Number,
      default: null
    },
    viewsCount: {
      type: Number,
      default: 0
    },
    duration: {
      type: String,
      required: [true, 'Duration is required (e.g. 3 Months, 6 Months, Full-time)']
    },
    workMode: {
      type: String,
      enum: ['remote', 'hybrid', 'onsite'],
      required: [true, 'Work mode is required (remote, hybrid, or onsite)'],
      default: 'remote'
    },
    location: {
      type: String,
      trim: true,
      default: 'Remote'
    },
    deadline: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed'],
      default: 'published'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Job', jobSchema);
