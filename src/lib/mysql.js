// Mock MySQL implementation for browser environment
// This simulates a MySQL database using localStorage

class MockMySQL {
  constructor() {
    this.initializeDatabase();
  }

  initializeDatabase() {
    // Initialize with sample data if not exists
    if (!localStorage.getItem('mysql_initialized')) {
      this.createSampleData();
      localStorage.setItem('mysql_initialized', 'true');
    }
  }

  createSampleData() {
    // Users table
    const users = [
      {
        id: 1,
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'admin123',
        role: 'admin',
        status: 'active',
        permissions: JSON.stringify(['users:read', 'users:write', 'forms:read', 'forms:write', 'analytics:read', 'analytics:write', 'settings:read', 'settings:write']),
        department: 'Administration',
        location: 'Head Office',
        student_name: null,
        student_grade: null,
        referrals_count: 0,
        conversions_count: 0,
        earnings: 0.00,
        last_login_at: '2024-01-21T17:30:00Z',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-21T17:30:00Z'
      },
      {
        id: 2,
        email: 'manager@example.com',
        name: 'Manager User',
        password: 'manager123',
        role: 'manager',
        status: 'active',
        permissions: JSON.stringify(['users:read', 'forms:read', 'forms:write', 'analytics:read']),
        department: 'Operations',
        location: 'Regional Office',
        student_name: null,
        student_grade: null,
        referrals_count: 0,
        conversions_count: 0,
        earnings: 0.00,
        last_login_at: '2024-01-21T16:15:00Z',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-21T16:15:00Z'
      },
      {
        id: 3,
        email: 'user@example.com',
        name: 'Regular User',
        password: 'user123',
        role: 'user',
        status: 'active',
        permissions: JSON.stringify(['forms:read']),
        department: 'Parent',
        location: 'Los Angeles, CA',
        student_name: 'Student Name',
        student_grade: '11th Grade',
        referrals_count: 8,
        conversions_count: 5,
        earnings: 250.00,
        last_login_at: '2024-01-20T12:00:00Z',
        created_at: '2023-06-15T10:00:00Z',
        updated_at: '2024-01-20T12:00:00Z'
      }
    ];

    // Referral Links table
    const referralLinks = [
      {
        id: 1,
        affiliate_id: 'demo123abc',
        user_id: 3,
        clicks: 25,
        conversions: 5,
        last_used_at: '2024-01-20T15:30:00Z',
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-20T15:30:00Z'
      },
      {
        id: 2,
        affiliate_id: 'sample456def',
        user_id: 3,
        clicks: 18,
        conversions: 3,
        last_used_at: '2024-01-19T11:45:00Z',
        created_at: '2024-01-12T14:30:00Z',
        updated_at: '2024-01-19T11:45:00Z'
      }
    ];

    // Form Submissions table
    const formSubmissions = [
      {
        id: 1,
        referral_id: 1,
        form_name: 'Educational Program Application',
        parent_name: 'Jennifer Smith',
        parent_email: 'jennifer.smith@email.com',
        parent_phone: '(555) 123-4567',
        student_name: 'Emma Smith',
        student_grade: '11th Grade',
        student_email: 'emma.smith@student.edu',
        student_phone: '(555) 123-4568',
        school_name: 'Lincoln High School',
        district_name: 'Westside School District',
        city: 'Los Angeles',
        state: 'CA',
        program: 'SAT Prep',
        referred_by: 'Michael Chen',
        affiliate_id: 'demo123abc',
        status: 'enrolled',
        notes: 'Student is very motivated and ready to start immediately',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-16T09:00:00Z'
      }
    ];

    // Forms table
    const forms = [
      {
        id: 1,
        name: 'Educational Program Application',
        description: 'Main application form for all educational programs',
        status: 'active',
        fields: JSON.stringify([
          {
            id: 'parent_name',
            type: 'text',
            label: 'Parent/Guardian Name',
            placeholder: 'Enter full name',
            required: true,
            section: 'parent'
          },
          {
            id: 'parent_email',
            type: 'email',
            label: 'Email Address',
            placeholder: 'parent@example.com',
            required: true,
            section: 'parent'
          }
        ]),
        sections: JSON.stringify([
          { id: 'parent', name: 'Parent Information', icon: 'FiUser' },
          { id: 'student', name: 'Student Information', icon: 'FiGraduationCap' }
        ]),
        settings: JSON.stringify({
          allowDuplicates: false,
          sendConfirmationEmail: true,
          redirectUrl: '',
          submitButtonText: 'Submit Application'
        }),
        submissions: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-21T12:00:00Z'
      }
    ];

    // Branding Settings table
    const brandingSettings = [
      {
        id: 1,
        siteName: 'EduReferral',
        tagline: 'Join our referral program and help students succeed while earning rewards',
        logoUrl: '',
        logoAlt: 'Company Logo',
        faviconUrl: '',
        primaryColor: '#4F46E5',
        secondaryColor: '#818CF8',
        footerText: '© 2024 EduReferral. All rights reserved.',
        showTagline: true,
        customFonts: false,
        fontHeading: 'system-ui',
        fontBody: 'system-ui',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];

    // Store data in localStorage
    localStorage.setItem('mysql_users', JSON.stringify(users));
    localStorage.setItem('mysql_referral_links', JSON.stringify(referralLinks));
    localStorage.setItem('mysql_form_submissions', JSON.stringify(formSubmissions));
    localStorage.setItem('mysql_forms', JSON.stringify(forms));
    localStorage.setItem('mysql_branding_settings', JSON.stringify(brandingSettings));
  }

  // Insert data into a table
  async insert(table, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const tableData = JSON.parse(localStorage.getItem(`mysql_${table}`) || '[]');
          const newId = Math.max(...tableData.map(item => item.id || 0), 0) + 1;
          const newRecord = {
            ...data,
            id: newId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          tableData.push(newRecord);
          localStorage.setItem(`mysql_${table}`, JSON.stringify(tableData));
          resolve({ insertId: newId, affectedRows: 1, data: newRecord });
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  }

  // Update data in a table
  async update(table, data, condition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const tableData = JSON.parse(localStorage.getItem(`mysql_${table}`) || '[]');
          const conditionKey = Object.keys(condition)[0];
          const conditionValue = condition[conditionKey];
          
          let updatedCount = 0;
          const updatedData = tableData.map(item => {
            if (item[conditionKey] === conditionValue) {
              updatedCount++;
              return {
                ...item,
                ...data,
                updated_at: new Date().toISOString()
              };
            }
            return item;
          });
          
          localStorage.setItem(`mysql_${table}`, JSON.stringify(updatedData));
          resolve({ affectedRows: updatedCount, changedRows: updatedCount });
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  }

  // Delete data from a table
  async remove(table, condition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const tableData = JSON.parse(localStorage.getItem(`mysql_${table}`) || '[]');
          const conditionKey = Object.keys(condition)[0];
          const conditionValue = condition[conditionKey];
          
          const filteredData = tableData.filter(item => item[conditionKey] !== conditionValue);
          localStorage.setItem(`mysql_${table}`, JSON.stringify(filteredData));
          resolve({ affectedRows: tableData.length - filteredData.length });
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  }

  // Get a single record from a table
  async getOne(table, condition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const tableData = JSON.parse(localStorage.getItem(`mysql_${table}`) || '[]');
          
          if (!condition || Object.keys(condition).length === 0) {
            resolve(tableData[0] || null);
            return;
          }
          
          const conditionKey = Object.keys(condition)[0];
          const conditionValue = condition[conditionKey];
          const record = tableData.find(item => item[conditionKey] === conditionValue);
          resolve(record || null);
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  }

  // Get multiple records from a table
  async getMany(table, condition = null, options = {}) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          let tableData = JSON.parse(localStorage.getItem(`mysql_${table}`) || '[]');
          
          // Apply condition filter
          if (condition && Object.keys(condition).length > 0) {
            const conditionKey = Object.keys(condition)[0];
            const conditionValue = condition[conditionKey];
            tableData = tableData.filter(item => item[conditionKey] === conditionValue);
          }
          
          // Apply ordering
          if (options.orderBy) {
            const direction = options.orderDirection === 'desc' ? -1 : 1;
            tableData.sort((a, b) => {
              if (a[options.orderBy] < b[options.orderBy]) return -1 * direction;
              if (a[options.orderBy] > b[options.orderBy]) return 1 * direction;
              return 0;
            });
          }
          
          // Apply limit and offset
          if (options.limit) {
            const start = options.offset || 0;
            tableData = tableData.slice(start, start + options.limit);
          }
          
          resolve(tableData);
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  }

  // Simulate MySQL query execution
  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // This is a very basic SQL parser for demo purposes
          // In a real application, you'd use a proper SQL parser
          resolve([]);
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  }
}

// Create and export the mock MySQL instance
const db = new MockMySQL();
export default db;