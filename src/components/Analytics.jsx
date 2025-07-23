import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiTrendingUp, 
  FiUsers, 
  FiTarget, 
  FiBarChart2,
  FiPieChart,
  FiActivity
} = FiIcons;

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('week');
  
  // Mock data - replace with real data in production
  const mockData = {
    referrals: 156,
    conversionRate: 68,
    activeReferrers: 45,
    totalEarnings: 3240
  };

  const timeframeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const referralTrendOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [12, 15, 8, 23, 18, 14, 9],
      type: 'bar',
      itemStyle: {
        color: '#4F46E5'
      }
    }]
  };

  const conversionRateOptions = {
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: ['60%', '80%'],
      data: [
        { value: 68, name: 'Converted', itemStyle: { color: '#4F46E5' } },
        { value: 32, name: 'Pending', itemStyle: { color: '#E5E7EB' } }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  const programDistributionOptions = {
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: '70%',
      data: [
        { value: 40, name: 'SAT Prep', itemStyle: { color: '#4F46E5' } },
        { value: 25, name: 'ACT Prep', itemStyle: { color: '#818CF8' } },
        { value: 20, name: 'AP Subjects', itemStyle: { color: '#A5B4FC' } },
        { value: 15, name: 'College Essays', itemStyle: { color: '#C7D2FE' } }
      ]
    }]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Track your referral performance and earnings
            </p>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
            >
              {timeframeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Referrals',
              value: mockData.referrals,
              icon: FiUsers,
              color: 'bg-blue-500'
            },
            {
              title: 'Conversion Rate',
              value: `${mockData.conversionRate}%`,
              icon: FiTarget,
              color: 'bg-green-500'
            },
            {
              title: 'Active Referrers',
              value: mockData.activeReferrers,
              icon: FiActivity,
              color: 'bg-purple-500'
            },
            {
              title: 'Total Earnings',
              value: `$${mockData.totalEarnings}`,
              icon: FiTrendingUp,
              color: 'bg-indigo-500'
            }
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
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </h3>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Referral Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <SafeIcon icon={FiBarChart2} className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Referral Trend
              </h3>
            </div>
            <ReactECharts option={referralTrendOptions} style={{ height: '300px' }} />
          </motion.div>

          {/* Conversion Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <SafeIcon icon={FiPieChart} className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Conversion Rate
              </h3>
            </div>
            <ReactECharts option={conversionRateOptions} style={{ height: '300px' }} />
          </motion.div>
        </div>

        {/* Program Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <SafeIcon icon={FiPieChart} className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Program Distribution
            </h3>
          </div>
          <ReactECharts option={programDistributionOptions} style={{ height: '400px' }} />
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;