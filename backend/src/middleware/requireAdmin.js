const ApiError = require('../utils/ApiError');

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(new ApiError(403, 'FORBIDDEN'));
};

module.exports = requireAdmin;
