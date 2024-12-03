import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import AuthLayout from '../components/AuthLayout';
import AccountForm, { AccountFormData } from '../components/forms/AccountForm';
import BusinessForm, { BusinessFormData } from '../components/forms/BusinessForm';
import SubscriptionForm from '../components/forms/SubscriptionForm';
import { api } from '../services/api';
import { subscribeToPlan } from '../services/api/payment';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const { signup } = useAuth();
  const [currentStep, setCurrentStep] = useState(location.search.includes('social=true') ? 2 : 1);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
    }
  };

  const handleGoogleSignUp = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google?redirect=/signup?social=true`;
  };

  const handleAppleSignUp = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/apple?redirect=/signup?social=true`;
  };

  const handleAccountSubmit = async (data: AccountFormData) => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await signup({
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        password: data.password,
        acceptLegalPolicy: data.acceptLegalPolicy
      });

      if (response.newUser) {
        setUserId(response.user.id);
        setCurrentStep(2);
      } else {
        setError('An account with this email already exists');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessSubmit = async (data: BusinessFormData) => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('id', userId.toString());
      formData.append('businessName', data.businessName);
      formData.append('businessType', data.businessType);
      formData.append('address', data.address);
      formData.append('phone', data.phone);
      formData.append('raisonSociale', data.raisonSociale);
      if (logo) {
        formData.append('logo', logo);
      }

      const response = await api.put('/api/edit-info', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update stored user data with new business information
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      setCurrentStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update business information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscriptionSubmit = async (planId: string) => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError('');
      
      const response = await subscribeToPlan(userId, planId, true);

      if (response.url) {
        window.location.href = response.url;
      } else if (planId === 'free') {
        navigate('/');
      } else {
        throw new Error('Invalid payment URL received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process subscription. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/login');
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <>
          <AccountForm
            onSubmit={handleAccountSubmit}
            onBack={handleBack}
            isLoading={isLoading}
            error={error}
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-zinc-500">Or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleAppleSignUp}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white hover:bg-zinc-900 transition-colors"
            >
              <img src="/apple-logo.svg" alt="Apple" className="w-5 h-5" />
              <span>Sign up with Apple</span>
            </button>
            <button
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white hover:bg-zinc-900 transition-colors"
            >
              <img src="/google-logo.svg" alt="Google" className="w-5 h-5" />
              <span>Sign up with Google</span>
            </button>
          </div>
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm text-zinc-400">Your business logo* :</label>
            <div className="flex items-center space-x-4">
              <p className="text-xs text-zinc-500">
                Select a PNG file<br />
                recommended size 1000px*1000px
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
              >
                Choisir
              </button>
            </div>
          </div>

          <BusinessForm
            onSubmit={handleBusinessSubmit}
            onBack={handleBack}
            isLoading={isLoading}
            error={error}
          />
        </div>
      );
    }

    return (
      <SubscriptionForm
        onSubmit={handleSubscriptionSubmit}
        onBack={handleBack}
        isLoading={isLoading}
        error={error}
      />
    );
  };

  return (
    <AuthLayout variant={currentStep === 3 ? 'tall' : 'medium'}>
      <div className="flex-1 flex flex-col">
        <div className={`${currentStep === 3 ? 'w-full' : 'max-w-md'} mx-auto p-8`}>
          {/* Logo */}
          <img 
            src={isDark 
              ? "https://2points.fr/allsports/wp-content/uploads/2024/06/Logo-All-Sports.png"
              : "https://2points.fr/allsports/wp-content/uploads/2024/11/allsportb.webp"
            }
            alt="AM Sports" 
            className="w-24 h-auto mb-8"
          />

          {/* Title */}
          <h1 className="text-3xl font-bold tracking-wider text-white mb-2">
            {currentStep === 1 ? 'CREATE AN ACCOUNT' : 
             currentStep === 2 ? 'BUSINESS INFORMATION' :
             'CHOOSE YOUR PLAN'}
          </h1>
          <p className="text-zinc-400 mb-6">
            {currentStep === 1 ? "Let's get started with your account setup" :
             currentStep === 2 ? "Describe yourself as clearly so that there are no mistakes" :
             "Select a plan that fits your needs"}
          </p>

          {/* Forms */}
          {renderStepContent()}
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;