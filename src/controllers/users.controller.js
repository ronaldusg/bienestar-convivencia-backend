const User = require('../models/User');
const { ok, notFound, forbidden } = require('../utils/httpResponses');

async function listUsers(req, res, next) {
  try {
    const { interests, nationality, faculty } = req.query;
    const filter = {};
    if (nationality) filter.nationality = nationality;
    if (faculty) filter.faculty = faculty;
    if (interests) filter.interests = { $in: (Array.isArray(interests) ? interests : interests.split(',')) };
    const users = await User.find(filter).select('-passwordHash').lean();
    return ok(res, users);
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash').lean();
    if (!user) return notFound(res, 'User not found');
    return ok(res, user);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      const error = new Error('Insufficient permissions');
      error.code = 'FORBIDDEN';
      throw error;
    }
    const updates = (({ name, faculty, nationality, interests }) => ({ name, faculty, nationality, interests }))(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-passwordHash').lean();
    if (!user) return notFound(res, 'User not found');
    return ok(res, user);
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, getUser, updateUser };
