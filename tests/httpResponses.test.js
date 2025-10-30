const { ok, badRequest } = require('../src/utils/httpResponses');

test('ok returns success true', () => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  ok(res, { hello: 'world' });
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ success: true, data: { hello: 'world' } });
});

test('badRequest returns error', () => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  badRequest(res, 'Invalid');
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: true, message: 'Invalid', code: 'INVALID_INPUT' });
});
