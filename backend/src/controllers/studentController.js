const db = require('../config/db');
const bcrypt = require('bcrypt');

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
        console.error("Laundry error: ", error);
        res.status(500).json({ message: 'Server error: ' + error.message, code: 'SERVER_ERROR' });
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
         res.status(500).json({ message: 'Server error', code: 'SERVER_ERROR' });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, phone_number, password } = req.body;
        const student_id = req.user.id;

        if (!name || !phone_number) {
            return res.status(400).json({ message: 'Name and phone number are required' });
        }

        let query = 'UPDATE students SET name = ?, phone_number = ?';
        let params = [name, phone_number];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', password = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE id = ?';
        params.push(student_id);

        await db.query(query, params);

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error("Profile update error: ", error);
        res.status(500).json({ message: 'Server error: ' + error.message, code: 'SERVER_ERROR' });
    }
};

module.exports = {
    submitLaundry,
    getHistory,
    updateProfile
};
