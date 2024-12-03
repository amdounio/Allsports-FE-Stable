import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface League {
  id: number;
  title: string;
  country: string;
  image?: string;
}

interface LeagueSelectorProps {
  leagues: League[];
  currentLeagueId: number;
  onLeagueSelect: (leagueId: number) => void;
}

const LeagueSelector: React.FC<LeagueSelectorProps> = ({
  leagues,
  currentLeagueId,
  onLeagueSelect,
}) => {
  const { isDark } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth / 2;
      const newScrollLeft = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <button
        onClick={() => scroll('left')}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full 
          ${isDark ? 'bg-zinc-900/80 hover:bg-zinc-800' : 'bg-white/80 hover:bg-zinc-100'}
          opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-x-1/2
          shadow-lg backdrop-blur-sm`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* League Buttons Container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-4 scrollbar-none scroll-smooth mx-8"
      >
        {leagues.map((league) => (
          <button
            key={league.id}
            onClick={() => onLeagueSelect(league.id)}
            className={`
              flex items-center gap-3 px-6 py-3 rounded-full 
              transition-all duration-200 whitespace-nowrap flex-shrink-0
              ${currentLeagueId === league.id
                ? isDark 
                  ? 'bg-white text-black'
                  : 'bg-black text-white'
                : isDark 
                  ? 'bg-zinc-900/30 text-white hover:bg-white hover:text-black'
                  : 'bg-zinc-100 text-black hover:bg-black hover:text-white'
              }
              transform hover:scale-105 active:scale-95
            `}
          >
            {league.image && (
              <img 
                src={league.image} 
                alt={`${league.title} logo`} 
                className="w-5 h-5 object-contain"
              />
            )}
            <span className="text-sm font-medium">{league.title}</span>
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full 
          ${isDark ? 'bg-zinc-900/80 hover:bg-zinc-800' : 'bg-white/80 hover:bg-zinc-100'}
          opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-x-1/2
          shadow-lg backdrop-blur-sm`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default LeagueSelector;