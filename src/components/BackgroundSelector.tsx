import React, { useState, useEffect } from 'react';
import { X, Loader2, Lock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getTemplates, Template } from '../services/api/templates';
import toast from 'react-hot-toast';

interface BackgroundSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (background: string) => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ isOpen, onClose, onSelect }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const data = await getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const handleTemplateSelect = (template: Template) => {
    if (template.premium && (!user?.plan || user.plan === 'Free')) {
      toast.error('Please upgrade your plan to access premium backgrounds');
      return;
    }
    onSelect(template.image);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-montserrat">Select Background</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`group relative aspect-video rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  template.premium && (!user?.plan || user.plan === 'Free')
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
              >
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center ${
                  template.premium && (!user?.plan || user.plan === 'Free')
                    ? 'opacity-100 bg-black/60'
                    : ''
                }`}>
                  {template.premium && (!user?.plan || user.plan === 'Free') ? (
                    <div className="text-center">
                      <Lock className="w-6 h-6 text-white/80 mx-auto mb-2" />
                      <span className="text-white/80 text-sm">Premium Only</span>
                    </div>
                  ) : (
                    <span className="text-white text-sm font-inter">{template.name}</span>
                  )}
                </div>
                {template.premium && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500/90 text-white text-xs rounded-full">
                    Premium
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundSelector;