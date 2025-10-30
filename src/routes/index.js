const { Router } = require('express');
const auth = require('./auth.routes');
const users = require('./users.routes');
const events = require('./events.routes');
const rides = require('./routes.routes');
const resources = require('./resources.routes');

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/events', events);
router.use('/routes', rides);
router.use('/resources', resources);

module.exports = router;
