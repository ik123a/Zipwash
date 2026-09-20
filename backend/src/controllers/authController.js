const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const registerStudent = async (req, res) => {
  try {
    const { name, roll_number, phone_number, password } = req.body;

    // Password validation
    if (!password || password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters',
        code: 'INVALID_PASSWORD'
      });
    }

    // Check if student exists
    const [existing] = await db.query('SELECT * FROM students WHERE roll_number = ?', [roll_number]);
    if (existing.length > 0) {
      return res.status(400).json({
        message: 'Student with this roll number already exists',
        code: 'STUDENT_EXISTS'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO students (name, roll_number, phone_number, password) VALUES (?, ?, ?, ?)',
      [name, roll_number, phone_number, hashedPassword]
    );

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Server error during registration',
      code: 'REGISTRATION_FAILED',
      details: error.message
    });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { roll_number, password } = req.body;

    const [students] = await db.query('SELECT * FROM students WHERE roll_number = ?', [roll_number]);
    if (students.length === 0) {
      return res.status(401).json({
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const student = students[0];
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const token = jwt.sign(
      { id: student.id, role: 'student', roll_number: student.roll_number },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: student.id,
        name: student.name,
        roll_number: student.roll_number,
        phone_number: student.phone_number,
        role: 'student'
      }
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({
      message: 'Server error during login',
      code: 'LOGIN_FAILED',
      details: error.message
    });
  }
};

const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch staff from database using DATABASE (no hardcoded credentials)
    // Use username column instead of email
    const [staff] = await db.query('SELECT * FROM staff WHERE email = ?', [email]);
    if (staff.length === 0) {
      return res.status(401).json({
        message: 'Invalid admin credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const staffMember = staff[0];
    const isMatch = await bcrypt.compare(password, staffMember.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid admin credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const token = jwt.sign(
      { id: staffMember.id, role: 'staff', email: staffMember.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: staffMember.id,
        name: staffMember.name,
        email: staffMember.email,
        role: 'staff'
      }
    });
  } catch (error) {
    console.error('Staff login error:', error);
    res.status(500).json({
      message: 'Server error during admin login',
      code: 'LOGIN_FAILED',
      details: error.message
    });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  loginStaff
};
