const { errorResponse } = require('../utils/apiResponse');

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Unauthorized. Please login first.', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Forbidden. Access requires one of the following roles: [${allowedRoles.join(', ')}]. Your role is: '${req.user.role}'`,
        403
      );
    }

    next();
  };
};

module.exports = { requireRole };
