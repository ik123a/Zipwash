const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const requestLogger = require('../src/middleware/requestLogger');

function useTemporaryDirectory(t) {
  const original = process.cwd();
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'zipwash-access-log-'));
  process.chdir(temp);
  t.after(() => {
    process.chdir(original);
    const log = path.join(temp, 'backend.log');
    if (fs.existsSync(log)) {
      if (fs.statSync(log).isDirectory()) fs.rmdirSync(log);
      else fs.unlinkSync(log);
    }
    fs.rmdirSync(temp);
  });
}

test('logs the route and status while keeping request and response data private', (t) => {
  useTemporaryDirectory(t);
  const req = {
    method: 'POST',
    url: '/items/synthetic-path-marker?search=synthetic-query-marker',
    body: { nested: { field: 'synthetic-body-marker' } },
  };
  const res = new EventEmitter();
  res.statusCode = 201;
  res.send = function (payload) {
    this.emit('finish');
    return payload;
  };
  let sent;
  requestLogger(req, res, () => {
    req.route = { path: '/items/:id' };
    sent = res.send('synthetic-response-marker');
  });
  assert.equal(sent, 'synthetic-response-marker');
  const log = fs.readFileSync('backend.log', 'utf8');
  assert.equal(log.includes('synthetic-'), false, 'access log contains payload data');
  assert.match(log, /POST/);
  assert.match(log, /\/items\/:id/);
  assert.match(log, /201/);
});

test('a log write failure leaves request handling intact', (t) => {
  useTemporaryDirectory(t);
  fs.mkdirSync('backend.log');
  const report = t.mock.method(console, 'error', () => {});
  const res = new EventEmitter();
  res.statusCode = 204;
  let completed = false;
  requestLogger({ method: 'GET', url: '/health' }, res, () => {
    completed = true;
    res.emit('finish');
  });
  assert.equal(completed, true);
  assert.equal(report.mock.callCount(), 1);
});
