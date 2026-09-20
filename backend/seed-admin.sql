-- ============================================
-- SEED DATA: Initial Admin User
-- Run this after schema.sql to create admin account
-- ============================================

USE `zippwash`;

-- Insert initial admin user
-- Password: admin123 (hashed with bcrypt)
-- Email: admin (mapped from username field)
-- Note: This uses a pre-computed bcrypt hash for 'admin123'

INSERT IGNORE INTO staff (
    name,
    role,
    assigned_hostel,
    email,
    phone_number,
    password,
    is_active,
    created_at,
    updated_at
) VALUES (
    'System Administrator',
    'admin',
    'All Blocks',
    'admin',
    '+91-0000000000',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Verify insertion
SELECT
    id,
    name,
    role,
    email,
    is_active,
    created_at
FROM staff
WHERE email = 'admin';
