import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { GB, FR, ES } from 'country-flag-icons/react/3x2';
import { updateUserInfo } from '../services/api';
import PaymentMethods from '../components/PaymentMethods';
import toast from 'react-hot-toast';

const BUSINESS_TYPES = ['Bar', 'Chicha', 'Restaurant'];

const Profile = () => {
  const { profile, updateProfile, updateAvatar } = useProfile();
  const { user, setUser } = useAuth();
  const { isDark } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTypeSelect, setShowTypeSelect] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editableFields, setEditableFields] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    company: user?.businessName || '',
    address: user?.adresse || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [editingField, setEditingField] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user?.id) {
      try {
        const formData = new FormData();
        formData.append('id', user.id.toString());
        formData.append('logo', file);
        
        const response = await updateUserInfo(formData);
        if (response.status === 'success') {
          const reader = new FileReader();
          reader.onloadend = () => {
            updateAvatar(reader.result as string);
          };
          reader.readAsDataURL(file);
          toast.success('Logo updated successfully');
        }
      } catch (error) {
        console.error('Error updating logo:', error);
        toast.error('Failed to update logo');
      }
    }
  };

  const handleEdit = (fieldName: string) => {
    setEditingField(fieldName);
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error('User ID not found');
      return;
    }

    try {
      setIsSaving(true);

      const updateData = {
        id: user.id,
        firstName: editableFields.firstName,
        lastName: editableFields.lastName,
        businessName: editableFields.company,
        adresse: editableFields.address,
        email: editableFields.email,
        phone: editableFields.phone
      };

      const response = await updateUserInfo(updateData);

      if (response.status === 'success') {
        setUser(response.user);
        updateProfile({
          name: `${editableFields.firstName} ${editableFields.lastName}`,
          username: editableFields.company,
          address: editableFields.address,
          email: editableFields.email,
          phone: editableFields.phone
        });
        setEditingField(null);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (fieldName: string) => {
    setEditableFields(prev => ({
      ...prev,
      [fieldName]: fieldName === 'firstName' ? user?.firstName || '' :
                   fieldName === 'lastName' ? user?.lastName || '' :
                   fieldName === 'company' ? user?.businessName || '' :
                   fieldName === 'address' ? user?.adresse || '' :
                   fieldName === 'email' ? user?.email || '' :
                   fieldName === 'phone' ? user?.phone || '' : ''
    }));
    setEditingField(null);
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setEditableFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const EditableField = ({ 
    label, 
    fieldName,
    value,
    type = 'text'
  }: { 
    label: string;
    fieldName: string;
    value: string;
    type?: 'text' | 'select';
  }) => (
    <div className="flex items-center justify-between group">
      <div className="flex-1">
        <div className="flex items-baseline justify-between">
          <span className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>{label}</span>
        </div>
        {type === 'select' ? (
          <div className="relative">
            <button
              onClick={() => setShowTypeSelect(!showTypeSelect)}
              className={`flex items-center justify-between w-full text-left text-base mt-1 py-0.5 ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}
            >
              <span>{value}</span>
            </button>
            {showTypeSelect && (
              <div className={`absolute top-full left-0 mt-1 w-full ${
                isDark ? 'bg-zinc-800' : 'bg-white'
              } rounded-lg shadow-lg overflow-hidden z-10`}>
                {BUSINESS_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      handleFieldChange('company', type);
                      setShowTypeSelect(false);
                    }}
                    className={`w-full px-4 py-2 text-left ${
                      isDark 
                        ? 'hover:bg-zinc-700 text-white' 
                        : 'hover:bg-zinc-100 text-zinc-900'
                    } transition-colors`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : editingField === fieldName ? (
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={editableFields[fieldName as keyof typeof editableFields]}
              onChange={(e) => handleFieldChange(fieldName, e.target.value)}
              className={`flex-1 bg-transparent border-b ${isDark ? 'border-zinc-700' : 'border-zinc-300'} focus:outline-none ${isDark ? 'text-white' : 'text-zinc-900'}`}
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`p-1 ${isDark ? 'text-white hover:text-zinc-300' : 'text-black hover:text-zinc-600'} ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleCancel(fieldName)}
              className={`p-1 ${isDark ? 'text-white hover:text-zinc-300' : 'text-black hover:text-zinc-600'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleEdit(fieldName)}
            className={`text-left w-full text-base mt-1 ${isDark ? 'text-white hover:text-zinc-300' : 'text-zinc-900 hover:text-zinc-600'}`}
          >
            {value}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-2xl font-inter tracking-widest mb-1 ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>PROFILE</h1>
            <p className="text-sm text-zinc-400 tracking-wider font-inter">Account info</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            type="button"
            className={`px-8 py-2 ${
              isDark 
                ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
            } rounded-full transition-colors ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="space-y-4">
          {/* Profile Header */}
          <div className={`${
            isDark ? 'bg-zinc-900/30' : 'bg-white'
          } rounded-[30px] p-8 transition-colors duration-200`}>
            <div className="flex items-center gap-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-black/10 flex items-center justify-center">
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <div className="mt-2 flex flex-col items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`text-[10px] ${
                      isDark 
                        ? 'bg-zinc-800 hover:bg-zinc-700' 
                        : 'bg-zinc-100 hover:bg-zinc-200'
                    } px-3 py-1 rounded-full transition-colors`}
                  >
                    Change logo
                  </button>
                  <p className="text-[9px] text-zinc-500 text-center">Recommended format: PNG transparent</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <div>
                <h2 className={`text-2xl mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {editableFields.company}
                </h2>
                <p className="text-zinc-400">{`${editableFields.firstName} ${editableFields.lastName}`}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-xs">
                    {user?.plan || 'Free'}
                  </span>
                  <Link 
                    to="/pricing"
                    className="text-xs text-white hover:underline transition-colors"
                  >
                    {user?.plan === 'Free' ? 'Upgrade to Premium' : 'Change Plan'}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className={`${
            isDark ? 'bg-zinc-900/30' : 'bg-white'
          } rounded-[30px] p-6 transition-colors duration-200`}>
            <div className="space-y-6">
              {/* Public Profile Section */}
              <div>
                <h3 className={`text-lg mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Public profile
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <EditableField
                    label="First Name"
                    fieldName="firstName"
                    value={editableFields.firstName}
                  />
                  <EditableField
                    label="Last Name"
                    fieldName="lastName"
                    value={editableFields.lastName}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className={`border-t ${isDark ? 'border-zinc-800/50' : 'border-zinc-200'}`}></div>

              {/* Business Profile Section */}
              <div>
                <h3 className={`text-lg mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Business profile
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <EditableField
                    label="Company"
                    fieldName="company"
                    value={editableFields.company}
                  />
                  <EditableField
                    label="Type"
                    fieldName="type"
                    value={user?.buisnessType || ''}
                    type="select"
                  />
                  <EditableField
                    label="Address"
                    fieldName="address"
                    value={editableFields.address}
                  />
                  <EditableField
                    label="Email"
                    fieldName="email"
                    value={editableFields.email}
                  />
                  <EditableField
                    label="Phone"
                    fieldName="phone"
                    value={editableFields.phone}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className={`border-t ${isDark ? 'border-zinc-800/50' : 'border-zinc-200'}`}></div>

              {/* Language Section */}
              <div className="flex items-center justify-between">
                <h3 className={`text-lg ${isDark ? 'text-white' : 'text-zinc-900'}`}>Language</h3>
                <div className="flex gap-4">
                  {[
                    { code: 'fr', label: 'Français', flag: FR },
                    { code: 'en', label: 'English', flag: GB },
                    { code: 'es', label: 'Español', flag: ES }
                  ].map(({ code, label, flag: Flag }) => (
                    <button
                      key={code}
                      onClick={() => updateProfile({ language: code })}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                        ${profile.language === code 
                          ? isDark 
                            ? 'bg-zinc-800 text-white' 
                            : 'bg-zinc-100 text-zinc-900'
                          : isDark
                            ? 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                            : 'bg-white text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900'
                        }
                      `}
                    >
                      <Flag className="w-4 h-4 rounded-sm" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className={`${isDark ? 'bg-zinc-900/30' : 'bg-white'} rounded-[30px] p-6 transition-colors duration-200`}>
            <PaymentMethods />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;