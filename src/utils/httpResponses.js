function ok(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}
function created(res, data) {
  return res.status(201).json({ success: true, data });
}
function badRequest(res, message) {
  return res.status(400).json({ error: true, message, code: 'INVALID_INPUT' });
}
function unauthorized(res, message) {
  return res.status(401).json({ error: true, message, code: 'AUTH_REQUIRED' });
}
function forbidden(res, message) {
  return res.status(403).json({ error: true, message, code: 'FORBIDDEN' });
}
function notFound(res, message = 'Not found') {
  return res.status(404).json({ error: true, message, code: 'NOT_FOUND' });
}
function conflict(res, message) {
  return res.status(409).json({ error: true, message, code: 'CONFLICT' });
}
function error(res, message, status = 500, code = 'SERVER_ERROR') {
  return res.status(status).json({ error: true, message, code });
}

module.exports = { ok, created, badRequest, unauthorized, forbidden, notFound, conflict, error };
