import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AdminLayout from './AdminLayout';
import db from '../lib/mysql';

const { FiPlus, FiEdit, FiTrash2, FiMail, FiPhone, FiCalendar, FiUser, FiShield, FiUsers, FiSearch, FiFilter, FiDownload, FiCheck, FiX, FiEye, FiEyeOff } = FiIcons;

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Mock staff data
  const mockStaff = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '(555) 123-4567',
      role: 'admin',
      status: 'active',
      department: 'Administration',
      hire_date: '2023-06-15',
      last_login: '2024-01-20T10:30:00Z',
      permissions: ['users:read', 'users:write', 'forms:read', 'forms:write', 'analytics:read']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '(555) 234-5678',
      role: 'manager',
      status: 'active',
      department: 'Operations',
      hire_date: '2023-08-20',
      last_login: '2024-01-19T14:45:00Z',
      permissions: ['users:read', 'forms:read', 'forms:write', 'analytics:read']
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      phone: '(555) 345-6789',
      role: 'staff',
      status: 'active',
      department: 'Support',
      hire_date: '2023-10-10',
      last_login: '2024-01-18T09:15:00Z',
      permissions: ['users:read', 'forms:read']
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      phone: '(555) 456-7890',
      role: 'staff',
      status: 'inactive',
      department: 'Marketing',
      hire_date: '2023-12-01',
      last_login: '2024-01-15T16:20:00Z',
      permissions: ['forms:read', 'analytics:read']
    }
  ];

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    department: '',
    permissions: []
  });

  const availableRoles = [
    { value: 'admin', label: 'Administrator', color: 'bg-red-100 text-red-800' },
    { value: 'manager', label: 'Manager', color: 'bg-blue-100 text-blue-800' },
    { value: 'staff', label: 'Staff', color: 'bg-green-100 text-green-800' }
  ];

  const availablePermissions = [
    { id: 'users:read', label: 'View Users' },
    { id: 'users:write', label: 'Manage Users' },
    { id: 'forms:read', label: 'View Forms' },
    { id: 'forms:write', label: 'Manage Forms' },
    { id: 'analytics:read', label: 'View Analytics' },
    { id: 'analytics:write', label: 'Manage Analytics' },
    { id: 'settings:read', label: 'View Settings' },
    { id: 'settings:write', label: 'Manage Settings' }
  ];

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      // Try to fetch from database, fallback to mock data
      try {
        const data = await db.getMany('users', { role: 'admin' });
        const managerData = await db.getMany('users', { role: 'manager' });
        const staffData = await db.getMany('users', { role: 'staff' });
        
        const allStaff = [...(data || []), ...(managerData || []), ...(staffData || [])];
        
        if (allStaff.length > 0) {
          setStaff(allStaff.map(member => ({
            ...member,
            permissions: JSON.parse(member.permissions || '[]')
          })));
        } else {
          setStaff(mockStaff);
        }
      } catch (error) {
        console.log('Using mock staff data');
        setStaff(mockStaff);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      setStaff(mockStaff);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const staffMember = {
        ...newStaff,
        id: Date.now(),
        status: 'active',
        hire_date: new Date().toISOString().split('T')[0],
        last_login: null,
        permissions: JSON.stringify(newStaff.permissions)
      };

      // Try to insert into database
      try {
        await db.insert('users', staffMember);
      } catch (error) {
        console.log('Database insert failed, using local state');
      }

      setStaff(prev => [{ ...staffMember, permissions: newStaff.permissions }, ...prev]);
      setNewStaff({
        name: '',
        email: '',
        phone: '',
        role: 'staff',
        department: '',
        permissions: []
      });
      setShowAddModal(false);
      alert('Staff member added successfully!');
    } catch (error) {
      console.error('Error adding staff:', error);
      alert('Error adding staff member. Please try again.');
    }
  };

  const toggleStaffStatus = async (staffId) => {
    try {
      const newStatus = staff.find(member => member.id === staffId).status === 'active' ? 'inactive' : 'active';
      
      // Try to update database
      try {
        await db.update('users', { status: newStatus }, { id: staffId });
      } catch (error) {
        console.log('Database update failed, using local state');
      }

      setStaff(prev => prev.map(member => 
        member.id === staffId ? { ...member, status: newStatus } : member
      ));
    } catch (error) {
      console.error('Error updating staff status:', error);
    }
  };

  const deleteStaff = async (staffId) => {
    if (!confirm('Are you sure you want to delete this staff member?')) {
      return;
    }
    
    try {
      // Try to delete from database
      try {
        await db.remove('users', { id: staffId });
      } catch (error) {
        console.log('Database delete failed, using local state');
      }

      setStaff(prev => prev.filter(member => member.id !== staffId));
      alert('Staff member deleted successfully!');
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert('Error deleting staff member. Please try again.');
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (member.department && member.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    const roleData = availableRoles.find(r => r.value === role);
    return roleData ? roleData.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <AdminLayout title="Staff Management" subtitle="Manage staff members and permissions">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Staff Management" subtitle="Manage staff members and permissions">
      <div className="max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Staff</p>
                <h3 className="text-2xl font-bold text-gray-900">{staff.length}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {staff.filter(s => s.status === 'active').length}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <SafeIcon icon={FiCheck} className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Admins</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {staff.filter(s => s.role === 'admin').length}
                </h3>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <SafeIcon icon={FiShield} className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Departments</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {new Set(staff.map(s => s.department).filter(Boolean)).size}
                </h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <SafeIcon icon={FiUser} className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Staff Members</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Roles</option>
                {availableRoles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4" />
                Add Staff
              </button>
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <SafeIcon icon={FiUser} className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                          {availableRoles.find(r => r.value === member.role)?.label}
                        </span>
                        <div className="text-sm text-gray-500">{member.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <SafeIcon icon={FiMail} className="w-4 h-4 mr-2 text-gray-400" />
                          {member.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <SafeIcon icon={FiPhone} className="w-4 h-4 mr-2 text-gray-400" />
                          {member.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.last_login ? format(new Date(member.last_login), 'MMM dd, yyyy') : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedStaff(member)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View details"
                        >
                          <SafeIcon icon={FiEye} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleStaffStatus(member.id)}
                          className={`${member.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          title={member.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          <SafeIcon icon={member.status === 'active' ? FiEyeOff : FiEye} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteStaff(member.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete staff member"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Staff Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Add New Staff Member</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={FiX} className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleAddStaff} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newStaff.name}
                      onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={newStaff.email}
                      onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newStaff.phone}
                      onChange={(e) => setNewStaff(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      required
                      value={newStaff.department}
                      onChange={(e) => setNewStaff(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={newStaff.role}
                      onChange={(e) => setNewStaff(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {availableRoles.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Permissions
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {availablePermissions.map(permission => (
                        <div key={permission.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={permission.id}
                            checked={newStaff.permissions.includes(permission.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewStaff(prev => ({ ...prev, permissions: [...prev.permissions, permission.id] }));
                              } else {
                                setNewStaff(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permission.id) }));
                              }
                            }}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor={permission.id} className="ml-2 block text-sm text-gray-900">
                            {permission.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Add Staff Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Staff Detail Modal */}
        {selectedStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Staff Details</h2>
                  <button
                    onClick={() => setSelectedStaff(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={FiX} className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiUser} className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedStaff.name}</h3>
                      <p className="text-gray-600">{selectedStaff.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedStaff.role)}`}>
                          {availableRoles.find(r => r.value === selectedStaff.role)?.label}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedStaff.status)}`}>
                          {selectedStaff.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
                          {selectedStaff.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <SafeIcon icon={FiPhone} className="w-4 h-4 mr-2" />
                          {selectedStaff.phone}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Employment Details</h4>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Department:</span> {selectedStaff.department}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Hire Date:</span> {selectedStaff.hire_date ? format(new Date(selectedStaff.hire_date), 'MMM dd, yyyy') : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Last Login:</span> {selectedStaff.last_login ? format(new Date(selectedStaff.last_login), 'MMM dd, yyyy') : 'Never'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Permissions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {availablePermissions.map(permission => (
                        <div key={permission.id} className="flex items-center">
                          <SafeIcon 
                            icon={selectedStaff.permissions && selectedStaff.permissions.includes(permission.id) ? FiCheck : FiX} 
                            className={`w-4 h-4 mr-2 ${selectedStaff.permissions && selectedStaff.permissions.includes(permission.id) ? 'text-green-600' : 'text-red-600'}`} 
                          />
                          <span className={`text-sm ${selectedStaff.permissions && selectedStaff.permissions.includes(permission.id) ? 'text-gray-900' : 'text-gray-500'}`}>
                            {permission.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default StaffManagement;