import React, { createContext, useState, useContext, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    // Check for existing session in localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Verify user still exists in database and get updated permissions
        await refreshUserData(parsedUser.email);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  };

  const refreshUserData = async (email) => {
    try {
      // Query the database for the user
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('userData');
        return;
      }

      if (user) {
        const userData = {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          permissions: user.permissions || [],
          department: user.department,
          location: user.location,
          token: `token-${Date.now()}`
        };
        
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));

        // Update last login
        const { error: updateError } = await supabase
          .from('users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating last login:', updateError);
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      localStorage.removeItem('userData');
    }
  };

  const login = async (credentials) => {
    try {
      // Check if user exists in database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', credentials.email)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        
        // Fallback to mock authentication for demo
        const mockUsers = [
          {
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
            name: 'Admin User',
            permissions: ['users:read', 'users:write', 'forms:read', 'forms:write', 'analytics:read', 'settings:read', 'settings:write']
          },
          {
            email: 'user@example.com',
            password: 'user123',
            role: 'user',
            name: 'Regular User',
            permissions: ['forms:read']
          },
          {
            email: 'manager@example.com',
            password: 'manager123',
            role: 'manager',
            name: 'Manager User',
            permissions: ['users:read', 'forms:read', 'forms:write', 'analytics:read']
          }
        ];

        const mockUser = mockUsers.find(
          u => u.email === credentials.email && u.password === credentials.password
        );

        if (mockUser) {
          const userData = {
            userId: `user-${Date.now()}`,
            email: mockUser.email,
            name: mockUser.name,
            role: mockUser.role,
            status: 'active',
            permissions: mockUser.permissions,
            token: `token-${Date.now()}`
          };

          setIsAuthenticated(true);
          setUser(userData);
          localStorage.setItem('userData', JSON.stringify(userData));
          return userData;
        }
        
        throw new Error('Invalid credentials');
      }

      // In a real app, you would verify the password here
      // For demo purposes, we'll just check if the user exists
      const userData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        permissions: user.permissions || [],
        department: user.department,
        location: user.location,
        token: `token-${Date.now()}`
      };

      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));

      // Update last login
      const { error: updateError } = await supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating last login:', updateError);
      }

      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('userData');
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admins have all permissions
    return user.permissions && user.permissions.includes(permission);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isManager = () => {
    return user?.role === 'manager' || user?.role === 'admin';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        hasPermission,
        isAdmin,
        isManager,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};