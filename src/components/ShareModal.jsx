import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiCopy, FiCheck, FiShare2, FiMail, FiMessageSquare, FiPhone, FiFacebook, FiTwitter, FiLinkedin, FiInstagram } = FiIcons;

const ShareModal = ({ isOpen, onClose, generateLink }) => {
  const [affiliateLink, setAffiliateLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('link');

  const handleGenerateLink = () => {
    const link = generateLink();
    setAffiliateLink(link);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(affiliateLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareMessage = "🎓 Help your student excel! I found this amazing educational program that offers SAT/ACT prep, AP subjects, and college essay writing. Check it out:";

  const sharingOptions = [
    {
      name: 'Email',
      icon: FiMail,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => {
        const subject = encodeURIComponent('Educational Program Referral');
        const body = encodeURIComponent(`${shareMessage}\n\n${affiliateLink}\n\nThis program has helped many students achieve their academic goals!`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
      }
    },
    {
      name: 'WhatsApp',
      icon: FiMessageSquare,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => {
        const text = encodeURIComponent(`${shareMessage} ${affiliateLink}`);
        window.open(`https://wa.me/?text=${text}`);
      }
    },
    {
      name: 'SMS',
      icon: FiPhone,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => {
        const text = encodeURIComponent(`${shareMessage} ${affiliateLink}`);
        window.open(`sms:?body=${text}`);
      }
    },
    {
      name: 'Facebook',
      icon: FiFacebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => {
        const url = encodeURIComponent(affiliateLink);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
      }
    },
    {
      name: 'Twitter',
      icon: FiTwitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      action: () => {
        const text = encodeURIComponent(`${shareMessage} ${affiliateLink}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`);
      }
    },
    {
      name: 'LinkedIn',
      icon: FiLinkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      action: () => {
        const url = encodeURIComponent(affiliateLink);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`);
      }
    }
  ];

  const copyTemplates = [
    {
      name: 'Parent Network',
      template: `🎓 Attention Parents! I wanted to share this incredible educational program that's helping students excel in:

• SAT/ACT Preparation
• AP Subjects
• College Essay Writing
• PSAT Prep

The results speak for themselves - students are seeing significant score improvements and getting into their dream colleges!

Check it out: ${affiliateLink}

Feel free to reach out if you have any questions! 📚✨`
    },
    {
      name: 'Student Groups',
      template: `📚 Hey everyone! Found this amazing program that's been a game-changer for test prep and college applications:

✅ Personalized SAT/ACT coaching
✅ AP subject mastery
✅ College essay guidance
✅ Proven results

Perfect for juniors and seniors looking to boost their scores!

Link: ${affiliateLink}

DM me if you want to know more! 🚀`
    },
    {
      name: 'Social Media',
      template: `🎯 Ready to unlock your academic potential?

This program offers:
• Expert SAT/ACT prep
• AP subject tutoring
• College essay coaching
• Personalized learning plans

Join thousands of students who've already improved their scores!

Get started: ${affiliateLink}

#Education #SAT #ACT #CollegePrep #AcademicSuccess`
    },
    {
      name: 'School Community',
      template: `📢 School Community Notice

We're excited to share information about an educational program that's making a real difference for our students:

🔹 Comprehensive test preparation (SAT/ACT/PSAT)
🔹 Advanced Placement subject support
🔹 College application essay assistance
🔹 Individualized learning approach

Many families in our community have seen excellent results.

Learn more: ${affiliateLink}

Questions? Feel free to reach out!`
    }
  ];

  const handleCopyTemplate = async (template) => {
    try {
      await navigator.clipboard.writeText(template);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy template:', err);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      handleGenerateLink();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiShare2} className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Share Referral Link</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('link')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'link'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Quick Share
              </button>
              <button
                onClick={() => setActiveTab('platforms')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'platforms'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Social Platforms
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'templates'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Message Templates
              </button>
            </div>

            <div className="p-6 max-h-[500px] overflow-y-auto">
              {activeTab === 'link' && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Copy and share this link to track referrals and earn rewards.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={affiliateLink}
                        readOnly
                        className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 font-mono"
                      />
                      <button
                        onClick={handleCopyLink}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          copied
                            ? 'bg-green-100 text-green-700'
                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        }`}
                      >
                        <SafeIcon icon={copied ? FiCheck : FiCopy} className="w-4 h-4" />
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Share this link with potential referrals</li>
                      <li>• When they fill out the form, you'll get credit</li>
                      <li>• Track your referrals and earn rewards</li>
                      <li>• Use the templates tab for ready-made messages</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'platforms' && (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">
                    Share directly to your favorite platforms with one click.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {sharingOptions.map((option) => (
                      <motion.button
                        key={option.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={option.action}
                        className={`${option.color} text-white p-4 rounded-lg transition-colors flex flex-col items-center gap-2`}
                      >
                        <SafeIcon icon={option.icon} className="w-6 h-6" />
                        <span className="text-sm font-medium">{option.name}</span>
                      </motion.button>
                    ))}
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 mt-4">
                    <h3 className="font-semibold text-amber-900 mb-2">💡 Pro Tips:</h3>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• Email works best for parents and educators</li>
                      <li>• WhatsApp is great for quick personal shares</li>
                      <li>• Social media reaches a broader audience</li>
                      <li>• SMS is perfect for immediate contacts</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'templates' && (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">
                    Ready-made messages for different audiences. Click to copy and customize.
                  </p>
                  <div className="space-y-4">
                    {copyTemplates.map((template, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{template.name}</h3>
                          <button
                            onClick={() => handleCopyTemplate(template.template)}
                            className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm"
                          >
                            <SafeIcon icon={copied ? FiCheck : FiCopy} className="w-4 h-4" />
                            {copied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                            {template.template}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">✅ Best Practices:</h3>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Personalize the message with your own experience</li>
                      <li>• Share success stories when possible</li>
                      <li>• Be genuine about why you're recommending it</li>
                      <li>• Follow up with interested contacts</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleGenerateLink}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Generate New Link
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;