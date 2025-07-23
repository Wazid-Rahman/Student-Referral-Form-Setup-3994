# Referral Management System

A comprehensive referral management system built with React and MySQL for educational institutions and programs.

## Features

- User authentication and role-based access control
- Referral link generation and tracking
- Form submissions management
- Analytics dashboard
- Staff and user management
- Branding customization

## Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion
- **Database**: MySQL (with localStorage fallback for demo)
- **Charts**: ECharts
- **Icons**: React Icons
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v16+)
- MySQL (v8+) - Optional for production

### Quick Setup (Demo Mode)

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Run the development server
   ```bash
   npm run dev
   ```

The application will run in demo mode using localStorage to simulate a MySQL database.

### Production Setup with MySQL

1. Create a MySQL database
   ```sql
   CREATE DATABASE referral_db;
   ```

2. Import the provided database dump
   ```bash
   mysql -u username -p referral_db < mysql_database_dump.sql
   ```

3. Update the MySQL configuration in `src/lib/mysql.js` with your database credentials

## Demo Users

- **Admin**: admin@example.com / admin123
- **Manager**: manager@example.com / manager123
- **User**: user@example.com / user123

## Database Schema

The application uses the following tables:

- `users` - Stores user information and permissions
- `referral_links` - Tracks referral links and their performance
- `form_submissions` - Stores form submission data
- `forms` - Stores form definitions
- `branding_settings` - Stores site branding configurations

## Demo Data

The system comes pre-loaded with:

- 15 demo users across different roles
- 8 referral links with realistic performance data
- 13 form submissions across various programs
- 3 form templates (active and draft)
- Complete branding configuration

## Key Features

### User Management
- Role-based access control (Admin, Manager, Staff, User)
- Permission system for granular access control
- User profile management with student information

### Referral System
- Unique affiliate link generation
- Click and conversion tracking
- Performance analytics and reporting

### Form Builder
- Dynamic form creation with JSON field storage
- Multiple field types (text, email, select, etc.)
- Section-based organization
- Custom validation and settings

### Analytics
- User performance tracking
- Referral statistics and trends
- Program popularity analysis
- Revenue and conversion metrics

### Branding
- Customizable site name and tagline
- Logo and favicon upload
- Color scheme customization
- Typography options

## File Structure

```
src/
├── components/          # React components
├── context/            # React context providers
├── lib/               # Database and utility functions
├── common/            # Shared components
└── config/            # Configuration files
```

## Database Import

Use the provided `mysql_database_dump.sql` file to set up your MySQL database with sample data:

```bash
mysql -u your_username -p your_database < mysql_database_dump.sql
```

This will create all necessary tables and populate them with realistic demo data.

## License

This project is licensed under the MIT License.