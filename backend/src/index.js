const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configure CORS with origin whitelist
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

const fs = require('fs');

// Helper to mask sensitive fields in logs
const maskSensitive = (body) => {
  if (!body) return body;
  const sensitive = ['password', 'token', 'secret', 'jwt', 'authorization'];
  const masked = { ...body };
  sensitive.forEach(field => {
    if (masked[field]) masked[field] = '***REDACTED***';
  });
  return masked;
};

app.use((req, res, next) => {
  const logBody = maskSensitive(req.body);
  const logStr = `\n[${new Date().toISOString()}] ${req.method} ${req.url}\nBody: ${JSON.stringify(logBody)}\n`;
  fs.appendFileSync('backend.log', logStr);
  const originalSend = res.send;
  res.send = function (body) {
    fs.appendFileSync('backend.log', `Status: ${res.statusCode} | Response: ${body}\n`);
    return originalSend.call(this, body);
  };
  next();
});

// Add rate limiting middleware
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Increased max requests per window for local development
  message: {
    message: 'Too many login attempts. Please try again after 5 minutes.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    message: 'Too many requests. Please slow down.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

// Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const staffRoutes = require('./routes/staffRoutes');
const machineRoutes = require('./routes/machineRoutes');
const slotRoutes = require('./routes/slotRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/student', apiLimiter, studentRoutes);
app.use('/api/staff', apiLimiter, staffRoutes);
app.use('/api/machines', apiLimiter, machineRoutes);
app.use('/api/slots', apiLimiter, slotRoutes);
app.use('/api/feedback', apiLimiter, feedbackRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
