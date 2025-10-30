const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ok, created, badRequest, unauthorized } = require('../utils/httpResponses');
const User = require('../models/User');
require('dotenv').config();

const SALT_ROUNDS = 12;

function signToken(user) {
  const payload = { sub: user._id.toString(), role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1d' });
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return badRequest(res, 'Email already in use');
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, passwordHash, role: 'student' });
    const token = signToken(user);
    const userSafe = { id: user._id, name: user.name, email: user.email, role: user.role, faculty: user.faculty, nationality: user.nationality, interests: user.interests };
    return created(res, { token, user: userSafe });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return unauthorized(res, 'Invalid credentials');
    const okPass = await bcrypt.compare(password, user.passwordHash);
    if (!okPass) return unauthorized(res, 'Invalid credentials');
    const token = signToken(user);
    const userSafe = { id: user._id, name: user.name, email: user.email, role: user.role, faculty: user.faculty, nationality: user.nationality, interests: user.interests };
    return ok(res, { token, user: userSafe });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    return ok(res, user);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
