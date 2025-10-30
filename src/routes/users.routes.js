const { Router } = require('express');
const { verifyToken } = require('../middlewares/auth');
const { listUsers, getUser, updateUser } = require('../controllers/users.controller');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');

const router = Router();

router.get('/', verifyToken, listUsers);
router.get('/:id', verifyToken, getUser);
router.put(
  '/:id',
  verifyToken,
  [
    body('name').optional().isString(),
    body('faculty').optional().isString(),
    body('nationality').optional().isString(),
    body('interests').optional().isArray()
  ],
  validate,
  updateUser
);

module.exports = router;
