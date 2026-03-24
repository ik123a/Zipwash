const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
  let connection;
  try {
    console.log('Connecting to MySQL server...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('Creating database if not exists...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'zippwash'}\`;`);
    await connection.query(`USE \`${process.env.DB_NAME || 'zippwash'}\`;`);

    console.log('Creating tables...');

    // 1. students
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        roll_number VARCHAR(100) NOT NULL UNIQUE,
        phone_number VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. staff
    await connection.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100) NOT NULL,
        assigned_hostel VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. clothes_entries
    await connection.query(`
      CREATE TABLE IF NOT EXISTS clothes_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        number_of_clothes INT NOT NULL,
        submission_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('submitted', 'processing', 'washing', 'ready', 'delivered') DEFAULT 'submitted',
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      );
    `);

    // 4. machine_status
    await connection.query(`
      CREATE TABLE IF NOT EXISTS machine_status (
        id INT AUTO_INCREMENT PRIMARY KEY,
        machine_number VARCHAR(50) NOT NULL UNIQUE,
        status ENUM('available', 'busy', 'reserved', 'offline') DEFAULT 'available',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // 5. transactions
    await connection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clothes_entry_id INT NOT NULL,
        action_type VARCHAR(255) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (clothes_entry_id) REFERENCES clothes_entries(id) ON DELETE CASCADE
      );
    `);

    // Insert mock machines if empty
    const [machines] = await connection.query('SELECT COUNT(*) as count FROM machine_status');
    if (machines[0].count === 0) {
      await connection.query(`
        INSERT INTO machine_status (machine_number, status) VALUES 
        ('M1', 'available'),
        ('M2', 'available'),
        ('M3', 'available'),
        ('W1', 'available'),
        ('W2', 'available')
      `);
      console.log('Inserted default machines.');
    }

    console.log('Database initialization completed successfully.');

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit();
  }
}

initializeDatabase();
