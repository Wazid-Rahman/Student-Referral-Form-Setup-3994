import React, { createContext, useState, useContext, useEffect } from 'react';
import supabase from '../lib/supabase';

const BrandingContext = createContext(null);

export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState({
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
  const [loading, setLoading] = useState(true);

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

      if (error) {
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
        
        setBranding(mappedData);
        
        // Update document title
        document.title = mappedData.siteName;
        
        // Update favicon if defined
        if (mappedData.faviconUrl) {
          const favicon = document.querySelector('link[rel="icon"]');
          if (favicon) favicon.href = mappedData.faviconUrl;
        }
      }
    } catch (error) {
      console.error('Error in branding provider:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply CSS variables for colors
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', branding.primaryColor);
    root.style.setProperty('--secondary-color', branding.secondaryColor);

    if (branding.customFonts) {
      root.style.setProperty('--font-heading', branding.fontHeading);
      root.style.setProperty('--font-body', branding.fontBody);
    } else {
      root.style.removeProperty('--font-heading');
      root.style.removeProperty('--font-body');
    }
  }, [branding]);

  return (
    <BrandingContext.Provider value={{
      branding,
      loading,
      refreshBranding: fetchBrandingSettings
    }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};