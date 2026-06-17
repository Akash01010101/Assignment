const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for dev
  if (err.statusCode !== 404) {
    logger.error(`${err.name}: ${err.message}`);
    if (err.stack) logger.error(err.stack);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ApiError(400, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ApiError(409, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = new ApiError(400, message);
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }

  res.status(error.statusCode || 500).json({
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
