const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const registerStudent = async (req, res) => {
  try {
    const { name, roll_number, phone_number, password } = req.body;
    
    // Check if student exists
    const [existing] = await db.query('SELECT * FROM students WHERE roll_number = ?', [roll_number]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Student with this roll number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.query(
      'INSERT INTO students (name, roll_number, phone_number, password) VALUES (?, ?, ?, ?)',
      [name, roll_number, phone_number, hashedPassword]
    );

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { roll_number, password } = req.body;
    
    const [students] = await db.query('SELECT * FROM students WHERE roll_number = ?', [roll_number]);
    if (students.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const student = students[0];
    const isMatch = await bcrypt.compare(password, student.password);
    
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: student.id, role: 'student', roll_number: student.roll_number },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
        token,
        user: { id: student.id, name: student.name, roll_number: student.roll_number, role: 'student' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const loginStaff = async (req, res) => {
    // Basic mock staff implementation for now.
    // In a real scenario, you'd have an admin panel to create staff members or an init script.
    res.status(501).json({ message: 'Staff login not fully implemented yet.'});
};

module.exports = {
  registerStudent,
  loginStudent,
  loginStaff
};
