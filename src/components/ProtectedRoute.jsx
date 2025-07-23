import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, permission = null, fallback = null }) => {
  const { isAuthenticated, user, hasPermission, isAdmin } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user account is active
  if (user?.status !== 'active') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-yellow-50 text-yellow-700 p-6 rounded-lg max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-2">Account Inactive</h2>
          <p>Your account is currently inactive. Please contact an administrator.</p>
        </div>
      </div>
    );
  }

  // Check admin-only routes
  if (adminOnly && !isAdmin()) {
    if (fallback) {
      return fallback;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Check specific permission
  if (permission && !hasPermission(permission)) {
    if (fallback) {
      return fallback;
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;