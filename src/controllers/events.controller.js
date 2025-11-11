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

// Lista de asistentes de un evento
async function listAttendees(req, res, next) {
  try {
    const { id } = req.params;
    // Intento 1: populate si el esquema tiene ref a User
    let ev = await Event.findById(id).populate('attendees', 'name email').lean();
    if (!ev) return notFound(res, 'Event not found');

    let attendees;

    if (Array.isArray(ev.attendees) && ev.attendees.length && typeof ev.attendees[0] === 'object') {
      // Ya vienen poblados
      attendees = ev.attendees.map(u => ({
        id: u._id?.toString?.() ?? u.id,
        name: u.name ?? '—',
        email: u.email ?? '—',
      }));
    } else {
      // Fallback: si no hay populate (por si el schema no tiene ref)
      const userIds = (ev.attendees || []).map(a => a.toString());
      const User = require('../models/User'); // ajusta si tu nombre de modelo es distinto
      const users = userIds.length
        ? await User.find({ _id: { $in: userIds } }).select('name email').lean()
        : [];
      attendees = users.map(u => ({
        id: u._id?.toString?.() ?? u.id,
        name: u.name ?? '—',
        email: u.email ?? '—',
      }));
    }

    // Mantén el mismo helper que ya usas (ok) para consistencia
    return ok(res, { attendees });
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
  unregisterFromEvent,
  listAttendees
};
