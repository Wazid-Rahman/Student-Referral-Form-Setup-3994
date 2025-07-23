import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnBoarding } from '@questlabs/react-sdk';
import { useAuth } from '../context/AuthContext';
import questConfig from '../config/questConfig';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowRight } = FiIcons;

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [answers, setAnswers] = useState({});

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left: Progress Section */}
        <div className="md:w-1/2 bg-indigo-600 p-12 text-white flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-6">Let's Get Started!</h1>
          <p className="text-indigo-200 mb-8">
            Complete your profile to personalize your learning experience.
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <SafeIcon icon={FiArrowRight} className="w-6 h-6 text-indigo-300" />
              <div>
                <h3 className="font-medium">Tell us about yourself</h3>
                <p className="text-sm text-indigo-200">Help us understand your goals</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right: Onboarding Component */}
        <div className="md:w-1/2 p-12">
          <OnBoarding
            userId={user?.userId}
            token={user?.token}
            questId={questConfig.QUEST_ONBOARDING_QUESTID}
            answer={answers}
            setAnswer={setAnswers}
            getAnswers={handleComplete}
            accent="#4F46E5"
          >
            <OnBoarding.Header />
            <OnBoarding.Content />
            <OnBoarding.Footer />
          </OnBoarding>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;