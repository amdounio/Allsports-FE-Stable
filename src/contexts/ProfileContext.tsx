import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Profile {
  name: string;
  username: string;
  company: string;
  address: string;
  email: string;
  phone: string;
  language: string;
  avatar: string;
  isPremium: boolean;
}

interface ProfileContextType {
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => void;
  updateAvatar: (imageData: string) => void;
}

const STORAGE_KEY = 'am-sports-profile';

const defaultProfile: Profile = {
  name: 'Paul Alexandre',
  username: 'Nomad',
  company: 'Chicha',
  address: '75 rue de Wazemmes - 59000 Lille',
  email: 'paul@all-sports.co',
  phone: '06.59.40.45.14',
  language: 'fr',
  avatar: '/logo.svg',
  isPremium: true,
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updateAvatar = (imageData: string) => {
    updateProfile({ avatar: imageData });
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, updateAvatar }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};