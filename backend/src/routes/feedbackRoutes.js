const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/', feedbackController.submitFeedback);
router.get('/my', feedbackController.getMyFeedback);

module.exports = router;
