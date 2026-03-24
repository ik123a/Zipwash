const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken); // Protect all student routes

router.post('/laundry', studentController.submitLaundry);
router.get('/laundry', studentController.getHistory);
// Need to add slot booking

module.exports = router;
