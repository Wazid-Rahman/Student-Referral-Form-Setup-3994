import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AdminLayout from './AdminLayout';
import db from '../lib/mysql';

const { FiShield, FiUsers, FiEdit, FiTrash2, FiPlus, FiCheck, FiX, FiEye, FiSearch, FiFilter, FiSettings, FiLock, FiUnlock, FiUser, FiUserCheck } = FiIcons;

const PermissionsManagement = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);

  // Mock data for permissions system
  const mockUsers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'admin',
      status: 'active',
      permissions: ['users:read', 'users:write', 'forms:read', 'forms:write', 'analytics:read', 'settings:read', 'settings:write'],
      last_login: '2024-01-20T10:30:00Z',
      created_at: '2023-06-15T10:00:00Z'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'manager',
      status: 'active',
      permissions: ['users:read', 'forms:read', 'forms:write', 'analytics:read'],
      last_login: '2024-01-19T14:45:00Z',
      created_at: '2023-08-20T09:00:00Z'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      role: 'staff',
      status: 'active',
      permissions: ['users:read', 'forms:read'],
      last_login: '2024-01-18T09:15:00Z',
      created_at: '2023-10-10T11:00:00Z'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      role: 'user',
      status: 'inactive',
      permissions: ['forms:read'],
      last_login: '2024-01-15T16:20:00Z',
      created_at: '2023-12-01T14:00:00Z'
    }
  ];

  const mockRoles = [
    {
      id: 1,
      name: 'admin',
      display_name: 'Administrator',
      description: 'Full system access with all permissions',
      permissions: ['users:read', 'users:write', 'forms:read', 'forms:write', 'analytics:read', 'analytics:write', 'settings:read', 'settings:write'],
      user_count: 1,
      created_at: '2023-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'manager',
      display_name: 'Manager',
      description: 'Management level access with most permissions',
      permissions: ['users:read', 'forms:read', 'forms:write', 'analytics:read'],
      user_count: 1,
      created_at: '2023-01-01T00:00:00Z'
    },
    {
      id: 3,
      name: 'staff',
      display_name: 'Staff Member',
      description: 'Standard staff access with limited permissions',
      permissions: ['users:read', 'forms:read'],
      user_count: 1,
      created_at: '2023-01-01T00:00:00Z'
    },
    {
      id: 4,
      name: 'user',
      display_name: 'Regular User',
      description: 'Basic user access with minimal permissions',
      permissions: ['forms:read'],
      user_count: 1,
      created_at: '2023-01-01T00:00:00Z'
    }
  ];

  const availablePermissions = [
    { id: 'users:read', name: 'View Users', description: 'Can view user information and lists', category: 'User Management' },
    { id: 'users:write', name: 'Manage Users', description: 'Can create, edit, and delete users', category: 'User Management' },
    { id: 'forms:read', name: 'View Forms', description: 'Can view forms and submissions', category: 'Form Management' },
    { id: 'forms:write', name: 'Manage Forms', description: 'Can create, edit, and delete forms', category: 'Form Management' },
    { id: 'analytics:read', name: 'View Analytics', description: 'Can view analytics and reports', category: 'Analytics' },
    { id: 'analytics:write', name: 'Manage Analytics', description: 'Can configure analytics settings', category: 'Analytics' },
    { id: 'settings:read', name: 'View Settings', description: 'Can view system settings', category: 'System Settings' },
    { id: 'settings:write', name: 'Manage Settings', description: 'Can modify system settings and configuration', category: 'System Settings' }
  ];

  const [newRole, setNewRole] = useState({
    name: '',
    display_name: '',
    description: '',
    permissions: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Try to fetch from database, fallback to mock data
      try {
        const dbUsers = await db.getMany('users');
        if (dbUsers && dbUsers.length > 0) {
          setUsers(dbUsers.map(user => ({
            ...user,
            permissions: JSON.parse(user.permissions || '[]')
          })));
        } else {
          setUsers(mockUsers);
        }
      } catch (error) {
        console.log('Using mock users data');
        setUsers(mockUsers);
      }
      
      setRoles(mockRoles);
      setPermissions(availablePermissions);
    } catch (error) {
      console.error('Error fetching permissions data:', error);
      // Use mock data as fallback
      setUsers(mockUsers);
      setRoles(mockRoles);
      setPermissions(availablePermissions);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserPermissions = async (userId, newPermissions) => {
    try {
      // Update in database
      await db.update('users', 
        { permissions: JSON.stringify(newPermissions) }, 
        { id: userId }
      );
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, permissions: newPermissions } : user
      ));
      
      console.log('Updating user permissions:', { userId, newPermissions });
    } catch (error) {
      console.error('Error updating user permissions:', error);
      // Update local state even if database update fails
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, permissions: newPermissions } : user
      ));
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      // Get role permissions
      const role = roles.find(r => r.name === newRole);
      const rolePermissions = role ? role.permissions : [];
      
      // Update in database
      await db.update('users', 
        { 
          role: newRole,
          permissions: JSON.stringify(rolePermissions)
        }, 
        { id: userId }
      );
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole, permissions: rolePermissions } : user
      ));
      
      console.log('Updating user role:', { userId, newRole, rolePermissions });
    } catch (error) {
      console.error('Error updating user role:', error);
      // Update local state even if database update fails
      const role = roles.find(r => r.name === newRole);
      const rolePermissions = role ? role.permissions : [];
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole, permissions: rolePermissions } : user
      ));
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      const roleData = {
        ...newRole,
        id: Date.now(),
        user_count: 0,
        created_at: new Date().toISOString()
      };
      
      setRoles(prev => [...prev, roleData]);
      setNewRole({
        name: '',
        display_name: '',
        description: '',
        permissions: []
      });
      setShowCreateRoleModal(false);
      console.log('Creating new role:', roleData);
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    
    try {
      setRoles(prev => prev.filter(role => role.id !== roleId));
      console.log('Deleting role:', roleId);
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPermissionsByCategory = () => {
    const categories = {};
    availablePermissions.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <AdminLayout title="Permissions Management" subtitle="Manage user roles and permissions">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Permissions Management" subtitle="Manage user roles and permissions">
      <div className="max-w-7xl mx-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-900">{users.length}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Users</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'active').length}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <SafeIcon icon={FiUserCheck} className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Roles</p>
                <h3 className="text-2xl font-bold text-gray-900">{roles.length}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <SafeIcon icon={FiShield} className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Permissions</p>
                <h3 className="text-2xl font-bold text-gray-900">{availablePermissions.length}</h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <SafeIcon icon={FiLock} className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'users', label: 'User Permissions', icon: FiUsers },
                { id: 'roles', label: 'Role Management', icon: FiShield },
                { id: 'permissions', label: 'Permission Overview', icon: FiLock }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900">User Permissions</h3>
                <div className="relative">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Permissions
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
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <SafeIcon icon={FiUser} className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {user.permissions.slice(0, 3).map((permission) => (
                              <span
                                key={permission}
                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {permission}
                              </span>
                            ))}
                            {user.permissions.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                +{user.permissions.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.last_login ? format(new Date(user.last_login), 'MMM dd, yyyy') : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <SafeIcon icon={FiEdit} className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'roles' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Role Management</h3>
                <button
                  onClick={() => setShowCreateRoleModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4" />
                  Create Role
                </button>
              </div>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{role.display_name}</h4>
                      <p className="text-sm text-gray-500">{role.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <SafeIcon icon={FiEdit} className="w-4 h-4" />
                      </button>
                      {role.user_count === 0 && (
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Users with this role:</span>
                      <span className="font-medium text-gray-900">{role.user_count}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 4).map((permission) => (
                          <span
                            key={permission}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {permission}
                          </span>
                        ))}
                        {role.permissions.length > 4 && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            +{role.permissions.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'permissions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Permission Overview</h3>
              <p className="text-sm text-gray-600 mt-1">
                All available permissions in the system organized by category
              </p>
            </div>
            <div className="p-6">
              {Object.entries(getPermissionsByCategory()).map(([category, perms]) => (
                <div key={category} className="mb-8 last:mb-0">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {perms.map((permission) => (
                      <div
                        key={permission.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">{permission.name}</h5>
                            <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                              {permission.id}
                            </span>
                          </div>
                          <SafeIcon icon={FiLock} className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Edit User Permissions</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={FiX} className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiUser} className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                      <p className="text-gray-600">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={selectedUser.role}
                      onChange={(e) => handleUpdateUserRole(selectedUser.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {roles.map(role => (
                        <option key={role.name} value={role.name}>
                          {role.display_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Individual Permissions
                    </label>
                    <div className="space-y-4">
                      {Object.entries(getPermissionsByCategory()).map(([category, perms]) => (
                        <div key={category}>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">{category}</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {perms.map((permission) => (
                              <div key={permission.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={permission.id}
                                  checked={selectedUser.permissions.includes(permission.id)}
                                  onChange={(e) => {
                                    const newPermissions = e.target.checked
                                      ? [...selectedUser.permissions, permission.id]
                                      : selectedUser.permissions.filter(p => p !== permission.id);
                                    handleUpdateUserPermissions(selectedUser.id, newPermissions);
                                    setSelectedUser(prev => ({ ...prev, permissions: newPermissions }));
                                  }}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor={permission.id} className="ml-2 block text-sm text-gray-900">
                                  {permission.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Create Role Modal */}
        {showCreateRoleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Create New Role</h2>
                  <button
                    onClick={() => setShowCreateRoleModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={FiX} className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleCreateRole} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newRole.name}
                      onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., editor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newRole.display_name}
                      onChange={(e) => setNewRole(prev => ({ ...prev, display_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Content Editor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      value={newRole.description}
                      onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe what this role can do..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Permissions
                    </label>
                    <div className="space-y-4">
                      {Object.entries(getPermissionsByCategory()).map(([category, perms]) => (
                        <div key={category}>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">{category}</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {perms.map((permission) => (
                              <div key={permission.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`new-${permission.id}`}
                                  checked={newRole.permissions.includes(permission.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setNewRole(prev => ({ ...prev, permissions: [...prev.permissions, permission.id] }));
                                    } else {
                                      setNewRole(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permission.id) }));
                                    }
                                  }}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`new-${permission.id}`} className="ml-2 block text-sm text-gray-900">
                                  {permission.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateRoleModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Create Role
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PermissionsManagement;