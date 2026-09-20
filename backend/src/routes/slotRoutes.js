const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const { authenticateToken } = require('../middleware/auth');

// GET /api/slots?date=YYYY-MM-DD (public - students need to see availability)
router.get('/', slotController.getSlots);

// GET /api/slots/my-bookings - Get all bookings for authenticated student
router.get('/my-bookings', authenticateToken, slotController.getMyBookings);

// POST /api/slots (must be logged in as student)
router.post('/', authenticateToken, slotController.bookSlot);

// DELETE /api/slots/:id - Cancel a booking
router.delete('/:id', authenticateToken, slotController.cancelBooking);

module.exports = router;
