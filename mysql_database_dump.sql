--=====================================================
-- Complete MySQL Database Dump for Referral Management System
--=====================================================
-- This file contains all tables, sample data, and configurations
-- Import this file into your MySQL database to get started

-- Create the database
CREATE DATABASE IF NOT EXISTS u181152768_referral;
USE u181152768_referral;

-- Set character set and collation
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

--=====================================================
-- 1. USERS TABLE
--=====================================================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
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
-- 2. REFERRAL LINKS TABLE
--=====================================================
DROP TABLE IF EXISTS referral_links;
CREATE TABLE referral_links (
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
-- 3. FORM SUBMISSIONS TABLE
--=====================================================
DROP TABLE IF EXISTS form_submissions;
CREATE TABLE form_submissions (
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
-- 4. FORMS TABLE
--=====================================================
DROP TABLE IF EXISTS forms;
CREATE TABLE forms (
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
-- 5. BRANDING SETTINGS TABLE
--=====================================================
DROP TABLE IF EXISTS branding_settings;
CREATE TABLE branding_settings (
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
-- INSERT SAMPLE DATA
--=====================================================
-- Insert Sample Users
INSERT INTO users (email, name, password, role, status, permissions, department, location, student_name, student_grade, referrals_count, conversions_count, earnings, last_login_at)
VALUES
-- Admin Users
('admin@example.com', 'Admin User', 'admin123', 'admin', 'active', '["users:read","users:write","forms:read","forms:write","analytics:read","analytics:write","settings:read","settings:write"]', 'Administration', 'Head Office', NULL, NULL, 0, 0, 0.00, '2024-01-21 17:30:00'),

-- Manager Users
('manager@example.com', 'Manager User', 'manager123', 'manager', 'active', '["users:read","forms:read","forms:write","analytics:read"]', 'Operations', 'Regional Office', NULL, NULL, 0, 0, 0.00, '2024-01-21 16:15:00'),
('sarah.johnson@company.com', 'Sarah Johnson', 'password123', 'manager', 'active', '["users:read","forms:read","forms:write","analytics:read"]', 'Operations', 'Los Angeles, CA', NULL, NULL, 0, 0, 0.00, '2024-01-19 14:45:00'),

-- Staff Users
('john.smith@company.com', 'John Smith', 'password123', 'staff', 'active', '["users:read","forms:read","forms:write","analytics:read","settings:read","settings:write"]', 'Administration', 'New York, NY', NULL, NULL, 0, 0, 0.00, '2024-01-20 10:30:00'),
('mike.chen@company.com', 'Mike Chen', 'password123', 'staff', 'active', '["users:read","forms:read"]', 'Support', 'Austin, TX', NULL, NULL, 0, 0, 0.00, '2024-01-18 09:15:00'),
('emily.davis@company.com', 'Emily Davis', 'password123', 'staff', 'inactive', '["forms:read","analytics:read"]', 'Marketing', 'Miami, FL', NULL, NULL, 0, 0, 0.00, '2024-01-15 16:20:00'),

-- Regular Users (Parents/Referrers)
('user@example.com', 'Regular User', 'user123', 'user', 'active', '["forms:read"]', 'Parent', 'Los Angeles, CA', 'Student Name', '11th Grade', 8, 5, 250.00, '2024-01-20 12:00:00'),
('jennifer.smith@email.com', 'Jennifer Smith', 'password123', 'user', 'active', '["forms:read"]', 'Parent', 'Los Angeles, CA', 'Emma Smith', '11th Grade', 8, 5, 250.00, '2024-01-20 10:15:00'),
('michael.chen@email.com', 'Michael Chen', 'password123', 'user', 'active', '["forms:read"]', 'Educator', 'San Francisco, CA', 'David Chen', '12th Grade', 15, 12, 600.00, '2024-01-21 14:45:00'),
('lisa.rodriguez@email.com', 'Lisa Rodriguez', 'password123', 'user', 'active', '["forms:read"]', 'Parent', 'Austin, TX', 'Carlos Rodriguez', '10th Grade', 3, 1, 50.00, '2024-01-18 09:15:00'),
('james.wilson@email.com', 'James Wilson', 'password123', 'user', 'active', '["forms:read"]', 'Counselor', 'Boston, MA', 'Multiple Students', 'Various', 22, 18, 900.00, '2024-01-21 16:20:00'),
('robert.brown@email.com', 'Robert Brown', 'password123', 'user', 'active', '["forms:read"]', 'Parent', 'Chicago, IL', 'Jessica Brown', '11th Grade', 12, 8, 400.00, '2024-01-19 11:30:00'),
('maria.garcia@email.com', 'Maria Garcia', 'password123', 'user', 'active', '["forms:read"]', 'Parent', 'Phoenix, AZ', 'Diego Garcia', '12th Grade', 6, 4, 200.00, '2024-01-17 15:45:00'),
('david.lee@email.com', 'David Lee', 'password123', 'user', 'active', '["forms:read"]', 'Educator', 'Seattle, WA', 'Multiple Students', 'Various', 18, 14, 700.00, '2024-01-20 13:20:00'),
('amy.taylor@email.com', 'Amy Taylor', 'password123', 'user', 'inactive', '["forms:read"]', 'Parent', 'Denver, CO', 'Ryan Taylor', '10th Grade', 2, 0, 0.00, '2024-01-15 10:10:00');

-- Insert Sample Referral Links
INSERT INTO referral_links (affiliate_id, user_id, clicks, conversions, last_used_at, created_at)
VALUES
('demo123abc', 8, 25, 5, '2024-01-20 15:30:00', '2024-01-10 10:00:00'),
('sample456def', 9, 18, 3, '2024-01-19 11:45:00', '2024-01-12 14:30:00'),
('ref789ghi', 10, 32, 8, '2024-01-21 09:15:00', '2024-01-08 16:20:00'),
('test101jkl', 11, 15, 2, '2024-01-18 14:20:00', '2024-01-15 11:10:00'),
('link202mno', 12, 28, 6, '2024-01-20 16:45:00', '2024-01-05 13:45:00'),
('code303pqr', 13, 22, 4, '2024-01-19 12:30:00', '2024-01-14 09:30:00'),
('track404stu', 14, 35, 9, '2024-01-21 10:20:00', '2024-01-07 15:15:00'),
('share505vwx', 15, 12, 1, '2024-01-17 08:40:00', '2024-01-16 12:20:00');

-- Insert Sample Form Submissions
INSERT INTO form_submissions (referral_id, form_name, parent_name, parent_email, parent_phone, student_name, student_grade, student_email, student_phone, school_name, district_name, city, state, program, referred_by, affiliate_id, status, notes, created_at)
VALUES
-- Submissions for demo123abc
(1, 'Educational Program Application', 'Jennifer Smith', 'jennifer.smith@email.com', '(555) 123-4567', 'Emma Smith', '11th Grade', 'emma.smith@student.edu', '(555) 123-4568', 'Lincoln High School', 'Westside School District', 'Los Angeles', 'CA', 'SAT Prep', 'Michael Chen', 'demo123abc', 'enrolled', 'Student is very motivated and ready to start immediately', '2024-01-15 10:30:00'),
(1, 'Educational Program Application', 'Robert Johnson', 'robert.johnson@email.com', '(555) 234-5678', 'Alex Johnson', '12th Grade', 'alex.johnson@student.edu', '(555) 234-5679', 'Lincoln High School', 'Westside School District', 'Los Angeles', 'CA', 'ACT Prep', 'Michael Chen', 'demo123abc', 'contacted', 'Follow-up call scheduled for next week', '2024-01-16 14:15:00'),
(1, 'Educational Program Application', 'Patricia Williams', 'patricia.williams@email.com', '(555) 345-6789', 'Sarah Williams', '11th Grade', 'sarah.williams@student.edu', '(555) 345-6790', 'Roosevelt High School', 'Westside School District', 'Los Angeles', 'CA', 'PSAT Prep', 'Michael Chen', 'demo123abc', 'pending', 'Waiting for parent confirmation', '2024-01-18 09:45:00'),

-- Submissions for sample456def
(2, 'Educational Program Application', 'Michael Davis', 'michael.davis@email.com', '(555) 456-7890', 'Jessica Davis', '12th Grade', 'jessica.davis@student.edu', '(555) 456-7891', 'Washington High School', 'Eastside School District', 'San Francisco', 'CA', 'SAT Prep', 'Lisa Rodriguez', 'sample456def', 'enrolled', 'Excellent student, very focused on college prep', '2024-01-14 11:20:00'),
(2, 'Educational Program Application', 'Karen Miller', 'karen.miller@email.com', '(555) 567-8901', 'Thomas Miller', '11th Grade', 'thomas.miller@student.edu', '(555) 567-8902', 'Washington High School', 'Eastside School District', 'San Francisco', 'CA', 'AP Math', 'Lisa Rodriguez', 'sample456def', 'completed', 'Student completed AP Math prep with great results', '2024-01-12 16:30:00'),

-- Submissions for ref789ghi
(3, 'Educational Program Application', 'Steven Garcia', 'steven.garcia@email.com', '(555) 678-9012', 'Maria Garcia', '10th Grade', 'maria.garcia@student.edu', '(555) 678-9013', 'Jefferson High School', 'Central School District', 'Austin', 'TX', 'PSAT Prep', 'James Wilson', 'ref789ghi', 'enrolled', 'Student needs extra help with math section', '2024-01-13 13:15:00'),
(3, 'Educational Program Application', 'Nancy Anderson', 'nancy.anderson@email.com', '(555) 789-0123', 'Christopher Anderson', '12th Grade', 'chris.anderson@student.edu', '(555) 789-0124', 'Jefferson High School', 'Central School District', 'Austin', 'TX', 'College Essays', 'James Wilson', 'ref789ghi', 'contacted', 'Parent interested in essay writing workshop', '2024-01-17 10:45:00'),

-- More submissions for better demo data
(4, 'Educational Program Application', 'Daniel Martinez', 'daniel.martinez@email.com', '(555) 890-1234', 'Sofia Martinez', '11th Grade', 'sofia.martinez@student.edu', '(555) 890-1235', 'Kennedy High School', 'Northern School District', 'Boston', 'MA', 'SAT Prep', 'Robert Brown', 'test101jkl', 'pending', 'Scheduling initial assessment', '2024-01-19 08:30:00'),
(5, 'Educational Program Application', 'Linda Thompson', 'linda.thompson@email.com', '(555) 901-2345', 'Matthew Thompson', '12th Grade', 'matthew.thompson@student.edu', '(555) 901-2346', 'Central High School', 'Metro School District', 'Chicago', 'IL', 'ACT Prep', 'Maria Garcia', 'link202mno', 'enrolled', 'Student transferred from SAT to ACT prep', '2024-01-16 15:20:00'),
(6, 'Educational Program Application', 'Richard White', 'richard.white@email.com', '(555) 012-3456', 'Ashley White', '11th Grade', 'ashley.white@student.edu', '(555) 012-3457', 'Phoenix High School', 'Desert School District', 'Phoenix', 'AZ', 'AP Science', 'David Lee', 'code303pqr', 'contacted', 'Student excels in science, looking for advanced prep', '2024-01-20 12:10:00'),
(7, 'Educational Program Application', 'Michelle Clark', 'michelle.clark@email.com', '(555) 123-5678', 'Brandon Clark', '12th Grade', 'brandon.clark@student.edu', '(555) 123-5679', 'Seattle High School', 'Pacific School District', 'Seattle', 'WA', 'College Essays', 'Amy Taylor', 'track404stu', 'completed', 'Student submitted excellent college applications', '2024-01-18 14:25:00'),
(8, 'Educational Program Application', 'Kevin Lewis', 'kevin.lewis@email.com', '(555) 234-6789', 'Taylor Lewis', '10th Grade', 'taylor.lewis@student.edu', '(555) 234-6790', 'Mountain View High', 'Rocky Mountain District', 'Denver', 'CO', 'PSAT Prep', 'Jennifer Smith', 'share505vwx', 'pending', 'Parent requesting information about program schedule', '2024-01-21 11:40:00');

-- Insert Sample Forms
INSERT INTO forms (name, description, status, fields, sections, settings, submissions)
VALUES
('Educational Program Application', 'Main application form for all educational programs', 'active', '[ {"id": "parent_name", "type": "text", "label": "Parent/Guardian Name", "placeholder": "Enter full name", "required": true, "section": "parent"}, {"id": "parent_email", "type": "email", "label": "Email Address", "placeholder": "parent@example.com", "required": true, "section": "parent"}, {"id": "parent_phone", "type": "tel", "label": "Phone Number", "placeholder": "(555) 123-4567", "required": true, "section": "parent"}, {"id": "student_name", "type": "text", "label": "Student Name", "placeholder": "Enter student name", "required": true, "section": "student"}, {"id": "student_grade", "type": "select", "label": "Grade Level", "required": true, "section": "student", "options": ["9th Grade", "10th Grade", "11th Grade", "12th Grade"]}, {"id": "student_email", "type": "email", "label": "Student Email", "placeholder": "student@example.com", "required": false, "section": "student"}, {"id": "student_phone", "type": "tel", "label": "Student Phone", "placeholder": "(555) 123-4567", "required": false, "section": "student"}, {"id": "school_name", "type": "text", "label": "School Name", "placeholder": "Enter school name", "required": true, "section": "location"}, {"id": "district_name", "type": "text", "label": "District Name", "placeholder": "Enter district name", "required": true, "section": "location"}, {"id": "city", "type": "text", "label": "City", "placeholder": "Enter city", "required": true, "section": "location"}, {"id": "state", "type": "text", "label": "State", "placeholder": "Enter state", "required": true, "section": "location"}, {"id": "program", "type": "select", "label": "Program of Interest", "required": true, "section": "program", "options": ["SAT Prep", "ACT Prep", "PSAT Prep", "AP Math", "AP Science", "College Essays"]}, {"id": "referred_by", "type": "text", "label": "Referred By", "placeholder": "Enter referrer name", "required": false, "section": "program"} ]', '[ {"id": "parent", "name": "Parent Information", "icon": "FiUser"}, {"id": "student", "name": "Student Information", "icon": "FiGraduationCap"}, {"id": "location", "name": "Location Information", "icon": "FiMapPin"}, {"id": "program", "name": "Program Information", "icon": "FiBook"} ]', '{"allowDuplicates": false, "sendConfirmationEmail": true, "redirectUrl": "", "submitButtonText": "Submit Application"}', 13),
('SAT Prep Enrollment', 'Specific form for SAT preparation program enrollment', 'active', '[ {"id": "parent_name", "type": "text", "label": "Parent/Guardian Name", "placeholder": "Enter full name", "required": true, "section": "parent"}, {"id": "parent_email", "type": "email", "label": "Email Address", "placeholder": "parent@example.com", "required": true, "section": "parent"}, {"id": "parent_phone", "type": "tel", "label": "Phone Number", "placeholder": "(555) 123-4567", "required": true, "section": "parent"}, {"id": "student_name", "type": "text", "label": "Student Name", "placeholder": "Enter student name", "required": true, "section": "student"}, {"id": "student_grade", "type": "select", "label": "Grade Level", "required": true, "section": "student", "options": ["10th Grade", "11th Grade", "12th Grade"]}, {"id": "current_score", "type": "number", "label": "Current SAT Score (if taken)", "placeholder": "Enter score", "required": false, "section": "student"}, {"id": "target_score", "type": "number", "label": "Target SAT Score", "placeholder": "Enter target score", "required": true, "section": "student"}, {"id": "test_date", "type": "date", "label": "Planned Test Date", "required": true, "section": "program"}, {"id": "program_intensity", "type": "select", "label": "Program Intensity", "required": true, "section": "program", "options": ["Standard (2 hours/week)", "Intensive (4 hours/week)", "Crash Course (8 hours/week)"]} ]', '[ {"id": "parent", "name": "Parent Information", "icon": "FiUser"}, {"id": "student", "name": "Student Information", "icon": "FiGraduationCap"}, {"id": "program", "name": "Program Details", "icon": "FiTarget"} ]', '{"allowDuplicates": false, "sendConfirmationEmail": true, "redirectUrl": "", "submitButtonText": "Enroll in SAT Prep"}', 0),
('College Essay Workshop', 'Registration form for college essay writing workshop', 'draft', '[ {"id": "parent_name", "type": "text", "label": "Parent/Guardian Name", "placeholder": "Enter full name", "required": true, "section": "parent"}, {"id": "parent_email", "type": "email", "label": "Email Address", "placeholder": "parent@example.com", "required": true, "section": "parent"}, {"id": "student_name", "type": "text", "label": "Student Name", "placeholder": "Enter student name", "required": true, "section": "student"}, {"id": "student_grade", "type": "select", "label": "Grade Level", "required": true, "section": "student", "options": ["11th Grade", "12th Grade"]}, {"id": "college_list", "type": "textarea", "label": "College List", "placeholder": "List colleges you are applying to", "required": true, "section": "student"}, {"id": "essay_topics", "type": "textarea", "label": "Essay Topics", "placeholder": "List essay prompts you need help with", "required": true, "section": "program"}, {"id": "workshop_type", "type": "select", "label": "Workshop Type", "required": true, "section": "program", "options": ["Individual Sessions", "Group Workshop", "Intensive Weekend"]} ]', '[ {"id": "parent", "name": "Parent Information", "icon": "FiUser"}, {"id": "student", "name": "Student Information", "icon": "FiGraduationCap"}, {"id": "program", "name": "Workshop Details", "icon": "FiEdit"} ]', '{"allowDuplicates": false, "sendConfirmationEmail": true, "redirectUrl": "", "submitButtonText": "Register for Workshop"}', 0);

-- Insert Default Branding Settings
INSERT INTO branding_settings (id, siteName, tagline, primaryColor, secondaryColor, footerText, showTagline)
VALUES (1, 'EduReferral', 'Join our referral program and help students succeed while earning rewards', '#4F46E5', '#818CF8', '© 2024 EduReferral. All rights reserved.', TRUE);

--=====================================================
-- CREATE VIEWS FOR ANALYTICS
--=====================================================
-- View for referral statistics
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
  SUM(CASE WHEN fs.status='completed' THEN 1 ELSE 0 END) as completed_count,
  rl.created_at as link_created_at,
  rl.last_used_at
FROM referral_links rl
LEFT JOIN users u ON rl.user_id = u.id
LEFT JOIN form_submissions fs ON rl.affiliate_id = fs.affiliate_id
GROUP BY 
  rl.id, rl.affiliate_id, rl.user_id, u.name, u.email, 
  rl.clicks, rl.conversions, rl.created_at, rl.last_used_at;

-- View for user performance
CREATE OR REPLACE VIEW user_performance AS
SELECT 
  u.id,
  u.name,
  u.email,
  u.role,
  u.department,
  u.location,
  COUNT(DISTINCT rl.id) as total_links,
  SUM(rl.clicks) as total_clicks,
  SUM(rl.conversions) as total_conversions,
  COUNT(DISTINCT fs.id) as total_submissions,
  SUM(CASE WHEN fs.status='enrolled' THEN 1 ELSE 0 END) as enrolled_students,
  u.earnings,
  u.created_at as user_since
FROM users u
LEFT JOIN referral_links rl ON u.id = rl.user_id
LEFT JOIN form_submissions fs ON rl.affiliate_id = fs.affiliate_id
WHERE u.role = 'user'
GROUP BY 
  u.id, u.name, u.email, u.role, u.department, 
  u.location, u.earnings, u.created_at;

-- View for program popularity
CREATE OR REPLACE VIEW program_stats AS
SELECT 
  program,
  COUNT(*) as total_applications,
  SUM(CASE WHEN status='enrolled' THEN 1 ELSE 0 END) as enrolled_count,
  SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) as completed_count,
  ROUND(
    (SUM(CASE WHEN status='enrolled' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2
  ) as enrollment_rate
FROM form_submissions
WHERE program IS NOT NULL
GROUP BY program
ORDER BY total_applications DESC;

--=====================================================
-- ENABLE FOREIGN KEY CHECKS
--=====================================================
SET FOREIGN_KEY_CHECKS=1;

--=====================================================
-- FINAL DATA VERIFICATION
--=====================================================
-- Show summary of inserted data
SELECT 'Database Setup Complete!' as status;
SELECT 
  'users' as table_name,
  COUNT(*) as record_count,
  CONCAT(
    'Admin: ', SUM(CASE WHEN role='admin' THEN 1 ELSE 0 END),
    ', Manager: ', SUM(CASE WHEN role='manager' THEN 1 ELSE 0 END),
    ', Staff: ', SUM(CASE WHEN role='staff' THEN 1 ELSE 0 END),
    ', Users: ', SUM(CASE WHEN role='user' THEN 1 ELSE 0 END)
  ) as details
FROM users
UNION ALL
SELECT 
  'referral_links' as table_name,
  COUNT(*) as record_count,
  CONCAT('Total Clicks: ', SUM(clicks), ', Total Conversions: ', SUM(conversions)) as details
FROM referral_links
UNION ALL
SELECT 
  'form_submissions' as table_name,
  COUNT(*) as record_count,
  CONCAT(
    'Pending: ', SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END),
    ', Enrolled: ', SUM(CASE WHEN status='enrolled' THEN 1 ELSE 0 END),
    ', Completed: ', SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END)
  ) as details
FROM form_submissions
UNION ALL
SELECT 
  'forms' as table_name,
  COUNT(*) as record_count,
  CONCAT(
    'Active: ', SUM(CASE WHEN status='active' THEN 1 ELSE 0 END),
    ', Draft: ', SUM(CASE WHEN status='draft' THEN 1 ELSE 0 END)
  ) as details
FROM forms
UNION ALL
SELECT 
  'branding_settings' as table_name,
  COUNT(*) as record_count,
  'Configuration ready' as details
FROM branding_settings;

--=====================================================
-- USAGE INSTRUCTIONS
--=====================================================
/* USAGE INSTRUCTIONS:
1. Import this file into your MySQL database:
   mysql -u username -p u181152768_referral < mysql_database_dump.sql

2. Or run in MySQL Workbench/phpMyAdmin by copying and pasting the entire content

3. Default login credentials:
   - Admin: admin@example.com / admin123
   - Manager: manager@example.com / manager123
   - User: user@example.com / user123

4. The database includes:
   - 15 demo users (1 admin, 2 managers, 3 staff, 9 regular users)
   - 8 referral links with realistic click/conversion data
   - 13 form submissions across different programs
   - 3 form templates (2 active, 1 draft)
   - Default branding settings
   - Useful views for analytics

5. Key features:
   - Complete user management with roles and permissions
   - Referral tracking with affiliate IDs
   - Form builder system with JSON field storage
   - Analytics views for reporting

6. To reset data, simply re-run this file (it includes DROP TABLE statements)
*/