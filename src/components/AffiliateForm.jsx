import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import FormSection from './FormSection';
import FormField from './FormField';
import ShareModal from './ShareModal';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiUsers, FiUser, FiGraduationCap, FiMapPin, FiShare2, FiCheck, FiInfo } = FiIcons;

const AffiliateForm = () => {
  const { affiliateId } = useParams();
  const location = useLocation();
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Parent Information
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    // Student Information
    studentName: '',
    studentGrade: '',
    studentEmail: '',
    studentPhone: '',
    // Location Information
    schoolName: '',
    districtName: '',
    city: '',
    state: '',
    // Referral Information
    referredBy: '',
    program: '',
    // Affiliate Information
    affiliateId: affiliateId || ''
  });

  const programOptions = [
    { value: '', label: 'Select a program' },
    { value: 'SAT Prep', label: 'SAT Preparation' },
    { value: 'ACT Prep', label: 'ACT Preparation' },
    { value: 'PSAT Prep', label: 'PSAT Preparation' },
    { value: 'AP Math', label: 'AP Mathematics' },
    { value: 'AP Science', label: 'AP Science' },
    { value: 'College Essays', label: 'College Essay Writing' },
    { value: 'Other', label: 'Other' }
  ];

  const stateOptions = [
    { value: '', label: 'Select state' },
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
  ];

  const gradeOptions = [
    { value: '', label: 'Select grade' },
    { value: '9th Grade', label: '9th Grade' },
    { value: '10th Grade', label: '10th Grade' },
    { value: '11th Grade', label: '11th Grade' },
    { value: '12th Grade', label: '12th Grade' },
    { value: 'College', label: 'College' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    if (affiliateId) {
      setFormData(prev => ({ ...prev, affiliateId }));
      // Track referral link click
      trackReferralClick();
    }
  }, [affiliateId]);

  const trackReferralClick = async () => {
    if (!affiliateId) return;

    try {
      // Check if this affiliate ID exists
      const { data: existingReferral, error } = await supabase
        .from('referral_links')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking referral link:', error);
        return;
      }
      
      if (existingReferral) {
        // Update the clicks count and last_used_at timestamp
        const { error: updateError } = await supabase
          .from('referral_links')
          .update({
            clicks: existingReferral.clicks + 1,
            last_used_at: new Date().toISOString()
          })
          .eq('id', existingReferral.id);
          
        if (updateError) {
          console.error('Error updating referral link clicks:', updateError);
        }
      } else {
        // Create a new record for this affiliate ID
        const { error: insertError } = await supabase
          .from('referral_links')
          .insert({
            affiliate_id: affiliateId,
            clicks: 1,
            conversions: 0,
            last_used_at: new Date().toISOString()
          });
          
        if (insertError) {
          console.error('Error creating new referral link:', insertError);
        }
      }
    } catch (error) {
      console.error('Error tracking referral click:', error);
      // Don't block the form if tracking fails
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    const requiredFields = {
      parentName: 'Parent/Guardian Name',
      parentEmail: 'Parent Email',
      parentPhone: 'Parent Phone',
      studentName: 'Student Name',
      studentGrade: 'Student Grade',
      schoolName: 'School Name',
      city: 'City',
      state: 'State',
      program: 'Program'
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].trim() === '') {
        setError(`${label} is required`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.parentEmail)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Find the referral record to link to
      let referralId = null;
      if (formData.affiliateId) {
        const { data: referral, error: referralError } = await supabase
          .from('referral_links')
          .select('id, conversions')
          .eq('affiliate_id', formData.affiliateId)
          .single();
          
        if (referralError && referralError.code !== 'PGRST116') {
          console.error('Error fetching referral:', referralError);
        }
        
        if (referral) {
          referralId = referral.id;
          
          // Increment conversions count
          const { error: updateError } = await supabase
            .from('referral_links')
            .update({ conversions: referral.conversions + 1 })
            .eq('id', referralId);
            
          if (updateError) {
            console.error('Error updating conversions:', updateError);
          }
        }
      }

      // Insert the form submission
      const submissionData = {
        referral_id: referralId,
        form_name: 'Educational Program Application',
        parent_name: formData.parentName,
        parent_email: formData.parentEmail,
        parent_phone: formData.parentPhone,
        student_name: formData.studentName,
        student_grade: formData.studentGrade,
        student_email: formData.studentEmail || null,
        student_phone: formData.studentPhone || null,
        school_name: formData.schoolName,
        district_name: formData.districtName || null,
        city: formData.city,
        state: formData.state,
        referred_by: formData.referredBy || null,
        program: formData.program,
        affiliate_id: formData.affiliateId || null,
        status: 'pending'
      };

      const { error: submissionError } = await supabase
        .from('form_submissions')
        .insert(submissionData);
        
      if (submissionError) {
        throw new Error(submissionError.message);
      }

      // Show success state
      setIsSubmitted(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          parentName: '',
          parentEmail: '',
          parentPhone: '',
          studentName: '',
          studentGrade: '',
          studentEmail: '',
          studentPhone: '',
          schoolName: '',
          districtName: '',
          city: '',
          state: '',
          referredBy: '',
          program: '',
          affiliateId: affiliateId || ''
        });
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setError('There was an error submitting the form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateAffiliateLink = () => {
    // Get the current domain instead of window.location.origin
    const baseUrl = window.location.hostname;
    // Use actual domain for production, not localhost
    const domain = baseUrl === 'localhost' ? 'yourdomain.com' : baseUrl;
    const newAffiliateId = Math.random().toString(36).substr(2, 9);
    
    // Create a record for this new affiliate ID
    const createReferralLink = async () => {
      try {
        const { error } = await supabase
          .from('referral_links')
          .insert({
            affiliate_id: newAffiliateId,
            user_id: null, // In a real app, this would be the current user's ID
            clicks: 0,
            conversions: 0
          });
          
        if (error) {
          console.error('Error creating referral link:', error);
        }
      } catch (error) {
        console.error('Error creating referral link:', error);
      }
    };

    createReferralLink();
    return `https://${domain}/referral/${newAffiliateId}`;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your referral has been submitted successfully. We'll be in touch soon!
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Don't forget to share your referral link with others to earn rewards!
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Educational Program Referral
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Help a student succeed by referring them to our programs
          </p>
          
          {affiliateId && (
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <SafeIcon icon={FiUsers} className="w-4 h-4" />
              Referral ID: {affiliateId}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <SafeIcon icon={FiShare2} className="w-4 h-4" />
              Share Referral Link
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <SafeIcon icon={FiInfo} className="w-4 h-4" />
              <span>Earn rewards for each successful referral</span>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-6"
          >
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <SafeIcon icon={FiInfo} className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Parent Information */}
              <FormSection
                title="Parent/Guardian Information"
                icon={FiUser}
                className="lg:col-span-2"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    label="Parent/Guardian Name"
                    type="text"
                    value={formData.parentName}
                    onChange={(value) => handleInputChange('parentName', value)}
                    required
                    placeholder="Enter full name"
                  />
                  <FormField
                    label="Email Address"
                    type="email"
                    value={formData.parentEmail}
                    onChange={(value) => handleInputChange('parentEmail', value)}
                    required
                    placeholder="parent@example.com"
                  />
                  <FormField
                    label="Phone Number"
                    type="tel"
                    value={formData.parentPhone}
                    onChange={(value) => handleInputChange('parentPhone', value)}
                    required
                    placeholder="(555) 123-4567"
                  />
                </div>
              </FormSection>

              {/* Student Information */}
              <FormSection
                title="Student Information"
                icon={FiGraduationCap}
                className="lg:col-span-2"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FormField
                    label="Student Name"
                    type="text"
                    value={formData.studentName}
                    onChange={(value) => handleInputChange('studentName', value)}
                    required
                    placeholder="Enter student name"
                  />
                  <FormField
                    label="Grade Level"
                    type="select"
                    value={formData.studentGrade}
                    onChange={(value) => handleInputChange('studentGrade', value)}
                    options={gradeOptions}
                    required
                  />
                  <FormField
                    label="Student Email"
                    type="email"
                    value={formData.studentEmail}
                    onChange={(value) => handleInputChange('studentEmail', value)}
                    placeholder="student@example.com"
                  />
                  <FormField
                    label="Student Phone"
                    type="tel"
                    value={formData.studentPhone}
                    onChange={(value) => handleInputChange('studentPhone', value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </FormSection>

              {/* Location Information */}
              <FormSection
                title="Location Information"
                icon={FiMapPin}
                className="lg:col-span-2"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FormField
                    label="School Name"
                    type="text"
                    value={formData.schoolName}
                    onChange={(value) => handleInputChange('schoolName', value)}
                    required
                    placeholder="Enter school name"
                  />
                  <FormField
                    label="District Name"
                    type="text"
                    value={formData.districtName}
                    onChange={(value) => handleInputChange('districtName', value)}
                    placeholder="Enter district name"
                  />
                  <FormField
                    label="City"
                    type="text"
                    value={formData.city}
                    onChange={(value) => handleInputChange('city', value)}
                    required
                    placeholder="Enter city"
                  />
                  <FormField
                    label="State"
                    type="select"
                    value={formData.state}
                    onChange={(value) => handleInputChange('state', value)}
                    options={stateOptions}
                    required
                  />
                </div>
              </FormSection>

              {/* Referral Information */}
              <FormSection
                title="Referral Information"
                icon={FiUsers}
                className="lg:col-span-2"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Who referred you?"
                    type="text"
                    value={formData.referredBy}
                    onChange={(value) => handleInputChange('referredBy', value)}
                    placeholder="Enter referrer's name"
                  />
                  <FormField
                    label="Program of Interest"
                    type="select"
                    value={formData.program}
                    onChange={(value) => handleInputChange('program', value)}
                    options={programOptions}
                    required
                  />
                </div>
              </FormSection>
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Referral'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        generateLink={generateAffiliateLink}
      />
    </div>
  );
};

export default AffiliateForm;