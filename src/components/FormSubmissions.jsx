import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AdminLayout from './AdminLayout';
import supabase from '../lib/supabase';

const { FiSearch, FiFilter, FiDownload, FiEye, FiEdit, FiTrash2, FiUser, FiBook, FiMapPin, FiMail, FiPhone, FiCalendar, FiCheck, FiX, FiInfo } = FiIcons;

const FormSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formFilter, setFormFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Form names for filter options
  const [formOptions, setFormOptions] = useState([
    { value: 'all', label: 'All Forms' },
    { value: 'Educational Program Application', label: 'Educational Program Application' },
    { value: 'SAT Prep Enrollment', label: 'SAT Prep Enrollment' },
    { value: 'College Essay Workshop', label: 'College Essay Workshop' }
  ]);

  // Status options for filter
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-800' },
    { value: 'enrolled', label: 'Enrolled', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Completed', color: 'bg-purple-100 text-purple-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    fetchSubmissions();
    fetchFormNames();
  }, []);

  const fetchFormNames = async () => {
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('name')
        .order('name');

      if (error) throw error;

      if (data && data.length > 0) {
        const options = [
          { value: 'all', label: 'All Forms' },
          ...data.map(form => ({ value: form.name, label: form.name }))
        ];
        setFormOptions(options);
      }
    } catch (err) {
      console.error('Error fetching form names:', err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      
      // Fetch submissions from Supabase
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setSubmissions(data);
      } else {
        // Use mock data as fallback
        const mockSubmissions = [
          {
            id: 1,
            form_name: "Educational Program Application",
            parent_name: "Sarah Johnson",
            parent_email: "sarah.johnson@example.com",
            parent_phone: "(555) 123-4567",
            student_name: "Emma Johnson",
            student_grade: "11th Grade",
            school_name: "Lincoln High School",
            district_name: "Westside School District",
            city: "Los Angeles",
            state: "CA",
            program: "SAT Prep",
            status: "pending",
            affiliate_id: "ref123abc",
            created_at: "2024-01-15T10:00:00Z",
            notes: "Student is interested in weekend sessions"
          },
          {
            id: 2,
            form_name: "Educational Program Application",
            parent_name: "Michael Chen",
            parent_email: "michael.chen@example.com",
            parent_phone: "(555) 234-5678",
            student_name: "David Chen",
            student_grade: "12th Grade",
            school_name: "Washington High School",
            district_name: "Eastside School District",
            city: "San Francisco",
            state: "CA",
            program: "ACT Prep",
            status: "contacted",
            affiliate_id: "ref456def",
            created_at: "2024-01-16T14:30:00Z",
            notes: "Follow-up scheduled for next week"
          },
          {
            id: 3,
            form_name: "Educational Program Application",
            parent_name: "Lisa Rodriguez",
            parent_email: "lisa.rodriguez@example.com",
            parent_phone: "(555) 345-6789",
            student_name: "Carlos Rodriguez",
            student_grade: "10th Grade",
            school_name: "Jefferson High School",
            district_name: "Central School District",
            city: "Austin",
            state: "TX",
            program: "PSAT Prep",
            status: "enrolled",
            affiliate_id: "ref789ghi",
            created_at: "2024-01-17T09:15:00Z",
            notes: "Payment received, materials sent"
          },
          {
            id: 4,
            form_name: "SAT Prep Enrollment",
            parent_name: "Robert Wilson",
            parent_email: "robert.wilson@example.com",
            parent_phone: "(555) 456-7890",
            student_name: "James Wilson",
            student_grade: "11th Grade",
            school_name: "Roosevelt High School",
            district_name: "Northern School District",
            city: "Boston",
            state: "MA",
            program: "SAT Prep",
            status: "completed",
            affiliate_id: "ref101jkl",
            created_at: "2024-01-18T16:45:00Z",
            notes: "Program completed with excellent results"
          },
          {
            id: 5,
            form_name: "College Essay Workshop",
            parent_name: "Jennifer Thompson",
            parent_email: "jennifer.thompson@example.com",
            parent_phone: "(555) 567-8901",
            student_name: "Emily Thompson",
            student_grade: "12th Grade",
            school_name: "Kennedy High School",
            district_name: "Southern School District",
            city: "Miami",
            state: "FL",
            program: "College Essay",
            status: "pending",
            affiliate_id: "ref112mno",
            created_at: "2024-01-19T11:30:00Z",
            notes: "Requested more information about workshop dates"
          }
        ];
        setSubmissions(mockSubmissions);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions');
      
      // Use mock data as fallback
      const mockSubmissions = [
        {
          id: 1,
          form_name: "Educational Program Application",
          parent_name: "Sarah Johnson",
          parent_email: "sarah.johnson@example.com",
          parent_phone: "(555) 123-4567",
          student_name: "Emma Johnson",
          student_grade: "11th Grade",
          school_name: "Lincoln High School",
          district_name: "Westside School District",
          city: "Los Angeles",
          state: "CA",
          program: "SAT Prep",
          status: "pending",
          affiliate_id: "ref123abc",
          created_at: "2024-01-15T10:00:00Z",
          notes: "Student is interested in weekend sessions"
        },
        {
          id: 2,
          form_name: "Educational Program Application",
          parent_name: "Michael Chen",
          parent_email: "michael.chen@example.com",
          parent_phone: "(555) 234-5678",
          student_name: "David Chen",
          student_grade: "12th Grade",
          school_name: "Washington High School",
          district_name: "Eastside School District",
          city: "San Francisco",
          state: "CA",
          program: "ACT Prep",
          status: "contacted",
          affiliate_id: "ref456def",
          created_at: "2024-01-16T14:30:00Z",
          notes: "Follow-up scheduled for next week"
        }
      ];
      setSubmissions(mockSubmissions);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
  };

  const handleStatusChange = async (submissionId, newStatus) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('form_submissions')
        .update({ status: newStatus })
        .eq('id', submissionId);

      if (error) throw error;

      // Update local state
      setSubmissions(prev => 
        prev.map(sub => sub.id === submissionId ? { ...sub, status: newStatus } : sub)
      );

      // If the selected submission is the one being updated, update it too
      if (selectedSubmission && selectedSubmission.id === submissionId) {
        setSelectedSubmission(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Error updating submission status:', err);
      alert('Error updating status. Please try again.');
    }
  };

  const handleExportCSV = () => {
    const data = filteredSubmissions.map(submission => ({
      'Form': submission.form_name,
      'Parent Name': submission.parent_name,
      'Parent Email': submission.parent_email,
      'Parent Phone': submission.parent_phone,
      'Student Name': submission.student_name,
      'Student Grade': submission.student_grade,
      'School': submission.school_name,
      'District': submission.district_name,
      'City': submission.city,
      'State': submission.state,
      'Program': submission.program,
      'Status': submission.status,
      'Affiliate ID': submission.affiliate_id,
      'Date': format(new Date(submission.created_at), 'MM/dd/yyyy')
    }));

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(value => `"${value}"`).join(','));
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      submission.student_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      submission.parent_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesForm = formFilter === 'all' || submission.form_name === formFilter;
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;

    return matchesSearch && matchesForm && matchesStatus;
  });

  const getStatusColor = (status) => {
    const statusData = statusOptions.find(s => s.value === status);
    return statusData?.color || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <AdminLayout title="Form Submissions" subtitle="View and manage all form submissions">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading submissions...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Form Submissions" subtitle="View and manage all form submissions">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <div className="flex items-center">
              <SafeIcon icon={FiInfo} className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchSubmissions}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Form Submissions" subtitle="View and manage all form submissions">
      <div className="max-w-7xl mx-auto">
        {/* Page Header with Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
                <h3 className="text-2xl font-bold text-gray-900">{submissions.length}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <SafeIcon icon={FiBook} className="w-6 h-6 text-blue-600" />
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
                <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'pending').length}
                </h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <SafeIcon icon={FiInfo} className="w-6 h-6 text-yellow-600" />
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
                <p className="text-sm text-gray-600 mb-1">Enrolled</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'enrolled').length}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <SafeIcon icon={FiCheck} className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Submissions</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <SafeIcon
                  icon={FiSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <select
                value={formFilter}
                onChange={(e) => setFormFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {formOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Submissions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <SafeIcon icon={FiUser} className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{submission.student_name}</div>
                            <div className="text-sm text-gray-500">{submission.student_grade}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{submission.parent_name}</div>
                        <div className="text-sm text-gray-500">{submission.parent_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{submission.program}</div>
                        <div className="text-sm text-gray-500">{submission.form_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{submission.school_name}</div>
                        <div className="text-sm text-gray-500">
                          {submission.city}, {submission.state}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            submission.status
                          )}`}
                        >
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(submission.created_at), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewSubmission(submission)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <SafeIcon icon={FiEye} className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <SafeIcon icon={FiEdit} className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No submissions found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Submission Details</h2>
                  <p className="text-sm text-gray-500">
                    {format(new Date(selectedSubmission.created_at), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Student & Parent Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Student Name</p>
                        <p className="font-medium">{selectedSubmission.student_name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <SafeIcon icon={FiBook} className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Grade Level</p>
                        <p className="font-medium">{selectedSubmission.student_grade}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <SafeIcon icon={FiMapPin} className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">School</p>
                        <p className="font-medium">{selectedSubmission.school_name}</p>
                        <p className="text-sm text-gray-500">{selectedSubmission.district_name}</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Parent Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Parent Name</p>
                        <p className="font-medium">{selectedSubmission.parent_name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedSubmission.parent_email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{selectedSubmission.parent_phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <SafeIcon icon={FiMapPin} className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">
                          {selectedSubmission.city}, {selectedSubmission.state}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Program & Status Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <SafeIcon icon={FiBook} className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Program</p>
                          <p className="font-medium">{selectedSubmission.program}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Submission Date</p>
                          <p className="font-medium">
                            {format(new Date(selectedSubmission.created_at), 'MMMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <SafeIcon icon={FiInfo} className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Form Type</p>
                          <p className="font-medium">{selectedSubmission.form_name}</p>
                        </div>
                      </div>
                      {selectedSubmission.affiliate_id && (
                        <div className="flex items-start gap-3">
                          <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Referral ID</p>
                            <p className="font-medium">{selectedSubmission.affiliate_id}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Current Status</p>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          selectedSubmission.status
                        )}`}
                      >
                        {selectedSubmission.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Update Status</p>
                      <div className="flex flex-wrap gap-2">
                        {statusOptions
                          .filter(s => s.value !== 'all' && s.value !== selectedSubmission.status)
                          .map(status => (
                            <button
                              key={status.value}
                              onClick={() => handleStatusChange(selectedSubmission.id, status.value)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium ${status.color} hover:opacity-80 transition-opacity`}
                            >
                              {status.label}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>

                  {selectedSubmission.notes && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-yellow-800">{selectedSubmission.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </button>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                  Edit
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Mark as Contacted
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
};

export default FormSubmissions;