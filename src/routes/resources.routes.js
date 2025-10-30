const { Router } = require('express');
const { body } = require('express-validator');
const { verifyToken, requireRole } = require('../middlewares/auth');
const ctrl = require('../controllers/resources.controller');
const { validate } = require('../middlewares/validate');

const router = Router();

router.get('/', verifyToken, ctrl.listResources);
router.get('/:id', verifyToken, ctrl.getResource);

router.post(
  '/',
  verifyToken,
  requireRole('admin'),
  [
    body('title').notEmpty(),
    body('content').notEmpty()
  ],
  validate,
  ctrl.createResource
);

router.put('/:id', verifyToken, requireRole('admin'), validate, ctrl.updateResource);
router.delete('/:id', verifyToken, requireRole('admin'), ctrl.deleteResource);

module.exports = router;
