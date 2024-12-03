import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface PageTitleProps {
  title: string;
  subtitle?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle }) => {
  const { isDark } = useTheme();
  
  return (
    <div className="mb-8">
      <h1 className={`text-2xl font-inter tracking-widest mb-2 ${
        isDark ? 'text-white' : 'text-zinc-900'
      }`}>
        {title.toUpperCase()}
      </h1>
      {subtitle && (
        <p className="text-sm text-zinc-400 font-inter tracking-wider capitalize">
          {subtitle.toLowerCase()}
        </p>
      )}
    </div>
  );
};

export default PageTitle;