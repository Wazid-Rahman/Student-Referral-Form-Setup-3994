import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';

const FormSection = ({ title, icon, children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`space-y-6 ${className}`}
    >
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
          <SafeIcon icon={icon} className="w-4 h-4 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
};

export default FormSection;