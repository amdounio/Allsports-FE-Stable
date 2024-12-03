import React, { useState } from 'react';
import { Match } from '../types';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface MatchVisualProps {
  match: Match;
  variant: 'story' | 'square';
  generatedVisuals?: { story: string; square: string; view: string } | null;
  typography?: string;
  background?: string;
  isGenerating?: boolean;
}

const MatchVisual: React.FC<MatchVisualProps> = ({
  match,
  variant,
  generatedVisuals,
  typography = 'font-montserrat',
  background = '',
  isGenerating = false
}) => {
  const { isDark } = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get the appropriate image URL based on variant
  const imageUrl = generatedVisuals?.[variant];

  // Only show loading when generating or when we have a URL but image hasn't loaded
  const showLoading = isGenerating || (imageUrl && !imageLoaded);

  // Show placeholder when no visuals are available
  if (!imageUrl && !isGenerating) {
    return (
      <div className={`${
        variant === 'story' ? 'aspect-[9/16]' : 'aspect-square'
      } w-full h-full rounded-xl overflow-hidden ${
        isDark ? 'bg-zinc-900/30' : 'bg-white'
      } flex items-center justify-center text-zinc-500`}>
        No visual available
      </div>
    );
  }

  return (
    <div className={`${
      variant === 'story' ? 'aspect-[9/16]' : 'aspect-square'
    } w-full h-full rounded-xl overflow-hidden ${
      isDark ? 'bg-zinc-900/30' : 'bg-white'
    } relative`}>
      {/* Generated Image */}
      {imageUrl && (
        <img 
          src={imageUrl}
          alt={`${variant} format`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      )}

      {/* Loading Overlay */}
      {showLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-zinc-900/30">
          <div className="relative">
            {isGenerating ? (
              <Loader2 className="w-12 h-12 animate-spin text-white" />
            ) : (
              <ImageIcon className="w-12 h-12 text-white animate-pulse" />
            )}
          </div>

          <div className="space-y-1 text-center">
            <div className="text-base font-medium text-white/90">
              {isGenerating ? 'Generating visual...' : 'Loading image...'}
            </div>
            <div className="text-sm text-white/60">
              {isGenerating ? 'This may take a few seconds' : 'Almost there...'}
            </div>
          </div>

          {/* Match Info */}
          <div className="flex items-center gap-6 mt-2">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 p-1.5 flex items-center justify-center">
                <img 
                  src={match.homeTeamLogo} 
                  alt={match.homeTeam}
                  className="w-8 h-8 object-contain opacity-50"
                />
              </div>
              <span className="text-xs text-white/60">{match.homeTeam}</span>
            </div>

            <span className="text-base font-medium text-white/60">VS</span>

            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 p-1.5 flex items-center justify-center">
                <img 
                  src={match.awayTeamLogo} 
                  alt={match.awayTeam}
                  className="w-8 h-8 object-contain opacity-50"
                />
              </div>
              <span className="text-xs text-white/60">{match.awayTeam}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchVisual;