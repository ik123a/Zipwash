-- ============================================
-- MIGRATION SCRIPT: Update Existing Database
-- Run this on existing ZippWash databases
-- ============================================

USE `zippwash`;

-- Start transaction
START TRANSACTION;

-- ============================================
-- 1. ADD NEW COLUMNS TO EXISTING TABLES
-- ============================================

-- Students table enhancements
ALTER TABLE students
    ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE AFTER phone_number,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at,
    ADD COLUMN IF NOT EXISTS created_by INT AFTER updated_at,
    ADD COLUMN IF NOT EXISTS updated_by INT AFTER created_by;

-- Add constraint for password length (may fail on existing short passwords)
-- ALTER TABLE students ADD CONSTRAINT chk_password_length CHECK (CHAR_LENGTH(password) >= 8);

-- Staff table enhancements
ALTER TABLE staff
    ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE AFTER assigned_hostel,
    ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) AFTER email,
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE AFTER password,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at,
    ADD COLUMN IF NOT EXISTS created_by INT AFTER updated_at,
    ADD COLUMN IF NOT EXISTS updated_by INT AFTER created_by,
    ADD FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE SET NULL,
    ADD FOREIGN KEY (updated_by) REFERENCES staff(id) ON DELETE SET NULL;

-- Clothes entries enhancements
ALTER TABLE clothes_entries
    ADD COLUMN IF NOT EXISTS notes TEXT AFTER status,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER submission_time,
    ADD COLUMN IF NOT EXISTS created_by INT AFTER updated_at,
    ADD COLUMN IF NOT EXISTS updated_by INT AFTER created_by,
    ADD FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE SET NULL,
    ADD FOREIGN KEY (updated_by) REFERENCES staff(id) ON DELETE SET NULL;

-- Machine status enhancements
ALTER TABLE machine_status
    ADD COLUMN IF NOT EXISTS machine_type ENUM('washer', 'dryer', 'combo') DEFAULT 'washer' AFTER machine_number,
    ADD COLUMN IF NOT EXISTS capacity_kg DECIMAL(5,2) AFTER status,
    ADD COLUMN IF NOT EXISTS location VARCHAR(255) AFTER capacity_kg,
    ADD COLUMN IF NOT EXISTS updated_by INT AFTER updated_at,
    ADD FOREIGN KEY (updated_by) REFERENCES staff(id) ON DELETE SET NULL;

-- Modify machine_status status enum to include 'maintenance'
ALTER TABLE machine_status
    MODIFY COLUMN status ENUM('available', 'busy', 'reserved', 'offline', 'maintenance') DEFAULT 'available';

-- Drop and recreate transactions table with enhanced schema
-- WARNING: Backup your data first!
-- CREATE TABLE transactions_backup AS SELECT * FROM transactions;
-- DROP TABLE transactions;
-- Then recreate using the new schema from schema.sql

-- ============================================
-- 2. CREATE NEW TABLES
-- ============================================

-- Create bookings table if not exists
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    machine_id INT,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show') DEFAULT 'pending',
    clothes_entry_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (machine_id) REFERENCES machine_status(id) ON DELETE SET NULL,
    FOREIGN KEY (clothes_entry_id) REFERENCES clothes_entries(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create feedback table if not exists
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    clothes_entry_id INT,
    rating INT NOT NULL,
    comments TEXT,
    category ENUM('service', 'quality', 'timeliness', 'staff', 'app', 'other') DEFAULT 'service',
    is_resolved BOOLEAN DEFAULT FALSE,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_by INT,
    resolved_at TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (clothes_entry_id) REFERENCES clothes_entries(id) ON DELETE SET NULL,
    FOREIGN KEY (resolved_by) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. ADD INDEXES
-- ============================================

-- Students indexes
CREATE INDEX IF NOT EXISTS idx_students_roll ON students(roll_number);
CREATE INDEX IF NOT EXISTS idx_students_phone ON students(phone_number);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_created ON students(created_at);

-- Staff indexes
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_hostel ON staff(assigned_hostel);
CREATE INDEX IF NOT EXISTS idx_staff_active ON staff(is_active);
CREATE INDEX IF NOT EXISTS idx_staff_created ON staff(created_at);

-- Clothes entries indexes
CREATE INDEX IF NOT EXISTS idx_clothes_student ON clothes_entries(student_id);
CREATE INDEX IF NOT EXISTS idx_clothes_status ON clothes_entries(status);
CREATE INDEX IF NOT EXISTS idx_clothes_submission ON clothes_entries(submission_time);
CREATE INDEX IF NOT EXISTS idx_clothes_updated ON clothes_entries(updated_at);

-- Machine status indexes
CREATE INDEX IF NOT EXISTS idx_machine_status ON machine_status(status);
CREATE INDEX IF NOT EXISTS idx_machine_type ON machine_status(machine_type);
CREATE INDEX IF NOT EXISTS idx_machine_updated ON machine_status(updated_at);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_student ON bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_machine ON bookings(machine_id);
CREATE INDEX IF NOT EXISTS idx_bookings_clothes ON bookings(clothes_entry_id);
CREATE INDEX IF NOT EXISTS idx_bookings_timeslot ON bookings(booking_date, time_slot);

-- Feedback indexes
CREATE INDEX IF NOT EXISTS idx_feedback_student ON feedback(student_id);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON feedback(category);
CREATE INDEX IF NOT EXISTS idx_feedback_resolved ON feedback(is_resolved);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at);

-- Transactions indexes (if table exists)
-- CREATE INDEX IF NOT EXISTS idx_transactions_student ON transactions(student_id);
-- CREATE INDEX IF NOT EXISTS idx_transactions_clothes ON transactions(clothes_entry_id);
-- CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp);
-- CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(transaction_status);
-- CREATE INDEX IF NOT EXISTS idx_transactions_payment ON transactions(payment_method);

-- ============================================
-- 4. UPDATE EXISTING MACHINE DATA
-- ============================================

UPDATE machine_status SET machine_type = 'washer', capacity_kg = 7.0, location = 'Block A Ground Floor' WHERE machine_number IN ('M1', 'M2');
UPDATE machine_status SET machine_type = 'dryer', capacity_kg = 7.0, location = 'Block A Ground Floor' WHERE machine_number = 'M3';
UPDATE machine_status SET machine_type = 'washer', capacity_kg = 10.0, location = 'Block B First Floor' WHERE machine_number = 'W1';
UPDATE machine_status SET machine_type = 'combo', capacity_kg = 8.0, location = 'Block B First Floor' WHERE machine_number = 'W2';

COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify all tables exist
SELECT 'Students' as table_name, COUNT(*) as row_count FROM students
UNION ALL
SELECT 'Staff', COUNT(*) FROM staff
UNION ALL
SELECT 'Clothes Entries', COUNT(*) FROM clothes_entries
UNION ALL
SELECT 'Machine Status', COUNT(*) FROM machine_status
UNION ALL
SELECT 'Bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'Feedback', COUNT(*) FROM feedback
UNION ALL
SELECT 'Transactions', COUNT(*) FROM transactions;

-- Verify indexes were created
SELECT TABLE_NAME, INDEX_NAME, COLUMN_NAME, CARDINALITY
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'zippwash'
ORDER BY TABLE_NAME, INDEX_NAME;
