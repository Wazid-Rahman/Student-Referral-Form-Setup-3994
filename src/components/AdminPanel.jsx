import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AdminLayout from './AdminLayout';

const { 
  FiUsers, FiTrendingUp, FiUserCheck, FiUserX, FiDollarSign, FiAward, 
  FiEye, FiEdit, FiTrash2, FiMail, FiPhone, FiMapPin, FiCalendar,
  FiFileText, FiLayout, FiGlobe
} = FiIcons;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Mock user data - replace with real data
  const mockUsers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      role: 'parent',
      status: 'active',
      joinDate: '2024-01-15',
      referrals: 8,
      conversions: 5,
      earnings: 250,
      lastLogin: '2024-01-20',
      studentName: 'Emma Johnson',
      studentGrade: '11th Grade',
      location: 'Los Angeles, CA',
      programs: ['SAT Prep', 'AP Math']
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '(555) 234-5678',
      role: 'educator',
      status: 'active',
      joinDate: '2024-01-10',
      referrals: 15,
      conversions: 12,
      earnings: 600,
      lastLogin: '2024-01-21',
      studentName: 'David Chen',
      studentGrade: '12th Grade',
      location: 'San Francisco, CA',
      programs: ['ACT Prep', 'College Essays']
    },
    {
      id: 3,
      name: 'Lisa Rodriguez',
      email: 'lisa.rodriguez@email.com',
      phone: '(555) 345-6789',
      role: 'parent',
      status: 'inactive',
      joinDate: '2024-01-05',
      referrals: 3,
      conversions: 1,
      earnings: 50,
      lastLogin: '2024-01-18',
      studentName: 'Carlos Rodriguez',
      studentGrade: '10th Grade',
      location: 'Austin, TX',
      programs: ['PSAT Prep']
    },
    {
      id: 4,
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      phone: '(555) 456-7890',
      role: 'counselor',
      status: 'active',
      joinDate: '2024-01-12',
      referrals: 22,
      conversions: 18,
      earnings: 900,
      lastLogin: '2024-01-21',
      studentName: 'Multiple Students',
      studentGrade: 'Various',
      location: 'Boston, MA',
      programs: ['SAT Prep', 'ACT Prep', 'AP Subjects']
    }
  ];

  const mockStats = {
    totalUsers: 156,
    activeUsers: 142,
    totalReferrals: 1247,
    totalEarnings: 15680,
    conversionRate: 68,
    avgReferralsPerUser: 8.2
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const userGrowthOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [120, 132, 142, 150, 156],
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#4F46E5'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(79, 70, 229, 0.3)'
          }, {
            offset: 1,
            color: 'rgba(79, 70, 229, 0.1)'
          }]
        }
      }
    }]
  };

  const roleDistributionOptions = {
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: ['50%', '70%'],
      data: [
        { value: 85, name: 'Parents', itemStyle: { color: '#4F46E5' } },
        { value: 45, name: 'Educators', itemStyle: { color: '#818CF8' } },
        { value: 26, name: 'Counselors', itemStyle: { color: '#A5B4FC' } }
      ]
    }]
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'parent':
        return FiUsers;
      case 'educator':
        return FiAward;
      case 'counselor':
        return FiUserCheck;
      default:
        return FiUsers;
    }
  };

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of your platform">
      <div className="max-w-7xl mx-auto">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/forms"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  Manage Forms
                </h3>
                <p className="text-gray-600 text-sm mt-1">Create and edit referral forms</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg group-hover:bg-indigo-200 transition-colors">
                <SafeIcon icon={FiFileText} className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </Link>

          <Link
            to="/admin/staff"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  Staff Management
                </h3>
                <p className="text-gray-600 text-sm mt-1">Add and manage team members</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                <SafeIcon icon={FiUsers} className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Link>

          <Link
            to="/admin/landing-editor"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  Edit Landing Page
                </h3>
                <p className="text-gray-600 text-sm mt-1">Customize your landing page</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                <SafeIcon icon={FiLayout} className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          {[
            { title: 'Total Users', value: mockStats.totalUsers, icon: FiUsers, color: 'bg-blue-500' },
            { title: 'Active Users', value: mockStats.activeUsers, icon: FiUserCheck, color: 'bg-green-500' },
            { title: 'Total Referrals', value: mockStats.totalReferrals, icon: FiTrendingUp, color: 'bg-purple-500' },
            { title: 'Total Earnings', value: `$${mockStats.totalEarnings}`, icon: FiDollarSign, color: 'bg-indigo-500' },
            { title: 'Conversion Rate', value: `${mockStats.conversionRate}%`, icon: FiAward, color: 'bg-orange-500' },
            { title: 'Avg Referrals', value: mockStats.avgReferralsPerUser, icon: FiTrendingUp, color: 'bg-pink-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <SafeIcon icon={stat.icon} className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
            <ReactECharts option={userGrowthOptions} style={{ height: '300px' }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Roles</h3>
            <ReactECharts option={roleDistributionOptions} style={{ height: '300px' }} />
          </motion.div>
        </div>

        {/* Recent Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                  <SafeIcon icon={FiIcons.FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.slice(0, 5).map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <SafeIcon icon={getRoleIcon(user.role)} className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.studentName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>Referrals: {user.referrals}</div>
                      <div>Conversions: {user.conversions}</div>
                      <div>Earnings: ${user.earnings}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(user.joinDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <SafeIcon icon={FiEye} className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <SafeIcon icon={FiEdit} className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/admin/users"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              View all users →
            </Link>
          </div>
        </motion.div>

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={FiUsers} className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <SafeIcon icon={FiUsers} className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-medium">{selectedUser.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{selectedUser.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{selectedUser.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <SafeIcon icon={FiMapPin} className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium">{selectedUser.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-600">Total Referrals</p>
                        <p className="text-2xl font-bold text-blue-900">{selectedUser.referrals}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-600">Conversions</p>
                        <p className="text-2xl font-bold text-green-900">{selectedUser.conversions}</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm text-purple-600">Total Earnings</p>
                        <p className="text-2xl font-bold text-purple-900">${selectedUser.earnings}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Programs</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.programs.map((program, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;