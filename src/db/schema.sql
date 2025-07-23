-- MySQL Schema for Referral System

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  role ENUM('user', 'staff', 'manager', 'admin') DEFAULT 'user',
  status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
  permissions JSON,
  department VARCHAR(255),
  location VARCHAR(255),
  student_name VARCHAR(255),
  student_grade VARCHAR(50),
  referrals_count INT DEFAULT 0,
  conversions_count INT DEFAULT 0,
  earnings DECIMAL(10, 2) DEFAULT 0.00,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Referral Links Table
CREATE TABLE IF NOT EXISTS referral_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  affiliate_id VARCHAR(50) NOT NULL UNIQUE,
  user_id INT NULL,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  last_used_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create Form Submissions Table
CREATE TABLE IF NOT EXISTS form_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  referral_id INT NULL,
  parent_name VARCHAR(255) NOT NULL,
  parent_email VARCHAR(255) NOT NULL,
  parent_phone VARCHAR(50),
  student_name VARCHAR(255) NOT NULL,
  student_grade VARCHAR(50),
  student_email VARCHAR(255),
  student_phone VARCHAR(50),
  school_name VARCHAR(255),
  district_name VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(50),
  program VARCHAR(100),
  referred_by VARCHAR(255),
  affiliate_id VARCHAR(50),
  status ENUM('pending', 'contacted', 'enrolled', 'completed', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (referral_id) REFERENCES referral_links(id) ON DELETE SET NULL
);

-- Create Forms Table
CREATE TABLE IF NOT EXISTS forms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('draft', 'active', 'archived') DEFAULT 'draft',
  fields JSON,
  sections JSON,
  settings JSON,
  submissions INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Branding Settings Table
CREATE TABLE IF NOT EXISTS branding_settings (
  id INT PRIMARY KEY DEFAULT 1,
  siteName VARCHAR(255) DEFAULT 'EduReferral',
  tagline TEXT DEFAULT 'Join our referral program and help students succeed while earning rewards',
  logoUrl TEXT,
  logoAlt VARCHAR(255) DEFAULT 'Company Logo',
  faviconUrl TEXT,
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

-- Insert Default Admin User
INSERT INTO users (email, name, role, status, permissions)
VALUES ('admin@example.com', 'Admin User', 'admin', 'active', '["users:read","users:write","forms:read","forms:write","analytics:read","settings:read","settings:write"]')
ON DUPLICATE KEY UPDATE email = email;

-- Insert Default Regular User
INSERT INTO users (email, name, role, status, permissions)
VALUES ('user@example.com', 'Regular User', 'user', 'active', '["forms:read"]')
ON DUPLICATE KEY UPDATE email = email;

-- Insert Default Manager User
INSERT INTO users (email, name, role, status, permissions)
VALUES ('manager@example.com', 'Manager User', 'manager', 'active', '["users:read","forms:read","forms:write","analytics:read"]')
ON DUPLICATE KEY UPDATE email = email;

-- Insert Default Branding Settings
INSERT INTO branding_settings (id, siteName, tagline, primaryColor, secondaryColor)
VALUES (1, 'EduReferral', 'Join our referral program and help students succeed while earning rewards', '#4F46E5', '#818CF8')
ON DUPLICATE KEY UPDATE siteName = siteName;