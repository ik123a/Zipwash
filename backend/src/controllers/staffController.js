const db = require('../config/db');

const getAllSubmissions = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT ce.*, s.name as student_name, s.roll_number 
            FROM clothes_entries ce
            JOIN students s ON ce.student_id = s.id
            ORDER BY ce.submission_time DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const validStatuses = ['submitted', 'processing', 'washing', 'ready', 'delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        await db.query('UPDATE clothes_entries SET status = ? WHERE id = ?', [status, id]);
        
        // Record transaction
        await db.query(
             'INSERT INTO transactions (clothes_entry_id, action_type) VALUES (?, ?)',
             [id, `status_updated_to_${status}`]
        );

        res.json({ message: 'Status updated successfully' });
    } catch (error) {
         console.error(error);
         res.status(500).json({ message: 'Server error' });
    }
};

const getMachines = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM machine_status');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateMachineStatus = async (req, res) => {
    try {
         const { id } = req.params;
         const { status } = req.body;

         const validStatuses = ['available', 'busy', 'reserved', 'offline'];
         if (!validStatuses.includes(status)) {
              return res.status(400).json({ message: 'Invalid machine status' });
         }

         await db.query('UPDATE machine_status SET status = ? WHERE id = ?', [status, id]);
         res.json({ message: 'Machine status updated' });
    } catch(error) {
         console.error(error);
         res.status(500).json({ message: 'Server error' });
    }
}


module.exports = {
    getAllSubmissions,
    updateStatus,
    getMachines,
    updateMachineStatus
};
