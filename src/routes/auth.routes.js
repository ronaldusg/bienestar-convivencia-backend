const { Router } = require('express');
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate');
const { verifyToken } = require('../middlewares/auth');

const router = Router();

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 8 })
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty()
  ],
  validate,
  login
);

router.get('/me', verifyToken, me);

module.exports = router;
