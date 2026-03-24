const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const isStaff = (req, res, next) => {
    if (req.user && req.user.role === 'staff') {
        next();
    } else {
        res.status(403).json({ message: 'Staff access required' });
    }
}

module.exports = { authenticateToken, isStaff };
