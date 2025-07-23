import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Header from './Header';
import db from '../lib/mysql';

const { FiUsers, FiTrendingUp, FiDollarSign, FiAward, FiShare2, FiEye, FiPlus, FiCalendar, FiTarget, FiList } = FiIcons;

const Dashboard = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('month');
  const [referrals, setReferrals] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch referrals and submissions data
    const fetchData = async () => {
      try {
        // Get referrals
        const referralData = await db.getMany('referral_links', null, {
          orderBy: 'created_at',
          orderDirection: 'desc'
        });
        
        // Get submissions
        const submissionData = await db.getMany('form_submissions', null, {
          orderBy: 'created_at',
          orderDirection: 'desc',
          limit: 5
        });
        
        setReferrals(referralData || []);
        setSubmissions(submissionData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays as fallback
        setReferrals([]);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate stats based on the fetched data
  const stats = {
    totalReferrals: referrals.length,
    activeReferrals: referrals.filter(r => r.conversions > 0).length,
    totalEarnings: referrals.reduce((acc, r) => acc + (r.conversions * 50), 0), // Assuming $50 per conversion
    conversionRate: referrals.length > 0 ? Math.round((referrals.filter(r => r.conversions > 0).length / referrals.length) * 100) : 0
  };

  // Mock data - replace with real data from your backend
  const mockData = {
    recentActivity: submissions.map(submission => ({
      id: submission.id,
      type: 'referral',
      description: `New referral: ${submission.student_name}`,
      date: submission.created_at,
      status: 'pending'
    }))
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Welcome Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || user?.email?.split('@')[0]}!
              </h1>
              <p className="text-gray-600 mt-2">
                {isAdmin ? 'Manage your platform and monitor performance' : 'Track your referrals and earnings'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
              <Link
                to="/referral/demo"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4" />
                New Referral
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Referrals</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalReferrals}</h3>
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
                <p className="text-sm text-gray-600 mb-1">Active Referrals</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.activeReferrals}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-green-600" />
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
                <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                <h3 className="text-2xl font-bold text-gray-900">${stats.totalEarnings}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-purple-600" />
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
                <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <SafeIcon icon={FiTarget} className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Link to="/referrals" className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
                  View All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-6 text-center">
                  <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading activity...</p>
                </div>
              ) : mockData.recentActivity.length > 0 ? (
                mockData.recentActivity.map((activity) => (
                  <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'referral' ? 'bg-blue-100' : 'bg-green-100'}`}>
                          <SafeIcon icon={activity.type === 'referral' ? FiUsers : FiAward} className={`w-5 h-5 ${activity.type === 'referral' ? 'text-blue-600' : 'text-green-600'}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activity.status === 'completed' ? 'bg-green-100 text-green-800' : activity.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {activity.status}
                        </span>
                        {activity.amount && (
                          <p className="text-sm font-medium text-green-600 mt-1">
                            +${activity.amount}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No recent activity found.</p>
                  <p className="text-gray-500 text-sm mt-1">Start by creating a new referral!</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <Link
                to="/referral/demo"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiPlus} className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Create New Referral</h4>
                  <p className="text-sm text-gray-500">Refer a new student to earn rewards</p>
                </div>
              </Link>

              <Link
                to="/analytics"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">View Analytics</h4>
                  <p className="text-sm text-gray-500">Track your referral performance</p>
                </div>
              </Link>

              <Link
                to="/referrals"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiList} className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Referral Tracking</h4>
                  <p className="text-sm text-gray-500">View all your referrals and submissions</p>
                </div>
              </Link>

              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiShare2} className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Share Referral Link</h4>
                  <p className="text-sm text-gray-500">Get your unique referral link</p>
                </div>
              </button>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiEye} className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Admin Panel</h4>
                    <p className="text-sm text-gray-500">Manage users and platform settings</p>
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;