const mysql = require('mysql2/promise');
require('dotenv').config({path: './.env'});
const bcrypt = require('bcrypt');

async function setup() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('Checking for username column in staff...');
    const [cols] = await conn.query('SHOW COLUMNS FROM staff LIKE "username"');
    if (cols.length === 0) {
      console.log('Adding username column...');
      await conn.query('ALTER TABLE staff ADD COLUMN username VARCHAR(255) UNIQUE AFTER name');
    }

    const hashedPass = await bcrypt.hash('admin123', 10);
    console.log('Seeding admin account...');
    await conn.query('INSERT IGNORE INTO staff (name, username, role, password) VALUES (?, ?, ?, ?)', 
      ['Admin', 'admin', 'staff', hashedPass]);

    const studentPass = await bcrypt.hash('password123', 10);
    console.log('Seeding student account...');
    await conn.query('INSERT IGNORE INTO students (name, roll_number, phone_number, password) VALUES (?, ?, ?, ?)', 
      ['Test Student', 'TEST001', '1234567890', studentPass]);

    console.log('Setup complete.');
  } catch (e) {
    console.error('Setup error:', e);
  } finally {
    await conn.end();
  }
}

setup();
