const config = require('./config');

function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = config.nodeEnv === 'production' ? 'An error occurred' : err.message;
  
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  });
}

module.exports = errorHandler;