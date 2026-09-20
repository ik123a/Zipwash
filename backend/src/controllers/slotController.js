/**
 * Slot Controller - Database-backed Slot Booking
 * Uses MySQL bookings table for persistent storage
 */

const db = require('../config/db');

/**
 * GET /api/slots?date=YYYY-MM-DD
 * Returns all booked time strings for a given date.
 */
const getSlots = async (req, res) => {
  try {
    const { date, machine_id } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'date query param required' });
    }

    let query = 'SELECT time_slot, machine_id FROM bookings WHERE booking_date = ? AND status IN ("pending", "confirmed")';
    const params = [date];

    if (machine_id) {
      query += ' AND machine_id = ?';
      params.push(machine_id);
    }

    const [rows] = await db.query(query, params);

    // If a specific machine was requested, return just the time strings for backwards compatibility or simplicity
    // Otherwise return the rows with machine info
    if (machine_id) {
      const bookedTimes = rows.map(row => row.time_slot);
      return res.json({ date, machine_id, booked_slots: bookedTimes });
    }

    res.json({ date, bookings: rows });
  } catch (error) {
    console.error('Get slots error:', error);
    res.status(500).json({ message: 'Server error', code: 'SERVER_ERROR' });
  }
};

/**
 * POST /api/slots
 * Body: { date: "YYYY-MM-DD", time: "HH:MM" }
 * Books the slot for authenticated student. Fails if already booked.
 */
const bookSlot = async (req, res) => {
  try {
    const { date, time, machine_id } = req.body;
    const student_id = req.user.id;

    if (!date || !time) {
      return res.status(400).json({ message: 'date and time are required' });
    }

    // Check if THIS specific machine is already booked at THIS time
    const [existing] = await db.query(
      'SELECT id FROM bookings WHERE booking_date = ? AND time_slot = ? AND machine_id = ? AND status IN ("pending", "confirmed")',
      [date, time, machine_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'This machine is already booked for this time slot.' });
    }

    // Insert new booking with machine_id
    const [result] = await db.query(
      'INSERT INTO bookings (student_id, machine_id, booking_date, time_slot, status) VALUES (?, ?, ?, ?, "pending")',
      [student_id, machine_id || null, date, time]
    );

    res.status(201).json({
      message: 'Slot booked successfully',
      bookingId: result.insertId,
      date,
      time,
      machine_id
    });
  } catch (error) {
    console.error('Book slot error:', error);
    res.status(500).json({
      message: 'Failed to book slot',
      code: 'BOOKING_FAILED',
      details: error.message
    });
  }
};

/**
 * GET /api/slots/my-bookings
 * Returns all bookings for the authenticated student
 */
const getMyBookings = async (req, res) => {
  try {
    const student_id = req.user.id;

    const [rows] = await db.query(
      `SELECT b.id, b.booking_date, b.time_slot, b.status, b.notes, b.created_at,
              m.machine_number, m.machine_type, m.location
       FROM bookings b
       LEFT JOIN machine_status m ON b.machine_id = m.id
       WHERE b.student_id = ?
       ORDER BY b.booking_date DESC, b.time_slot ASC`,
      [student_id]
    );

    res.json(rows);
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ message: 'Server error', code: 'SERVER_ERROR' });
  }
};

/**
 * DELETE /api/slots/:id
 * Cancels a booking (soft delete - changes status to cancelled)
 */
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const student_id = req.user.id;

    // Verify the booking belongs to the student
    const [existing] = await db.query(
      'SELECT id FROM bookings WHERE id = ? AND student_id = ?',
      [id, student_id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await db.query(
      'UPDATE bookings SET status = "cancelled", updated_at = NOW() WHERE id = ?',
      [id]
    );

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error', code: 'SERVER_ERROR' });
  }
};

module.exports = {
  getSlots,
  bookSlot,
  getMyBookings,
  cancelBooking
};
