const Resource = require('../models/Resource');
const { ok, created, notFound } = require('../utils/httpResponses');

async function listResources(_req, res, next) {
  try {
    const list = await Resource.find({ visible: true }).lean();
    return ok(res, list);
  } catch (err) {
    next(err);
  }
}

async function getResource(req, res, next) {
  try {
    const item = await Resource.findById(req.params.id).lean();
    if (!item) return notFound(res, 'Resource not found');
    return ok(res, item);
  } catch (err) {
    next(err);
  }
}

async function createResource(req, res, next) {
  try {
    const item = await Resource.create(req.body);
    return created(res, item);
  } catch (err) {
    next(err);
  }
}

async function updateResource(req, res, next) {
  try {
    const item = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!item) return notFound(res, 'Resource not found');
    return ok(res, item);
  } catch (err) {
    next(err);
  }
}

async function deleteResource(req, res, next) {
  try {
    const item = await Resource.findByIdAndDelete(req.params.id).lean();
    if (!item) return notFound(res, 'Resource not found');
    return ok(res, item);
  } catch (err) {
    next(err);
  }
}

module.exports = { listResources, getResource, createResource, updateResource, deleteResource };
