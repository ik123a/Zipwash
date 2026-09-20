const db = require('../config/db');

const submitFeedback = async (req, res) => {
  try {
    const { rating, comments, category } = req.body;
    const student_id = req.user.id;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5',
        code: 'INVALID_RATING'
      });
    }

    if (comments && comments.length > 2000) {
      return res.status(400).json({
        message: 'Comments must be under 2000 characters',
        code: 'INVALID_COMMENTS_LENGTH'
      });
    }

    const validCategories = ['service', 'quality', 'timeliness', 'staff', 'app', 'other'];
    const feedbackCategory = validCategories.includes(category) ? category : 'service';

    const [result] = await db.query(
      'INSERT INTO feedback (student_id, rating, comments, category) VALUES (?, ?, ?, ?)',
      [student_id, rating, comments || null, feedbackCategory]
    );

    res.status(201).json({
      message: 'Thank you for your feedback!',
      feedbackId: result.insertId
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      message: 'Failed to submit feedback',
      code: 'FEEDBACK_FAILED',
      details: error.message
    });
  }
};

const getMyFeedback = async (req, res) => {
  try {
    const student_id = req.user.id;
    const [rows] = await db.query(
      'SELECT id, rating, comments, category, is_resolved, created_at FROM feedback WHERE student_id = ? ORDER BY created_at DESC',
      [student_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      message: 'Failed to fetch feedback',
      code: 'FETCH_FAILED'
    });
  }
};

module.exports = {
  submitFeedback,
  getMyFeedback
};
