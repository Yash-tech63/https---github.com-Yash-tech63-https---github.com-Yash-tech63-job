const { verifyToken } = require('../utils/jwtToken');
const { errorResponse } = require('../utils/apiResponse');
const User = require('../models/User');

const authenticateJwt = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication required. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = verifyToken(token);
    } catch (err) {
      return errorResponse(res, 'Invalid or expired token', 401);
    }

    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return errorResponse(res, 'User associated with this token no longer exists', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, `Authentication error: ${error.message}`, 500);
  }
};

module.exports = { authenticateJwt };
