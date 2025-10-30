const Event = require('../models/Event');
const { ok, created, notFound, conflict } = require('../utils/httpResponses');

function buildEventFilter(q) {
  const filter = {};
  if (q.category) filter.category = q.category;
  if (q.dateFrom) filter.startAt = { $gte: new Date(q.dateFrom) };
  if (q.location) filter['location.name'] = { $regex: q.location, $options: 'i' };
  return filter;
}

async function listEvents(req, res, next) {
  try {
    const { page = 1, limit = 10, sort = 'startAt' } = req.query;
    const filter = buildEventFilter(req.query);
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const events = await Event.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    return ok(res, events);
  } catch (err) {
    next(err);
  }
}

async function getEvent(req, res, next) {
  try {
    const ev = await Event.findById(req.params.id).lean();
    if (!ev) return notFound(res, 'Event not found');
    return ok(res, ev);
  } catch (err) {
    next(err);
  }
}

async function createEvent(req, res, next) {
  try {
    const payload = req.body;
    payload.organizerId = req.user.id;
    const ev = await Event.create(payload);
    return created(res, ev);
  } catch (err) {
    next(err);
  }
}

async function updateEvent(req, res, next) {
  try {
    const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!ev) return notFound(res, 'Event not found');
    return ok(res, ev);
  } catch (err) {
    next(err);
  }
}

async function deleteEvent(req, res, next) {
  try {
    const ev = await Event.findByIdAndDelete(req.params.id).lean();
    if (!ev) return notFound(res, 'Event not found');
    return ok(res, ev);
  } catch (err) {
    next(err);
  }
}

async function registerToEvent(req, res, next) {
  try {
    const userId = req.user.id;
    const ev = await Event.findById(req.params.id);
    if (!ev) return notFound(res, 'Event not found');
    if (ev.capacity && ev.attendees.length >= ev.capacity) {
      return conflict(res, 'Event is full');
    }
    if (ev.attendees.find(a => a.toString() === userId)) {
      return conflict(res, 'Already registered');
    }
    ev.attendees.push(userId);
    await ev.save();
    return ok(res, ev);
  } catch (err) {
    next(err);
  }
}

async function unregisterFromEvent(req, res, next) {
  try {
    const userId = req.user.id;
    const ev = await Event.findById(req.params.id);
    if (!ev) return notFound(res, 'Event not found');
    ev.attendees = ev.attendees.filter(a => a.toString() !== userId);
    await ev.save();
    return ok(res, ev);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerToEvent,
  unregisterFromEvent
};
