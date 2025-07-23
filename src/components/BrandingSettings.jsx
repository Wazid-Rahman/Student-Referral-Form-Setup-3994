import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AdminLayout from './AdminLayout';
import supabase from '../lib/supabase';

const { FiUpload, FiSave, FiImage, FiX, FiCheck, FiEye, FiSliders, FiRefreshCw, FiTrash2 } = FiIcons;

const BrandingSettings = () => {
  const [brandingSettings, setBrandingSettings] = useState({
    siteName: 'EduReferral',
    tagline: 'Join our referral program and help students succeed while earning rewards',
    logoUrl: '',
    logoAlt: 'Company Logo',
    faviconUrl: '',
    primaryColor: '#4F46E5', // Indigo 600
    secondaryColor: '#818CF8', // Indigo 400
    footerText: '© 2024 EduReferral. All rights reserved.',
    showTagline: true,
    customFonts: false,
    fontHeading: 'system-ui',
    fontBody: 'system-ui',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [faviconPreview, setFaviconPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchBrandingSettings();
  }, []);

  const fetchBrandingSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('branding_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching branding settings:', error);
        return;
      }

      if (data) {
        // Map the snake_case column names to camelCase for our frontend
        const mappedData = {
          siteName: data.site_name,
          tagline: data.tagline,
          logoUrl: data.logo_url,
          logoAlt: data.logo_alt,
          faviconUrl: data.favicon_url,
          primaryColor: data.primary_color,
          secondaryColor: data.secondary_color,
          footerText: data.footer_text,
          showTagline: data.show_tagline,
          customFonts: data.custom_fonts,
          fontHeading: data.font_heading,
          fontBody: data.font_body,
        };
        
        setBrandingSettings(mappedData);
        
        if (data.logo_url) setLogoPreview(data.logo_url);
        if (data.favicon_url) setFaviconPreview(data.favicon_url);
      }
    } catch (error) {
      console.error('Error fetching branding settings:', error);
      // If the table or row doesn't exist yet, we'll create it when saving
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setBrandingSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaviconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file) => {
    // In a real application, this would upload to a server or cloud storage
    // For this example, we'll just convert to base64 and store it
    if (!file) return null;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const saveBrandingSettings = async () => {
    setLoading(true);
    try {
      let updatedSettings = { ...brandingSettings };

      // Upload logo if changed
      if (logoFile) {
        const logoUrl = await uploadFile(logoFile);
        if (logoUrl) updatedSettings.logoUrl = logoUrl;
      }

      // Upload favicon if changed
      if (faviconFile) {
        const faviconUrl = await uploadFile(faviconFile);
        if (faviconUrl) updatedSettings.faviconUrl = faviconUrl;
      }

      // Convert camelCase to snake_case for Supabase
      const supabaseData = {
        site_name: updatedSettings.siteName,
        tagline: updatedSettings.tagline,
        logo_url: updatedSettings.logoUrl,
        logo_alt: updatedSettings.logoAlt,
        favicon_url: updatedSettings.faviconUrl,
        primary_color: updatedSettings.primaryColor,
        secondary_color: updatedSettings.secondaryColor,
        footer_text: updatedSettings.footerText,
        show_tagline: updatedSettings.showTagline,
        custom_fonts: updatedSettings.customFonts,
        font_heading: updatedSettings.fontHeading,
        font_body: updatedSettings.fontBody,
        updated_at: new Date().toISOString()
      };

      // Check if we need to update or insert
      const { data: existingSettings, error: fetchError } = await supabase
        .from('branding_settings')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing settings:', fetchError);
      }

      let result;
      if (existingSettings) {
        // Update existing record
        result = await supabase
          .from('branding_settings')
          .update(supabaseData)
          .eq('id', existingSettings.id);
      } else {
        // Insert new record
        result = await supabase
          .from('branding_settings')
          .insert([supabaseData]);
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      setBrandingSettings(updatedSettings);
      setSuccessMessage('Branding settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Apply some changes immediately
      document.title = updatedSettings.siteName;

      // Update favicon if changed
      if (faviconFile && updatedSettings.faviconUrl) {
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) favicon.href = updatedSettings.faviconUrl;
      }
    } catch (error) {
      console.error('Error saving branding settings:', error);
      alert('Error saving branding settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all branding settings to default?')) {
      const defaultSettings = {
        siteName: 'EduReferral',
        tagline: 'Join our referral program and help students succeed while earning rewards',
        logoUrl: '',
        logoAlt: 'Company Logo',
        faviconUrl: '',
        primaryColor: '#4F46E5',
        secondaryColor: '#818CF8',
        footerText: '© 2024 EduReferral. All rights reserved.',
        showTagline: true,
        customFonts: false,
        fontHeading: 'system-ui',
        fontBody: 'system-ui',
      };
      setBrandingSettings(defaultSettings);
      setLogoPreview('');
      setFaviconPreview('');
      setLogoFile(null);
      setFaviconFile(null);
    }
  };

  const previewLogo = () => {
    if (logoPreview) {
      return (
        <div className="relative mt-2">
          <img src={logoPreview} alt="Logo preview" className="h-16 object-contain bg-gray-50 border border-gray-200 rounded-lg p-2" />
          <button
            type="button"
            onClick={() => {
              setLogoPreview('');
              setLogoFile(null);
              if (brandingSettings.logoUrl) {
                handleInputChange('logoUrl', '');
              }
            }}
            className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 transition-colors"
          >
            <SafeIcon icon={FiX} className="w-4 h-4" />
          </button>
        </div>
      );
    }
    return null;
  };

  const previewFavicon = () => {
    if (faviconPreview) {
      return (
        <div className="relative mt-2">
          <img src={faviconPreview} alt="Favicon preview" className="h-10 w-10 object-contain bg-gray-50 border border-gray-200 rounded-lg p-1" />
          <button
            type="button"
            onClick={() => {
              setFaviconPreview('');
              setFaviconFile(null);
              if (brandingSettings.faviconUrl) {
                handleInputChange('faviconUrl', '');
              }
            }}
            className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 transition-colors"
          >
            <SafeIcon icon={FiX} className="w-3 h-3" />
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <AdminLayout title="Branding Settings" subtitle="Customize your site's branding and appearance">
      <div className="max-w-7xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"
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
                <h3 className="font-medium text-gray-900">Settings</h3>
              </div>
              <div className="p-2">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                    activeTab === 'general' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <SafeIcon icon={FiSliders} className="w-5 h-5" />
                  <span>General</span>
                </button>
                <button
                  onClick={() => setActiveTab('logo')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                    activeTab === 'logo' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <SafeIcon icon={FiImage} className="w-5 h-5" />
                  <span>Logo & Favicon</span>
                </button>
                <button
                  onClick={() => setActiveTab('colors')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                    activeTab === 'colors' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <SafeIcon icon={FiIcons.FiDroplet} className="w-5 h-5" />
                  <span>Colors</span>
                </button>
                <button
                  onClick={() => setActiveTab('typography')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                    activeTab === 'typography' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <SafeIcon icon={FiIcons.FiType} className="w-5 h-5" />
                  <span>Typography</span>
                </button>
              </div>
              <div className="p-4 mt-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={resetSettings}
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeTab === 'general' && 'General Settings'}
                    {activeTab === 'logo' && 'Logo & Favicon'}
                    {activeTab === 'colors' && 'Color Settings'}
                    {activeTab === 'typography' && 'Typography Settings'}
                  </h2>
                  <button
                    onClick={() => window.open('/', '_blank')}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                  >
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                    Preview Site
                  </button>
                </div>
              </div>
              <div className="p-6">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={brandingSettings.siteName}
                        onChange={(e) => handleInputChange('siteName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        This will appear in the browser tab and in various places throughout the site
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={brandingSettings.tagline}
                        onChange={(e) => handleInputChange('tagline', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        A short description that appears below your site name on the homepage
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Footer Text
                      </label>
                      <input
                        type="text"
                        value={brandingSettings.footerText}
                        onChange={(e) => handleInputChange('footerText', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showTagline"
                        checked={brandingSettings.showTagline}
                        onChange={(e) => handleInputChange('showTagline', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showTagline" className="ml-2 block text-sm text-gray-900">
                        Show tagline on homepage
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === 'logo' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Logo
                      </label>
                      <div className="mt-1 flex items-center space-x-4">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                          <SafeIcon icon={FiUpload} className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Upload Logo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                          />
                        </label>
                      </div>
                      {previewLogo()}
                      <p className="mt-2 text-xs text-gray-500">
                        Recommended size: 200x50 pixels. Max file size: 2MB. Supported formats: JPG, PNG, SVG.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Logo Alt Text
                      </label>
                      <input
                        type="text"
                        value={brandingSettings.logoAlt}
                        onChange={(e) => handleInputChange('logoAlt', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Alternative text for screen readers and SEO
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Favicon
                      </label>
                      <div className="mt-1 flex items-center space-x-4">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                          <SafeIcon icon={FiUpload} className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Upload Favicon</span>
                          <input
                            type="file"
                            accept="image/x-icon,image/png,image/svg+xml"
                            className="hidden"
                            onChange={handleFaviconChange}
                          />
                        </label>
                      </div>
                      {previewFavicon()}
                      <p className="mt-2 text-xs text-gray-500">
                        Recommended size: 32x32 or 64x64 pixels. Supported formats: ICO, PNG, SVG.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'colors' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={brandingSettings.primaryColor}
                          onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                          className="h-10 w-10 rounded border-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={brandingSettings.primaryColor}
                          onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Used for primary buttons, links, and accents
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secondary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={brandingSettings.secondaryColor}
                          onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                          className="h-10 w-10 rounded border-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={brandingSettings.secondaryColor}
                          onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Used for secondary buttons, backgrounds, and highlights
                      </p>
                    </div>
                    <div className="pt-4">
                      <h3 className="text-md font-medium text-gray-700 mb-3">Preview</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className="p-4 rounded-lg text-white"
                          style={{ backgroundColor: brandingSettings.primaryColor }}
                        >
                          Primary Color
                        </div>
                        <div
                          className="p-4 rounded-lg text-white"
                          style={{ backgroundColor: brandingSettings.secondaryColor }}
                        >
                          Secondary Color
                        </div>
                        <div className="col-span-2">
                          <button
                            className="px-4 py-2 rounded-lg text-white"
                            style={{ backgroundColor: brandingSettings.primaryColor }}
                          >
                            Primary Button
                          </button>
                          <button
                            className="px-4 py-2 rounded-lg ml-2 text-white"
                            style={{ backgroundColor: brandingSettings.secondaryColor }}
                          >
                            Secondary Button
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'typography' && (
                  <div className="space-y-6">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="customFonts"
                        checked={brandingSettings.customFonts}
                        onChange={(e) => handleInputChange('customFonts', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="customFonts" className="ml-2 block text-sm text-gray-900">
                        Use custom fonts
                      </label>
                    </div>
                    {brandingSettings.customFonts && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Heading Font
                          </label>
                          <select
                            value={brandingSettings.fontHeading}
                            onChange={(e) => handleInputChange('fontHeading', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="system-ui">System Default</option>
                            <option value="'Roboto',sans-serif">Roboto</option>
                            <option value="'Poppins',sans-serif">Poppins</option>
                            <option value="'Playfair Display',serif">Playfair Display</option>
                            <option value="'Montserrat',sans-serif">Montserrat</option>
                            <option value="'Open Sans',sans-serif">Open Sans</option>
                            <option value="'Lato',sans-serif">Lato</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Body Font
                          </label>
                          <select
                            value={brandingSettings.fontBody}
                            onChange={(e) => handleInputChange('fontBody', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="system-ui">System Default</option>
                            <option value="'Roboto',sans-serif">Roboto</option>
                            <option value="'Poppins',sans-serif">Poppins</option>
                            <option value="'Open Sans',sans-serif">Open Sans</option>
                            <option value="'Lato',sans-serif">Lato</option>
                            <option value="'Source Sans Pro',sans-serif">Source Sans Pro</option>
                            <option value="'Nunito',sans-serif">Nunito</option>
                          </select>
                        </div>
                      </>
                    )}
                    <div className="pt-4">
                      <h3 className="text-md font-medium text-gray-700 mb-3">Typography Preview</h3>
                      <div className="p-6 bg-gray-50 rounded-lg">
                        <h1
                          className="text-3xl font-bold mb-3"
                          style={{
                            fontFamily: brandingSettings.customFonts
                              ? brandingSettings.fontHeading
                              : 'inherit',
                          }}
                        >
                          This is a Heading 1
                        </h1>
                        <h2
                          className="text-2xl font-bold mb-3"
                          style={{
                            fontFamily: brandingSettings.customFonts
                              ? brandingSettings.fontHeading
                              : 'inherit',
                          }}
                        >
                          This is a Heading 2
                        </h2>
                        <p
                          className="mb-3"
                          style={{
                            fontFamily: brandingSettings.customFonts
                              ? brandingSettings.fontBody
                              : 'inherit',
                          }}
                        >
                          This is a paragraph with body text. The quick brown fox jumps over the lazy dog.
                        </p>
                        <a
                          href="#"
                          className="font-medium"
                          style={{
                            color: brandingSettings.primaryColor,
                            fontFamily: brandingSettings.customFonts
                              ? brandingSettings.fontBody
                              : 'inherit',
                          }}
                        >
                          This is a link
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={resetSettings}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={saveBrandingSettings}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiSave} className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6">
              <h3 className="text-sm font-medium text-blue-800 mb-2">About Branding Settings</h3>
              <p className="text-sm text-blue-700">
                These settings control the appearance of your site. Changes to the logo and colors will be reflected throughout the site. Some changes may require a page refresh to take effect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BrandingSettings;