const adminService = require('../services/adminService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getCompanies = async (req, res, next) => {
  try {
    const { status } = req.query;
    const companies = await adminService.getCompanies(status);
    return successResponse(res, 'Companies retrieved for moderation', companies);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const verifyCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;
    const company = await adminService.verifyCompany(req.user._id, id, { status, adminNote });
    return successResponse(
      res,
      `Company status successfully updated to '${status}'`,
      company
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const data = await adminService.getAdminDashboardMetrics();
    return successResponse(res, 'Admin dashboard metrics retrieved', data);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const users = await adminService.getUsers(role, search);
    return successResponse(res, 'Users retrieved', users);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await adminService.updateUserStatus(id, req.body);
    return successResponse(res, 'User status updated successfully', user);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getAllJobs = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const jobs = await adminService.getAllJobs(status, search);
    return successResponse(res, 'Jobs retrieved for moderation', jobs);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const moderateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const job = await adminService.moderateJob(id, status);
    return successResponse(res, `Job status updated to '${status}'`, job);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  getCompanies,
  verifyCompany,
  getDashboard,
  getUsers,
  updateUserStatus,
  getAllJobs,
  moderateJob
};
