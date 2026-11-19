const Company = require('../models/Company');
const jobService = require('../services/jobService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getCompany = async (req, res, next) => {
  try {
    let company = await Company.findOne({ ownerUserId: req.user._id });
    if (!company) {
      company = await Company.create({
        ownerUserId: req.user._id,
        name: `${req.user.email.split('@')[0]} Org`,
        verificationStatus: 'pending'
      });
    }
    return successResponse(res, 'Company details retrieved', company);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const { name, website, industry, size, location, description, logoUrl } = req.body;
    let company = await Company.findOne({ ownerUserId: req.user._id });

    if (!company) {
      company = new Company({
        ownerUserId: req.user._id,
        name,
        website,
        industry,
        size,
        location,
        description,
        logoUrl,
        verificationStatus: 'pending'
      });
    } else {
      company.name = name || company.name;
      company.website = website !== undefined ? website : company.website;
      company.industry = industry || company.industry;
      company.size = size || company.size;
      company.location = location || company.location;
      company.description = description !== undefined ? description : company.description;
      if (logoUrl) company.logoUrl = logoUrl;
    }

    await company.save();
    return successResponse(res, 'Company profile updated successfully', company);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const data = await jobService.getRecruiterDashboardData(req.user._id);
    return successResponse(res, 'Recruiter dashboard data retrieved', data);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  getCompany,
  updateCompany,
  getDashboard
};
