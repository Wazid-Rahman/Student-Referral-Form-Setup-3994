import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useBranding } from './BrandingProvider';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUser, FiLogOut, FiSettings, FiChevronDown, FiList, FiShield } = FiIcons;

const Header = () => {
  const { isAuthenticated, user, logout, hasPermission, isAdmin } = useAuth();
  const { branding } = useBranding();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const getRoleDisplay = () => {
    if (!user) return 'User';
    switch (user.role) {
      case 'admin': return 'Administrator';
      case 'manager': return 'Manager';
      case 'staff': return 'Staff';
      default: return 'Member';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding.logoAlt || branding.siteName}
                className="h-8 w-auto"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: branding.primaryColor }}
              >
                <span className="text-white font-bold text-sm">
                  {branding.siteName.substring(0, 2)}
                </span>
              </div>
            )}
            <span className="text-xl font-bold text-gray-900">{branding.siteName}</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
              style={{ '--hover-color': branding.primaryColor }}
            >
              Home
            </Link>
            <Link
              to="/referral/demo"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
              style={{ '--hover-color': branding.primaryColor }}
            >
              Refer Now
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`${
                    location.pathname === '/dashboard' ? 'text-indigo-600' : 'text-gray-700'
                  } hover:text-indigo-600 transition-colors`}
                  style={{
                    color: location.pathname === '/dashboard' ? branding.primaryColor : '',
                    '--hover-color': branding.primaryColor
                  }}
                >
                  Dashboard
                </Link>
                {hasPermission('analytics:read') && (
                  <Link
                    to="/analytics"
                    className={`${
                      location.pathname === '/analytics' ? 'text-indigo-600' : 'text-gray-700'
                    } hover:text-indigo-600 transition-colors`}
                    style={{
                      color: location.pathname === '/analytics' ? branding.primaryColor : '',
                      '--hover-color': branding.primaryColor
                    }}
                  >
                    Analytics
                  </Link>
                )}
                <Link
                  to="/referrals"
                  className={`${
                    location.pathname === '/referrals' ? 'text-indigo-600' : 'text-gray-700'
                  } hover:text-indigo-600 transition-colors`}
                  style={{
                    color: location.pathname === '/referrals' ? branding.primaryColor : '',
                    '--hover-color': branding.primaryColor
                  }}
                >
                  Referrals
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className={`${
                      location.pathname.startsWith('/admin') ? 'text-indigo-600' : 'text-gray-700'
                    } hover:text-indigo-600 transition-colors`}
                    style={{
                      color: location.pathname.startsWith('/admin') ? branding.primaryColor : '',
                      '--hover-color': branding.primaryColor
                    }}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: `${branding.primaryColor}20`,
                      color: branding.primaryColor
                    }}
                  >
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="text-sm font-medium text-gray-700 block">
                      {user?.name || user?.email?.split('@')[0] || 'User'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getRoleDisplay()}
                    </span>
                  </div>
                  <SafeIcon icon={FiChevronDown} className="w-4 h-4 text-gray-500" />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <SafeIcon icon={FiShield} className="w-3 h-3" />
                          {getRoleDisplay()}
                        </p>
                        {user?.permissions && user.permissions.length > 0 && (
                          <p className="text-xs text-gray-400 mt-1">
                            {user.permissions.length} permission{user.permissions.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>

                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <SafeIcon icon={FiUser} className="w-4 h-4" />
                        Dashboard
                      </Link>

                      <Link
                        to="/referrals"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <SafeIcon icon={FiList} className="w-4 h-4" />
                        My Referrals
                      </Link>

                      {hasPermission('analytics:read') && (
                        <Link
                          to="/analytics"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <SafeIcon icon={FiIcons.FiBarChart} className="w-4 h-4" />
                          Analytics
                        </Link>
                      )}

                      {isAdmin() && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <SafeIcon icon={FiSettings} className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}

                      <hr className="my-1" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-white px-4 py-2 rounded-lg font-medium"
                style={{ backgroundColor: branding.primaryColor }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;