const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Public route to get machines (e.g. for student dashboard indicators)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM machine_status');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
