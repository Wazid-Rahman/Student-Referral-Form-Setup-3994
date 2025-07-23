import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AdminLayout from './AdminLayout';

const {
  FiSave, FiEdit, FiPlus, FiTrash2, FiArrowLeft, FiImage, FiLayout, FiType,
  FiMinus, FiCheck, FiX, FiEye, FiAward, FiUsers, FiBook, FiTrendingUp
} = FiIcons;

const LandingPageEditor = () => {
  // In a real application, this would be fetched from the database
  const [pageContent, setPageContent] = useState({
    hero: {
      title: "Unlock Your Academic Potential",
      subtitle: "Join our referral program and help students succeed while earning rewards",
      ctaText: "Get Started"
    },
    features: [
      {
        icon: "FiAward",
        title: "Premium Test Prep",
        description: "Access top-quality SAT, ACT, and AP test preparation materials and expert guidance."
      },
      {
        icon: "FiTrendingUp",
        title: "Proven Results",
        description: "Our students consistently achieve score improvements averaging 150+ points on the SAT."
      },
      {
        icon: "FiUsers",
        title: "Expert Instructors",
        description: "Learn from experienced educators who know exactly what it takes to succeed."
      },
      {
        icon: "FiBook",
        title: "Comprehensive Resources",
        description: "Get access to study guides, practice tests, video lessons, and personalized feedback."
      }
    ],
    testimonials: [
      {
        name: "Jennifer P.",
        role: "Parent",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        quote: "The referral program was so easy to use. I referred three families, and my daughter received a discount on her SAT prep. The results were amazing!"
      },
      {
        name: "David M.",
        role: "School Counselor",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        quote: "I've referred dozens of students to this program, and the feedback has been overwhelmingly positive. The referral tracking is transparent and the rewards are generous."
      },
      {
        name: "Sophia L.",
        role: "Student",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        quote: "I improved my SAT score by 200 points! I've been telling all my friends about this program, and the referral bonuses have been a great added benefit."
      }
    ],
    stats: [
      { value: "10,000+", label: "Students Served" },
      { value: "250+", label: "Score Improvement" },
      { value: "95%", label: "Success Rate" },
      { value: "$100K+", label: "Referral Rewards Paid" }
    ],
    cta: {
      title: "Ready to Join Our Referral Network?",
      description: "Start earning rewards while helping students achieve their academic goals",
      buttonText: "Sign Up Today"
    }
  });

  const [activeSection, setActiveSection] = useState('hero');
  const [editMode, setEditMode] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [tempValue, setTempValue] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const availableIcons = [
    { name: "FiAward", component: FiAward },
    { name: "FiUsers", component: FiUsers },
    { name: "FiBook", component: FiBook },
    { name: "FiTrendingUp", component: FiTrendingUp }
  ];

  const handleSave = () => {
    // In a real application, this would save to the database
    console.log('Saving page content:', pageContent);
    setSuccessMessage('Page content saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditStart = (section, item, index) => {
    setEditMode(true);
    setEditItem(item);
    setEditIndex(index);
    setTempValue(
      section === 'hero' || section === 'cta'
        ? { ...pageContent[section] }
        : { ...pageContent[section][index] }
    );
  };

  const handleEditCancel = () => {
    setEditMode(false);
    setEditItem(null);
    setEditIndex(null);
    setTempValue({});
  };

  const handleEditSave = () => {
    if (editItem === 'hero') {
      setPageContent({ ...pageContent, hero: tempValue });
    } else if (editItem === 'cta') {
      setPageContent({ ...pageContent, cta: tempValue });
    } else if (editItem === 'feature') {
      const newFeatures = [...pageContent.features];
      newFeatures[editIndex] = tempValue;
      setPageContent({ ...pageContent, features: newFeatures });
    } else if (editItem === 'testimonial') {
      const newTestimonials = [...pageContent.testimonials];
      newTestimonials[editIndex] = tempValue;
      setPageContent({ ...pageContent, testimonials: newTestimonials });
    } else if (editItem === 'stat') {
      const newStats = [...pageContent.stats];
      newStats[editIndex] = tempValue;
      setPageContent({ ...pageContent, stats: newStats });
    }

    setEditMode(false);
    setEditItem(null);
    setEditIndex(null);
    setTempValue({});
  };

  const handleAddItem = (section) => {
    if (section === 'features') {
      const newFeature = {
        icon: "FiAward",
        title: "New Feature",
        description: "Description for the new feature."
      };
      setPageContent({ ...pageContent, features: [...pageContent.features, newFeature] });
    } else if (section === 'testimonials') {
      const newTestimonial = {
        name: "New Testimonial",
        role: "Role",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        quote: "Quote for the new testimonial."
      };
      setPageContent({ ...pageContent, testimonials: [...pageContent.testimonials, newTestimonial] });
    } else if (section === 'stats') {
      const newStat = { value: "New Value", label: "New Label" };
      setPageContent({ ...pageContent, stats: [...pageContent.stats, newStat] });
    }
  };

  const handleRemoveItem = (section, index) => {
    if (section === 'features') {
      const newFeatures = [...pageContent.features];
      newFeatures.splice(index, 1);
      setPageContent({ ...pageContent, features: newFeatures });
    } else if (section === 'testimonials') {
      const newTestimonials = [...pageContent.testimonials];
      newTestimonials.splice(index, 1);
      setPageContent({ ...pageContent, testimonials: newTestimonials });
    } else if (section === 'stats') {
      const newStats = [...pageContent.stats];
      newStats.splice(index, 1);
      setPageContent({ ...pageContent, stats: newStats });
    }
  };

  const handleTempValueChange = (key, value) => {
    setTempValue({ ...tempValue, [key]: value });
  };

  return (
    <AdminLayout title="Landing Page Editor" subtitle="Customize your landing page content">
      <div className="max-w-7xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"
            >
              <SafeIcon icon={FiCheck} className="w-5 h-5" />
              <span>{successMessage}</span>
            </motion.div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-6">
              <div className="p-4 bg-gray-50 border-b">
                <h3 className="font-medium text-gray-900">Page Sections</h3>
              </div>
              <div className="p-2">
                <button
                  onClick={() => setActiveSection('hero')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                    activeSection === 'hero' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <SafeIcon icon={FiLayout} className="w-5 h-5" />
                  <span>Hero Section</span>
                </button>
                <button
                  onClick={() => setActiveSection('features')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                    activeSection === 'features' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <SafeIcon icon={FiAward} className="w-5 h-5" />
                  <span>Features</span>
                </button>
                <button
                  onClick={() => setActiveSection('stats')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                    activeSection === 'stats' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <SafeIcon icon={FiTrendingUp} className="w-5 h-5" />
                  <span>Statistics</span>
                </button>
                <button
                  onClick={() => setActiveSection('testimonials')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                    activeSection === 'testimonials' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <SafeIcon icon={FiUsers} className="w-5 h-5" />
                  <span>Testimonials</span>
                </button>
                <button
                  onClick={() => setActiveSection('cta')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                    activeSection === 'cta' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <SafeIcon icon={FiType} className="w-5 h-5" />
                  <span>Call to Action</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-medium text-gray-900">
                  {activeSection === 'hero' && 'Hero Section'}
                  {activeSection === 'features' && 'Features Section'}
                  {activeSection === 'stats' && 'Statistics Section'}
                  {activeSection === 'testimonials' && 'Testimonials Section'}
                  {activeSection === 'cta' && 'Call to Action Section'}
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => window.open('/', '_blank')}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                  >
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    <SafeIcon icon={FiSave} className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Hero Section Editor */}
                {activeSection === 'hero' && (
                  <div className="space-y-6">
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg relative group">
                      <button
                        onClick={() => handleEditStart('hero', 'hero')}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-all"
                      >
                        <SafeIcon icon={FiEdit} className="w-4 h-4 text-gray-600" />
                      </button>
                      <div>
                        <span className="block text-xs text-gray-500 mb-1">Title</span>
                        <div className="font-medium">{pageContent.hero.title}</div>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500 mb-1">Subtitle</span>
                        <div>{pageContent.hero.subtitle}</div>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500 mb-1">CTA Button Text</span>
                        <div>{pageContent.hero.ctaText}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add other sections here with similar structure */}
                {activeSection !== 'hero' && (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Editor
                    </h3>
                    <p className="text-gray-600">Content editor for this section coming soon!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LandingPageEditor;