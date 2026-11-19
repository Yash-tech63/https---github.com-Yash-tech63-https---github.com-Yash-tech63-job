const jobService = require('../services/jobService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const createJob = async (req, res, next) => {
  try {
    const job = await jobService.createJob(req.user._id, req.body);
    return successResponse(res, 'Job created successfully', job, 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getRecruiterJobs = async (req, res, next) => {
  try {
    const data = await jobService.getRecruiterJobs(req.user._id);
    return successResponse(res, 'Recruiter jobs retrieved', data);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await jobService.updateJob(req.user._id, id, req.body);
    return successResponse(res, 'Job updated successfully', job);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await jobService.deleteJob(req.user._id, id);
    return successResponse(res, 'Job deleted successfully', result);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getPublicJobs = async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search,
      location: req.query.location,
      skills: req.query.skills,
      workMode: req.query.workMode,
      type: req.query.type,
      limit: req.query.limit,
      page: req.query.page
    };

    const data = await jobService.getPublicJobs(filters);
    if (!Array.isArray(data?.jobs)) {
      return errorResponse(res, 'Invalid public jobs response from service', 500);
    }

    return successResponse(res, 'Verified public jobs retrieved successfully', data);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await jobService.getJobById(id, req.user);
    return successResponse(res, 'Job details retrieved', job);
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

module.exports = {
  createJob,
  getRecruiterJobs,
  updateJob,
  deleteJob,
  getPublicJobs,
  getJobById
};
