const { Router } = require('express');
const { body } = require('express-validator');
const { verifyToken, requireRole } = require('../middlewares/auth');
const ctrl = require('../controllers/events.controller');
const { validate } = require('../middlewares/validate');

const router = Router();

router.get('/', verifyToken, ctrl.listEvents);
router.get('/:id', verifyToken, ctrl.getEvent);

router.post(
  '/',
  verifyToken,
  requireRole('admin'),
  [
    body('title').notEmpty(),
    body('startAt').isISO8601(),
    body('location.name').notEmpty(),
    body('category').optional().isString()
  ],
  validate,
  ctrl.createEvent
);

router.put(
  '/:id',
  verifyToken,
  requireRole('admin'),
  validate,
  ctrl.updateEvent
);

router.delete('/:id', verifyToken, requireRole('admin'), ctrl.deleteEvent);

router.post('/:id/register', verifyToken, ctrl.registerToEvent);
router.post('/:id/unregister', verifyToken, ctrl.unregisterFromEvent);

module.exports = router;
