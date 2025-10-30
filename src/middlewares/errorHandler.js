const { error } = require('../utils/httpResponses');

function errorHandler(err, _req, res, _next) {
  // Map some known names to codes
  let code = 'SERVER_ERROR';
  let status = 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'UnauthorizedError') {
    code = 'AUTH_REQUIRED';
    status = 401;
  }

  if (err.code === 'FORBIDDEN') {
    status = 403;
    code = 'FORBIDDEN';
  }

  if (err.code === 'NOT_FOUND') {
    status = 404;
    code = 'NOT_FOUND';
  }

  if (err.code === 'CONFLICT') {
    status = 409;
    code = 'CONFLICT';
  }

  return error(res, message, status, code);
}

module.exports = { errorHandler };
