// middlewares/errorHandler.js
const { AppError } = require('../errors/customErrors');

const errorHandler = (err, req, res, next) => {
  console.error('Error 💥:', err.message);

  // If error is our AppError, use its status code and message
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Otherwise, it's an unexpected server error
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong on the server',
  });
};

module.exports = errorHandler;
