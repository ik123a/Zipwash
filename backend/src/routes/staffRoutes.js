const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authenticateToken, isStaff } = require('../middleware/auth');

router.use(authenticateToken);
router.use(isStaff);

router.get('/laundry', staffController.getAllSubmissions);
router.put('/laundry/:id/status', staffController.updateStatus);
router.get('/machines', staffController.getMachines);
router.put('/machines/:id/status', staffController.updateMachineStatus);

module.exports = router;
