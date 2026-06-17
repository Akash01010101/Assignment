const ApiError = require('../utils/ApiError');

const requireOrganizerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'organizer')) {
    return next();
  }
  return next(new ApiError(403, 'FORBIDDEN'));
};

module.exports = requireOrganizerOrAdmin;
