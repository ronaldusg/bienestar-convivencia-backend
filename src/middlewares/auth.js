const jwt = require('jsonwebtoken');
const { unauthorized, forbidden } = require('../utils/httpResponses');
require('dotenv').config();

function verifyToken(req, res, next) {
  const auth = req.headers.authorization || '';
  const [, token] = auth.split(' ');

  if (!token) return unauthorized(res, 'Token required');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (e) {
    return unauthorized(res, 'Invalid or expired token');
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return unauthorized(res, 'Auth required');
    if (req.user.role !== role) return forbidden(res, 'Insufficient permissions');
    next();
  };
}

function requireSelfOrAdmin(req, res, next) {
  if (!req.user) return unauthorized(res, 'Auth required');
  if (req.user.role === 'admin' || req.user.id === req.params.id) return next();
  return forbidden(res, 'Insufficient permissions');
}

module.exports = { verifyToken, requireRole, requireSelfOrAdmin };
