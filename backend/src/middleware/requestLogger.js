const fs = require('node:fs');

module.exports = function requestLogger(req, res, next) {
  res.once('finish', () => {
    // Express sets the route template after routing. Raw URLs may contain user data.
    const entry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      route: typeof req.route?.path === 'string' ? req.route.path : '<unmatched>',
      status: res.statusCode,
    };
    try {
      fs.appendFileSync('backend.log', JSON.stringify(entry) + '\n');
    } catch {
      console.error('Unable to write the API access log.');
    }
  });
  next();
};
