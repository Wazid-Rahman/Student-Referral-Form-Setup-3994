import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AdminLayout from './AdminLayout';
import supabase from '../lib/supabase';

const { FiPlus, FiTrash2, FiEdit, FiSave, FiEye, FiType, FiMail, FiPhone, FiCalendar, FiList, FiToggleLeft, FiToggleRight, FiMove, FiCopy, FiSettings } = FiIcons;

const FormBuilder = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!formId;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft',
    fields: [
      {
        id: 'parent_name',
        type: 'text',
        label: 'Parent/Guardian Name',
        placeholder: 'Enter full name',
        required: true,
        section: 'parent'
      },
      {
        id: 'parent_email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'parent@example.com',
        required: true,
        section: 'parent'
      }
    ],
    sections: [
      { id: 'parent', name: 'Parent Information', icon: 'FiUser' },
      { id: 'student', name: 'Student Information', icon: 'FiGraduationCap' },
      { id: 'location', name: 'Location Information', icon: 'FiMapPin' },
      { id: 'program', name: 'Program Information', icon: 'FiBook' }
    ],
    settings: {
      allowDuplicates: false,
      sendConfirmationEmail: true,
      redirectUrl: '',
      submitButtonText: 'Submit Application'
    }
  });

  const [activeTab, setActiveTab] = useState('fields');
  const [selectedField, setSelectedField] = useState(null);
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchForm();
    }
  }, [formId]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('id', formId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Ensure fields and sections are properly parsed from JSON
        const parsedData = {
          ...data,
          fields: Array.isArray(data.fields) ? data.fields : [],
          sections: Array.isArray(data.sections) ? data.sections : [],
          settings: typeof data.settings === 'object' ? data.settings : formData.settings
        };
        setFormData(parsedData);
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      setError(error.message || 'Failed to load form');
      // Keep the default formData
    } finally {
      setLoading(false);
    }
  };

  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: FiType },
    { type: 'email', label: 'Email', icon: FiMail },
    { type: 'phone', label: 'Phone', icon: FiPhone },
    { type: 'select', label: 'Dropdown', icon: FiList },
    { type: 'textarea', label: 'Text Area', icon: FiEdit },
    { type: 'date', label: 'Date', icon: FiCalendar },
    { type: 'checkbox', label: 'Checkbox', icon: FiToggleLeft },
    { type: 'radio', label: 'Radio Button', icon: FiToggleRight }
  ];

  const addField = (type) => {
    const newField = {
      id: `field_${Date.now()}`,
      type,
      label: `New ${type} Field`,
      placeholder: '',
      required: false,
      section: 'parent',
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined
    };

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));

    setSelectedField(newField);
    setShowFieldEditor(true);
  };

  const updateField = (fieldId, updates) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const deleteField = (fieldId) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    setSelectedField(null);
    setShowFieldEditor(false);
  };

  const saveForm = async () => {
    try {
      setLoading(true);
      
      // Prepare the form data
      const formToSave = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        fields: formData.fields,
        sections: formData.sections,
        settings: formData.settings,
        submissions: formData.submissions || 0
      };

      let result;
      
      if (isEditing) {
        // Update existing form
        const { data, error } = await supabase
          .from('forms')
          .update(formToSave)
          .eq('id', formId)
          .select();

        if (error) throw error;
        result = data;
      } else {
        // Create new form
        const { data, error } = await supabase
          .from('forms')
          .insert(formToSave)
          .select();

        if (error) throw error;
        result = data;
      }

      // Show success message
      alert('Form saved successfully!');
      
      if (!isEditing && result) {
        // Navigate to forms list after creating a new form
        navigate('/admin/forms');
      }
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Error saving form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const previewForm = () => {
    // Open preview in new tab
    window.open('/referral/demo', '_blank');
  };

  const renderFieldEditor = () => {
    if (!selectedField) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Field</h3>
          <button
            onClick={() => setShowFieldEditor(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Label
            </label>
            <input
              type="text"
              value={selectedField.label}
              onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field ID
            </label>
            <input
              type="text"
              value={selectedField.id}
              onChange={(e) => updateField(selectedField.id, { id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              This is used as the field identifier. Use only letters, numbers, and underscores.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={selectedField.placeholder || ''}
              onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              value={selectedField.section}
              onChange={(e) => updateField(selectedField.id, { section: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              {formData.sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
          {(selectedField.type === 'select' || selectedField.type === 'radio') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options (one per line)
              </label>
              <textarea
                value={(selectedField.options || []).join('\n')}
                onChange={(e) => updateField(selectedField.id, { options: e.target.value.split('\n').filter(opt => opt.trim()) })}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="required"
              checked={selectedField.required}
              onChange={(e) => updateField(selectedField.id, { required: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
              Required field
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => deleteField(selectedField.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete Field
            </button>
            <button
              onClick={() => setShowFieldEditor(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading && !formData.name) {
    return (
      <AdminLayout title="Loading Form..." subtitle="Please wait">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Error" subtitle="Could not load form">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          <p>{error}</p>
          <button 
            onClick={fetchForm}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditing ? 'Edit Form' : 'Create New Form'} subtitle="Build and customize referral forms">
      <div className="max-w-7xl mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Form Name"
              className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-2"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={previewForm}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <SafeIcon icon={FiEye} className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={saveForm}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isEditing ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  <SafeIcon icon={FiSave} className="w-4 h-4" />
                  {isEditing ? 'Update Form' : 'Save Form'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Form Description */}
        <div className="mb-6">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Form description..."
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'fields', label: 'Fields' },
              { id: 'settings', label: 'Settings' },
              { id: 'styling', label: 'Styling' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'fields' && (
              <div className="space-y-6">
                {/* Field Types */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Fields</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {fieldTypes.map(fieldType => (
                      <button
                        key={fieldType.type}
                        onClick={() => addField(fieldType.type)}
                        className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-colors"
                      >
                        <SafeIcon icon={fieldType.icon} className="w-6 h-6 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">{fieldType.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Preview */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Preview</h3>
                  {formData.sections.map(section => {
                    const sectionFields = formData.fields.filter(field => field.section === section.id);
                    if (sectionFields.length === 0) return null;

                    return (
                      <div key={section.id} className="mb-8">
                        <h4 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b">
                          {section.name}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {sectionFields.map(field => (
                            <div
                              key={field.id}
                              className="relative group cursor-pointer"
                              onClick={() => {
                                setSelectedField(field);
                                setShowFieldEditor(true);
                              }}
                            >
                              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedField(field);
                                      setShowFieldEditor(true);
                                    }}
                                    className="p-1 bg-indigo-600 text-white rounded text-xs"
                                  >
                                    <SafeIcon icon={FiEdit} className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteField(field.id);
                                    }}
                                    className="p-1 bg-red-600 text-white rounded text-xs"
                                  >
                                    <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              {field.type === 'select' ? (
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                                  <option>{field.placeholder || 'Select an option'}</option>
                                  {(field.options || []).map((option, idx) => (
                                    <option key={idx}>{option}</option>
                                  ))}
                                </select>
                              ) : field.type === 'textarea' ? (
                                <textarea
                                  placeholder={field.placeholder}
                                  rows="3"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                  readOnly
                                />
                              ) : field.type === 'checkbox' ? (
                                <div className="flex items-center">
                                  <input type="checkbox" className="h-4 w-4 text-indigo-600 mr-2" />
                                  <span className="text-sm text-gray-700">
                                    {field.placeholder || field.label}
                                  </span>
                                </div>
                              ) : (
                                <input
                                  type={field.type}
                                  placeholder={field.placeholder}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                  readOnly
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  <div className="mt-8">
                    <button
                      type="button"
                      className="bg-indigo-600 text-white px-8 py-3 rounded-md font-medium"
                    >
                      {formData.settings.submitButtonText}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Form Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Submit Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.settings.submitButtonText}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, submitButtonText: e.target.value }
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Redirect URL (after submission)
                    </label>
                    <input
                      type="url"
                      value={formData.settings.redirectUrl}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, redirectUrl: e.target.value }
                        }))
                      }
                      placeholder="https://example.com/thank-you"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allowDuplicates"
                        checked={formData.settings.allowDuplicates}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            settings: { ...prev.settings, allowDuplicates: e.target.checked }
                          }))
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="allowDuplicates" className="ml-2 block text-sm text-gray-900">
                        Allow duplicate submissions
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sendConfirmationEmail"
                        checked={formData.settings.sendConfirmationEmail}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              sendConfirmationEmail: e.target.checked
                            }
                          }))
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="sendConfirmationEmail" className="ml-2 block text-sm text-gray-900">
                        Send confirmation email
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'styling' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Form Styling</h3>
                <p className="text-gray-500">Styling options coming soon...</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {showFieldEditor && renderFieldEditor()}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FormBuilder;