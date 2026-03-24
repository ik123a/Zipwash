const db = require('../config/db');

const submitLaundry = async (req, res) => {
    try {
        const { number_of_clothes } = req.body;
        const student_id = req.user.id; // From auth middleware

        if (!number_of_clothes || number_of_clothes <= 0) {
            return res.status(400).json({ message: 'Invalid number of clothes' });
        }

        const [result] = await db.query(
            'INSERT INTO clothes_entries (student_id, number_of_clothes, status) VALUES (?, ?, ?)',
            [student_id, number_of_clothes, 'submitted']
        );

        // Record transaction
        await db.query(
             'INSERT INTO transactions (clothes_entry_id, action_type) VALUES (?, ?)',
             [result.insertId, 'submitted']
        );

        res.status(201).json({ message: 'Laundry submitted successfully', entryId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getHistory = async (req, res) => {
    try {
         const student_id = req.user.id;
         const [rows] = await db.query(
             'SELECT * FROM clothes_entries WHERE student_id = ? ORDER BY submission_time DESC',
             [student_id]
         );
         res.json(rows);
    } catch(error) {
         console.error(error);
         res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    submitLaundry,
    getHistory
};
