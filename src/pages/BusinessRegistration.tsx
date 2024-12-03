import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';

const BUSINESS_TYPES = ['Bar', 'Restaurant', 'Chicha', 'Club', 'Pub'];

const BusinessRegistration = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [socialId, setSocialId] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    navigate('/pricing');
  };

  return (
    <AuthLayout variant="medium">
      <div className="flex-1 p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <img src="/logo.svg" alt="AM Sports" className="w-12 h-12 mb-8" />

          {/* Title */}
          <h1 className="text-3xl font-bold tracking-wider text-white mb-2">CREATE AN ACCOUNT</h1>
          <p className="text-zinc-400 mb-6">Describe yourself as clearly so that there are no mistakes.</p>

          {/* Form */}
          <form className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="block text-sm text-zinc-400">Your business logo* :</label>
              <div className="flex items-center space-x-4">
                <p className="text-xs text-zinc-500">Select a PNG file<br />recommended size 1000px*1000px</p>
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

            {/* Business Details */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-left text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {businessType || 'Select type of business'}
                </button>
                {showTypeDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-black border border-zinc-800 rounded-lg shadow-lg">
                    {BUSINESS_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setBusinessType(type);
                          setShowTypeDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-white hover:bg-zinc-800 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Raison Sociale"
                value={socialId}
                onChange={(e) => setSocialId(e.target.value)}
                className="bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-8 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default BusinessRegistration;