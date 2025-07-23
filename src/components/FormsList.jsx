import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AdminLayout from './AdminLayout';
import supabase from '../lib/supabase';

const { FiPlus, FiEdit, FiTrash2, FiCopy, FiEye, FiUsers, FiBarChart } = FiIcons;

const FormsList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      // Fetch from Supabase
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setForms(data);
      } else {
        // Use mock data as fallback
        const mockForms = [
          {
            id: 1,
            name: 'Educational Program Application',
            description: 'Main application form for all educational programs',
            status: 'active',
            submissions: 156,
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-20T15:30:00Z'
          },
          {
            id: 2,
            name: 'SAT Prep Enrollment',
            description: 'Specific form for SAT preparation program enrollment',
            status: 'active',
            submissions: 89,
            created_at: '2024-01-10T09:00:00Z',
            updated_at: '2024-01-18T11:20:00Z'
          },
          {
            id: 3,
            name: 'College Essay Workshop',
            description: 'Registration form for college essay writing workshop',
            status: 'draft',
            submissions: 0,
            created_at: '2024-01-22T14:00:00Z',
            updated_at: '2024-01-22T14:00:00Z'
          }
        ];
        setForms(mockForms);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      setError(error.message || 'Failed to load forms');
      // Use mock data as fallback
      const mockForms = [
        {
          id: 1,
          name: 'Educational Program Application',
          description: 'Main application form for all educational programs',
          status: 'active',
          submissions: 156,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-20T15:30:00Z'
        },
        {
          id: 2,
          name: 'SAT Prep Enrollment',
          description: 'Specific form for SAT preparation program enrollment',
          status: 'active',
          submissions: 89,
          created_at: '2024-01-10T09:00:00Z',
          updated_at: '2024-01-18T11:20:00Z'
        },
        {
          id: 3,
          name: 'College Essay Workshop',
          description: 'Registration form for college essay writing workshop',
          status: 'draft',
          submissions: 0,
          created_at: '2024-01-22T14:00:00Z',
          updated_at: '2024-01-22T14:00:00Z'
        }
      ];
      setForms(mockForms);
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (formId) => {
    if (!confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', formId);

      if (error) throw error;

      // Update local state
      setForms(prev => prev.filter(form => form.id !== formId));
      alert('Form deleted successfully!');
    } catch (error) {
      console.error('Error deleting form:', error);
      alert('Error deleting form. Please try again.');
    }
  };

  const duplicateForm = async (form) => {
    try {
      // Create a copy of the form without the ID
      const { id, created_at, updated_at, ...formWithoutId } = form;
      
      const duplicatedForm = {
        ...formWithoutId,
        name: `${form.name} (Copy)`,
        status: 'draft'
      };

      // Insert into Supabase
      const { data, error } = await supabase
        .from('forms')
        .insert(duplicatedForm)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setForms(prev => [data[0], ...prev]);
      } else {
        // Fallback to local state update
        const mockNewForm = {
          ...duplicatedForm,
          id: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setForms(prev => [mockNewForm, ...prev]);
      }

      alert('Form duplicated successfully!');
    } catch (error) {
      console.error('Error duplicating form:', error);
      alert('Error duplicating form. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Forms" subtitle="Manage your referral forms">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Forms" subtitle="Manage your referral forms">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          <p>Error loading forms: {error}</p>
          <button 
            onClick={fetchForms}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Forms" subtitle="Manage your referral forms">
      <div className="max-w-7xl mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">All Forms</h2>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              {forms.length} forms
            </span>
          </div>
          <Link
            to="/admin/forms/create"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            Create Form
          </Link>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form, index) => (
            <motion.div
              key={form.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {form.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {form.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          form.status
                        )}`}
                      >
                        {form.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {form.submissions} submissions
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="px-6 py-4 bg-gray-50">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <SafeIcon icon={FiUsers} className="w-4 h-4" />
                    <span>{form.submissions} submissions</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <SafeIcon icon={FiBarChart} className="w-4 h-4" />
                    <span>
                      {form.submissions > 0
                        ? Math.round((form.submissions / 200) * 100)
                        : 0}% rate
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Updated {format(new Date(form.updated_at), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => duplicateForm(form)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Duplicate form"
                    >
                      <SafeIcon icon={FiCopy} className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/referral/demo`}
                      target="_blank"
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Preview form"
                    >
                      <SafeIcon icon={FiEye} className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/admin/forms/edit/${form.id}`}
                      className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit form"
                    >
                      <SafeIcon icon={FiEdit} className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteForm(form.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete form"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {forms.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiPlus} className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first referral form.</p>
            <Link
              to="/admin/forms/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              Create Form
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FormsList;