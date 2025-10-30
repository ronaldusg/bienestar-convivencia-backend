const { validationResult } = require('express-validator');
const { badRequest } = require('../utils/httpResponses');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return badRequest(res, {
      message: 'Validation error',
      details: errors.array()
    });
  }
  next();
}

module.exports = { validate };
