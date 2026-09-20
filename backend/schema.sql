-- MySQL Workbench Schema for ZippWash (Laundry App)
-- Improved with indexes, constraints, and audit trails

CREATE DATABASE IF NOT EXISTS `zippwash`;
USE `zippwash`;

-- ============================================
-- 1. STUDENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    -- Audit columns
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    -- Constraints
    CONSTRAINT chk_password_length CHECK (CHAR_LENGTH(password) >= 8),
    CONSTRAINT chk_phone_format CHECK (phone_number REGEXP '^[0-9+\\-\\s\\(\\)]{10,20}$'),
    CONSTRAINT chk_roll_not_empty CHECK (CHAR_LENGTH(TRIM(roll_number)) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for students
CREATE INDEX idx_students_roll ON students(roll_number);
CREATE INDEX idx_students_phone ON students(phone_number);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_created ON students(created_at);

-- ============================================
-- 2. STAFF TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    assigned_hostel VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    -- Audit columns
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    -- Constraints
    CONSTRAINT chk_staff_password_length CHECK (CHAR_LENGTH(password) >= 8),
    CONSTRAINT chk_role_not_empty CHECK (CHAR_LENGTH(TRIM(role)) > 0),
    CONSTRAINT chk_staff_phone_format CHECK (phone_number IS NULL OR phone_number REGEXP '^[0-9+\\-\\s\\(\\)]{10,20}$'),
    -- Self-referencing for created_by/updated_by
    FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for staff
CREATE INDEX idx_staff_role ON staff(role);
CREATE INDEX idx_staff_hostel ON staff(assigned_hostel);
CREATE INDEX idx_staff_active ON staff(is_active);
CREATE INDEX idx_staff_created ON staff(created_at);

-- ============================================
-- 3. CLOTHES ENTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS clothes_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    number_of_clothes INT NOT NULL,
    submission_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('submitted', 'processing', 'washing', 'ready', 'delivered') DEFAULT 'submitted',
    notes TEXT,
    -- Audit columns
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    -- Constraints
    CONSTRAINT chk_clothes_positive CHECK (number_of_clothes > 0 AND number_of_clothes <= 100),
    CONSTRAINT chk_clothes_reasonable CHECK (number_of_clothes <= 50),
    -- Foreign Keys
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for clothes_entries
CREATE INDEX idx_clothes_student ON clothes_entries(student_id);
CREATE INDEX idx_clothes_status ON clothes_entries(status);
CREATE INDEX idx_clothes_submission ON clothes_entries(submission_time);
CREATE INDEX idx_clothes_updated ON clothes_entries(updated_at);

-- ============================================
-- 4. MACHINE STATUS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS machine_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    machine_number VARCHAR(50) NOT NULL UNIQUE,
    machine_type ENUM('washer', 'dryer', 'combo') DEFAULT 'washer',
    status ENUM('available', 'busy', 'reserved', 'offline', 'maintenance') DEFAULT 'available',
    capacity_kg DECIMAL(5,2),
    location VARCHAR(255),
    -- Audit columns
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    -- Constraints
    CONSTRAINT chk_machine_number CHECK (CHAR_LENGTH(TRIM(machine_number)) > 0),
    -- Foreign Keys
    FOREIGN KEY (updated_by) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for machine_status
CREATE INDEX idx_machine_status ON machine_status(status);
CREATE INDEX idx_machine_type ON machine_status(machine_type);
CREATE INDEX idx_machine_updated ON machine_status(updated_at);

-- ============================================
-- 5. BOOKINGS TABLE (NEW)
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    machine_id INT,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show') DEFAULT 'pending',
    clothes_entry_id INT,
    notes TEXT,
    -- Audit columns
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    -- Constraints
    CONSTRAINT chk_time_slot CHECK (CHAR_LENGTH(TRIM(time_slot)) > 0),
    -- CONSTRAINT chk_booking_date CHECK (booking_date >= CURDATE() OR booking_date >= DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
    -- Foreign Keys
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (machine_id) REFERENCES machine_status(id) ON DELETE SET NULL,
    FOREIGN KEY (clothes_entry_id) REFERENCES clothes_entries(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for bookings
CREATE INDEX idx_bookings_student ON bookings(student_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_machine ON bookings(machine_id);
CREATE INDEX idx_bookings_clothes ON bookings(clothes_entry_id);
CREATE INDEX idx_bookings_timeslot ON bookings(booking_date, time_slot);

-- ============================================
-- 6. FEEDBACK TABLE (NEW)
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    clothes_entry_id INT,
    rating INT NOT NULL,
    comments TEXT,
    category ENUM('service', 'quality', 'timeliness', 'staff', 'app', 'other') DEFAULT 'service',
    is_resolved BOOLEAN DEFAULT FALSE,
    resolution_notes TEXT,
    -- Audit columns
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_by INT,
    resolved_at TIMESTAMP,
    -- Constraints
    CONSTRAINT chk_rating_range CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT chk_feedback_length CHECK (comments IS NULL OR CHAR_LENGTH(comments) <= 2000),
    -- Foreign Keys
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (clothes_entry_id) REFERENCES clothes_entries(id) ON DELETE SET NULL,
    FOREIGN KEY (resolved_by) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for feedback
CREATE INDEX idx_feedback_student ON feedback(student_id);
CREATE INDEX idx_feedback_rating ON feedback(rating);
CREATE INDEX idx_feedback_category ON feedback(category);
CREATE INDEX idx_feedback_resolved ON feedback(is_resolved);
CREATE INDEX idx_feedback_created ON feedback(created_at);

-- ============================================
-- 7. TRANSACTIONS TABLE (ENHANCED)
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    clothes_entry_id INT,
    action_type VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2),
    payment_method ENUM('cash', 'card', 'upi', 'wallet', 'none') DEFAULT 'none',
    transaction_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'completed',
    description TEXT,
    transaction_reference VARCHAR(255) UNIQUE,
    -- Audit columns
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    -- Constraints
    CONSTRAINT chk_amount_non_negative CHECK (amount IS NULL OR amount >= 0),
    CONSTRAINT chk_action_not_empty CHECK (CHAR_LENGTH(TRIM(action_type)) > 0),
    -- Foreign Keys
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
    FOREIGN KEY (clothes_entry_id) REFERENCES clothes_entries(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for transactions
CREATE INDEX idx_transactions_student ON transactions(student_id);
CREATE INDEX idx_transactions_clothes ON transactions(clothes_entry_id);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp);
CREATE INDEX idx_transactions_status ON transactions(transaction_status);
CREATE INDEX idx_transactions_payment ON transactions(payment_method);

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert Initial Machine Data
INSERT IGNORE INTO machine_status (machine_number, machine_type, status, capacity_kg, location) VALUES
('M1', 'washer', 'available', 7.0, 'Block A Ground Floor'),
('M2', 'washer', 'available', 7.0, 'Block A Ground Floor'),
('M3', 'dryer', 'available', 7.0, 'Block A Ground Floor'),
('W1', 'washer', 'available', 10.0, 'Block B First Floor'),
('W2', 'combo', 'available', 8.0, 'Block B First Floor');

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: Active Bookings with Student Info
CREATE OR REPLACE VIEW vw_active_bookings AS
SELECT
    b.id,
    b.booking_date,
    b.time_slot,
    b.status,
    s.name AS student_name,
    s.roll_number,
    s.phone_number,
    m.machine_number,
    m.machine_type
FROM bookings b
JOIN students s ON b.student_id = s.id
LEFT JOIN machine_status m ON b.machine_id = m.id
WHERE b.status IN ('pending', 'confirmed');

-- View: Pending Clothes Entries
CREATE OR REPLACE VIEW vw_pending_clothes AS
SELECT
    ce.id,
    ce.number_of_clothes,
    ce.status,
    ce.submission_time,
    s.name AS student_name,
    s.roll_number,
    s.phone_number,
    DATEDIFF(NOW(), ce.submission_time) AS days_pending
FROM clothes_entries ce
JOIN students s ON ce.student_id = s.id
WHERE ce.status NOT IN ('delivered');

-- View: Student Summary
CREATE OR REPLACE VIEW vw_student_summary AS
SELECT
    s.id,
    s.name,
    s.roll_number,
    s.phone_number,
    s.created_at,
    COUNT(DISTINCT ce.id) AS total_entries,
    COUNT(DISTINCT b.id) AS total_bookings,
    COUNT(DISTINCT f.id) AS total_feedback
FROM students s
LEFT JOIN clothes_entries ce ON s.id = ce.student_id
LEFT JOIN bookings b ON s.id = b.student_id
LEFT JOIN feedback f ON s.id = f.student_id
GROUP BY s.id, s.name, s.roll_number, s.phone_number, s.created_at;
