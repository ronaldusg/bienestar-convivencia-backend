const Route = require('../models/Route');
const { ok, created, notFound, forbidden, conflict } = require('../utils/httpResponses');

async function listRoutes(_req, res, next) {
  try {
    const routes = await Route.find().lean();
    return ok(res, routes);
  } catch (err) {
    next(err);
  }
}

async function getRoute(req, res, next) {
  try {
    const route = await Route.findById(req.params.id).lean();
    if (!route) return notFound(res, 'Route not found');
    return ok(res, route);
  } catch (err) {
    next(err);
  }
}

async function createRoute(req, res, next) {
  try {
    const payload = { ...req.body, driverId: req.user.id };
    const route = await Route.create(payload);
    return created(res, route);
  } catch (err) {
    next(err);
  }
}

async function updateRoute(req, res, next) {
  try {
    const existing = await Route.findById(req.params.id);
    if (!existing) return notFound(res, 'Route not found');
    if (req.user.role !== 'admin' && existing.driverId.toString() !== req.user.id) {
      return forbidden(res, 'Only driver or admin can modify');
    }
    const updated = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    return ok(res, updated);
  } catch (err) {
    next(err);
  }
}

async function joinRoute(req, res, next) {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return notFound(res, 'Route not found');
    const uid = req.user.id;
    if (route.passengers.find(p => p.toString() === uid)) return conflict(res, 'Already joined');
    if (route.passengers.length >= route.availableSeats) return conflict(res, 'No seats available');
    route.passengers.push(uid);
    await route.save();
    return ok(res, route);
  } catch (err) {
    next(err);
  }
}

async function leaveRoute(req, res, next) {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return notFound(res, 'Route not found');
    const uid = req.user.id;
    route.passengers = route.passengers.filter(p => p.toString() !== uid);
    await route.save();
    return ok(res, route);
  } catch (err) {
    next(err);
  }
}

module.exports = { listRoutes, getRoute, createRoute, updateRoute, joinRoute, leaveRoute };
