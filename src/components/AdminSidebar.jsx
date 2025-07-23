import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useBranding } from './BrandingProvider';
import { useAuth } from '../context/AuthContext';

const { FiUsers, FiSettings, FiLayout, FiFileText, FiUserPlus, FiBarChart3, FiDatabase, FiShield, FiX, FiImage, FiTrendingUp } = FiIcons;

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { branding } = useBranding();
  const { hasPermission, isAdmin } = useAuth();

  const menuItems = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', path: '/admin', icon: FiBarChart3, permission: null },
        { name: 'Analytics', path: '/admin/analytics', icon: FiTrendingUp, permission: 'analytics:read' }
      ]
    },
    {
      title: 'User Management',
      items: [
        { name: 'All Users', path: '/admin/users', icon: FiUsers, permission: 'users:read' },
        { name: 'Staff Members', path: '/admin/staff', icon: FiUserPlus, permission: 'users:write' },
        { name: 'Permissions', path: '/admin/permissions', icon: FiShield, permission: 'users:write' }
      ]
    },
    {
      title: 'Forms & Content',
      items: [
        { name: 'Referral Forms', path: '/admin/forms', icon: FiFileText, permission: 'forms:read' },
        { name: 'Create Form', path: '/admin/forms/create', icon: FiIcons.FiPlus, permission: 'forms:write' },
        { name: 'Landing Page', path: '/admin/landing-editor', icon: FiLayout, permission: 'settings:write' }
      ]
    },
    {
      title: 'Data Management',
      items: [
        { name: 'Form Submissions', path: '/admin/submissions', icon: FiDatabase, permission: 'forms:read' },
        { name: 'Referral Tracking', path: '/admin/referrals', icon: FiIcons.FiList, permission: 'analytics:read' }
      ]
    },
    {
      title: 'Settings',
      items: [
        { name: 'Branding', path: '/admin/branding', icon: FiImage, permission: 'settings:write' }
      ]
    }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname === path;
  };

  const hasAccess = (permission) => {
    if (!permission) return true; // No permission required
    return isAdmin() || hasPermission(permission);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:shadow-none border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {branding.logoUrl ? (
                  <img
                    src={branding.logoUrl}
                    alt={branding.logoAlt || 'Logo'}
                    className="h-10 w-auto"
                  />
                ) : (
                  <div
                    className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    <span className="text-white font-bold">A</span>
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-gray-900">Admin Panel</h2>
                  <p className="text-xs text-gray-500">Management Console</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden text-gray-400 hover:text-gray-600 p-1"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6">
            {menuItems.map((section, sectionIndex) => {
              // Filter items based on permissions
              const accessibleItems = section.items.filter(item => hasAccess(item.permission));
              
              // Don't show section if no accessible items
              if (accessibleItems.length === 0) return null;
              
              return (
                <div key={sectionIndex} className="mb-8">
                  <h3 className="px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                  <nav className="space-y-1 px-3">
                    {accessibleItems.map((item, itemIndex) => (
                      <Link
                        key={itemIndex}
                        to={item.path}
                        onClick={() => window.innerWidth < 1024 && onClose()}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                          ${isActive(item.path) ? 'bg-opacity-10 text-indigo-700 border-r-2' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                        style={isActive(item.path) ? {
                          backgroundColor: `${branding.primaryColor}10`,
                          color: branding.primaryColor,
                          borderRightColor: branding.primaryColor
                        } : {}}
                      >
                        <SafeIcon icon={item.icon} className="w-5 h-5" />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <SafeIcon icon={FiIcons.FiEye} className="w-4 h-4" />
              View Public Site
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;