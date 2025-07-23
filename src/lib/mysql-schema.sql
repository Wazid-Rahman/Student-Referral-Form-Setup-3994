--=====================================================
-- Complete MySQL Schema for Referral System
--=====================================================
-- This file contains all the necessary tables and initial data

-- Create the database (run this separately if needed)
-- CREATE DATABASE IF NOT EXISTS u181152768_referral;
-- USE u181152768_referral;

--=====================================================
-- Table: users
--=====================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) DEFAULT NULL,
  role ENUM('user', 'staff', 'manager', 'admin') DEFAULT 'user',
  status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
  permissions JSON DEFAULT NULL,
  department VARCHAR(255) DEFAULT NULL,
  location VARCHAR(255) DEFAULT NULL,
  student_name VARCHAR(255) DEFAULT NULL,
  student_grade VARCHAR(50) DEFAULT NULL,
  referrals_count INT DEFAULT 0,
  conversions_count INT DEFAULT 0,
  earnings DECIMAL(10,2) DEFAULT 0.00,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status)
);

--=====================================================
-- Table: referral_links
--=====================================================
CREATE TABLE IF NOT EXISTS referral_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  affiliate_id VARCHAR(50) NOT NULL UNIQUE,
  user_id INT NULL,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  last_used_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_affiliate_id (affiliate_id),
  INDEX idx_user_id (user_id)
);

--=====================================================
-- Table: form_submissions
--=====================================================
CREATE TABLE IF NOT EXISTS form_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  referral_id INT NULL,
  form_name VARCHAR(255) DEFAULT 'Educational Program Application',
  parent_name VARCHAR(255) NOT NULL,
  parent_email VARCHAR(255) NOT NULL,
  parent_phone VARCHAR(50) DEFAULT NULL,
  student_name VARCHAR(255) NOT NULL,
  student_grade VARCHAR(50) DEFAULT NULL,
  student_email VARCHAR(255) DEFAULT NULL,
  student_phone VARCHAR(50) DEFAULT NULL,
  school_name VARCHAR(255) DEFAULT NULL,
  district_name VARCHAR(255) DEFAULT NULL,
  city VARCHAR(255) DEFAULT NULL,
  state VARCHAR(50) DEFAULT NULL,
  program VARCHAR(100) DEFAULT NULL,
  referred_by VARCHAR(255) DEFAULT NULL,
  affiliate_id VARCHAR(50) DEFAULT NULL,
  status ENUM('pending', 'contacted', 'enrolled', 'completed', 'cancelled') DEFAULT 'pending',
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (referral_id) REFERENCES referral_links(id) ON DELETE SET NULL,
  INDEX idx_affiliate_id (affiliate_id),
  INDEX idx_status (status),
  INDEX idx_parent_email (parent_email),
  INDEX idx_created_at (created_at)
);

--=====================================================
-- Table: forms
--=====================================================
CREATE TABLE IF NOT EXISTS forms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  status ENUM('draft', 'active', 'archived') DEFAULT 'draft',
  fields JSON DEFAULT NULL,
  sections JSON DEFAULT NULL,
  settings JSON DEFAULT NULL,
  submissions INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_name (name)
);

--=====================================================
-- Table: branding_settings
--=====================================================
CREATE TABLE IF NOT EXISTS branding_settings (
  id INT PRIMARY KEY DEFAULT 1,
  siteName VARCHAR(255) DEFAULT 'EduReferral',
  tagline TEXT DEFAULT 'Join our referral program and help students succeed while earning rewards',
  logoUrl TEXT DEFAULT NULL,
  logoAlt VARCHAR(255) DEFAULT 'Company Logo',
  faviconUrl TEXT DEFAULT NULL,
  primaryColor VARCHAR(20) DEFAULT '#4F46E5',
  secondaryColor VARCHAR(20) DEFAULT '#818CF8',
  footerText TEXT DEFAULT '© 2024 EduReferral. All rights reserved.',
  showTagline BOOLEAN DEFAULT TRUE,
  customFonts BOOLEAN DEFAULT FALSE,
  fontHeading VARCHAR(255) DEFAULT 'system-ui',
  fontBody VARCHAR(255) DEFAULT 'system-ui',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--=====================================================
-- Initial Data: Default Users
--=====================================================
-- Insert Default Admin User
INSERT INTO users (
  email, name, role, status, permissions, department, location
) VALUES (
  'admin@example.com', 'Admin User', 'admin', 'active', 
  '["users:read","users:write","forms:read","forms:write","analytics:read","analytics:write","settings:read","settings:write"]',
  'Administration', 'Head Office'
) ON DUPLICATE KEY UPDATE permissions=VALUES(permissions), department=VALUES(department), location=VALUES(location);

-- Insert Default Manager User
INSERT INTO users (
  email, name, role, status, permissions, department, location
) VALUES (
  'manager@example.com', 'Manager User', 'manager', 'active', 
  '["users:read","forms:read","forms:write","analytics:read"]',
  'Operations', 'Regional Office'
) ON DUPLICATE KEY UPDATE permissions=VALUES(permissions), department=VALUES(department), location=VALUES(location);

-- Insert Default Regular User
INSERT INTO users (
  email, name, role, status, permissions, department, location, student_name, student_grade
) VALUES (
  'user@example.com', 'Regular User', 'user', 'active', 
  '["forms:read"]',
  'Parent', 'Los Angeles, CA', 'Student Name', '11th Grade'
) ON DUPLICATE KEY UPDATE permissions=VALUES(permissions), department=VALUES(department), location=VALUES(location), student_name=VALUES(student_name), student_grade=VALUES(student_grade);

-- Insert Sample Staff Users
INSERT INTO users (
  email, name, role, status, permissions, department, location
) VALUES (
  'staff1@example.com', 'Sarah Johnson', 'staff', 'active', 
  '["users:read","forms:read"]',
  'Customer Support', 'San Francisco, CA'
), (
  'staff2@example.com', 'Mike Chen', 'staff', 'active', 
  '["forms:read","analytics:read"]',
  'Marketing', 'Austin, TX'
) ON DUPLICATE KEY UPDATE permissions=VALUES(permissions), department=VALUES(department), location=VALUES(location);

--=====================================================
-- Initial Data: Sample Forms
--=====================================================
INSERT INTO forms (
  name, description, status, fields, sections, settings, submissions
) VALUES (
  'Educational Program Application',
  'Main application form for all educational programs',
  'active',
  '[ {"id": "parent_name","type": "text","label": "Parent/Guardian Name","placeholder": "Enter full name","required": true,"section": "parent"},{"id": "parent_email","type": "email","label": "Email Address","placeholder": "parent@example.com","required": true,"section": "parent"},{"id": "parent_phone","type": "tel","label": "Phone Number","placeholder": "(555) 123-4567","required": true,"section": "parent"},{"id": "student_name","type": "text","label": "Student Name","placeholder": "Enter student name","required": true,"section": "student"},{"id": "student_grade","type": "select","label": "Grade Level","required": true,"section": "student","options": ["9th Grade","10th Grade","11th Grade","12th Grade"]},{"id": "school_name","type": "text","label": "School Name","placeholder": "Enter school name","required": true,"section": "location"},{"id": "city","type": "text","label": "City","placeholder": "Enter city","required": true,"section": "location"},{"id": "state","type": "text","label": "State","placeholder": "Enter state","required": true,"section": "location"},{"id": "program","type": "select","label": "Program of Interest","required": true,"section": "program","options": ["SAT Prep","ACT Prep","PSAT Prep","AP Math","AP Science","College Essays"]} ]',
  '[ {"id": "parent","name": "Parent Information","icon": "FiUser"},{"id": "student","name": "Student Information","icon": "FiGraduationCap"},{"id": "location","name": "Location Information","icon": "FiMapPin"},{"id": "program","name": "Program Information","icon": "FiBook"} ]',
  '{"allowDuplicates": false,"sendConfirmationEmail": true,"redirectUrl": "","submitButtonText": "Submit Application"}',
  0
) ON DUPLICATE KEY UPDATE name=VALUES(name);

--=====================================================
-- Initial Data: Default Branding Settings
--=====================================================
INSERT INTO branding_settings (
  id, siteName, tagline, primaryColor, secondaryColor, footerText
) VALUES (
  1, 'EduReferral', 'Join our referral program and help students succeed while earning rewards',
  '#4F46E5', '#818CF8', '© 2024 EduReferral. All rights reserved.'
) ON DUPLICATE KEY UPDATE siteName=VALUES(siteName), tagline=VALUES(tagline), primaryColor=VALUES(primaryColor), secondaryColor=VALUES(secondaryColor), footerText=VALUES(footerText);

--=====================================================
-- Sample Data: Referral Links (Optional)
--=====================================================
INSERT INTO referral_links (
  affiliate_id, user_id, clicks, conversions, created_at
) VALUES (
  'demo123abc', (SELECT id FROM users WHERE email='user@example.com' LIMIT 1),
  15, 3, DATE_SUB(NOW(), INTERVAL 7 DAY)
), (
  'sample456def', (SELECT id FROM users WHERE email='user@example.com' LIMIT 1),
  8, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)
) ON DUPLICATE KEY UPDATE affiliate_id=VALUES(affiliate_id);

--=====================================================
-- Sample Data: Form Submissions (Optional)
--=====================================================
INSERT INTO form_submissions (
  referral_id, parent_name, parent_email, parent_phone, student_name, student_grade,
  school_name, district_name, city, state, program, affiliate_id, status, created_at
) VALUES (
  (SELECT id FROM referral_links WHERE affiliate_id='demo123abc' LIMIT 1),
  'Jennifer Smith', 'jennifer.smith@email.com', '(555) 123-4567',
  'Emma Smith', '11th Grade', 'Lincoln High School', 'Westside School District',
  'Los Angeles', 'CA', 'SAT Prep', 'demo123abc', 'pending', DATE_SUB(NOW(), INTERVAL 2 DAY)
), (
  (SELECT id FROM referral_links WHERE affiliate_id='demo123abc' LIMIT 1),
  'Michael Johnson', 'michael.johnson@email.com', '(555) 234-5678',
  'David Johnson', '12th Grade', 'Washington High School', 'Eastside School District',
  'San Francisco', 'CA', 'ACT Prep', 'demo123abc', 'contacted', DATE_SUB(NOW(), INTERVAL 1 DAY)
) ON DUPLICATE KEY UPDATE parent_email=VALUES(parent_email);

--=====================================================
-- Indexes for Performance (Additional)
--=====================================================
-- Add additional indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referral_links_created_at ON referral_links(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);

--=====================================================
-- Views for Common Queries (Optional)
--=====================================================
-- Create a view for active referral statistics
CREATE OR REPLACE VIEW referral_stats AS
SELECT 
  rl.affiliate_id,
  rl.user_id,
  u.name as user_name,
  u.email as user_email,
  rl.clicks,
  rl.conversions,
  COUNT(fs.id) as total_submissions,
  SUM(CASE WHEN fs.status='enrolled' THEN 1 ELSE 0 END) as enrolled_count,
  rl.created_at as link_created_at,
  rl.last_used_at
FROM referral_links rl
LEFT JOIN users u ON rl.user_id = u.id
LEFT JOIN form_submissions fs ON rl.affiliate_id = fs.affiliate_id
GROUP BY rl.id, rl.affiliate_id, rl.user_id, u.name, u.email, rl.clicks, rl.conversions, rl.created_at, rl.last_used_at;

--=====================================================
-- Database Info
--=====================================================
-- Show table information
SELECT 'Database schema created successfully!' as status, COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = DATABASE();

-- Show sample data counts
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'referral_links' as table_name, COUNT(*) as record_count FROM referral_links
UNION ALL
SELECT 'form_submissions' as table_name, COUNT(*) as record_count FROM form_submissions
UNION ALL
SELECT 'forms' as table_name, COUNT(*) as record_count FROM forms
UNION ALL
SELECT 'branding_settings' as table_name, COUNT(*) as record_count FROM branding_settings;