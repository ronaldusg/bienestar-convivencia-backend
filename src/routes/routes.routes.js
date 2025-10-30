const { Router } = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middlewares/auth');
const ctrl = require('../controllers/routes.controller');
const { validate } = require('../middlewares/validate');

const router = Router();

router.get('/', verifyToken, ctrl.listRoutes);
router.get('/:id', verifyToken, ctrl.getRoute);

router.post(
  '/',
  verifyToken,
  [
    body('title').notEmpty(),
    body('origin.address').notEmpty(),
    body('destination').notEmpty(),
    body('dateTime').isISO8601(),
    body('availableSeats').isInt({ min: 1 })
  ],
  validate,
  ctrl.createRoute
);

router.put('/:id', verifyToken, validate, ctrl.updateRoute);
router.post('/:id/join', verifyToken, ctrl.joinRoute);
router.post('/:id/leave', verifyToken, ctrl.leaveRoute);

module.exports = router;
