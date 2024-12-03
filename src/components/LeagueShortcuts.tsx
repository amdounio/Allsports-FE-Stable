import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const LEAGUES = [
  { id: 61, title: 'Ligue 1', logo: 'https://media.api-sports.io/football/leagues/61.png' },
  { id: 39, title: 'Premier League', logo: 'https://media.api-sports.io/football/leagues/39.png' },
  { id: 140, title: 'La Liga', logo: 'https://media.api-sports.io/football/leagues/140.png' },
  { id: 78, title: 'Bundesliga', logo: 'https://media.api-sports.io/football/leagues/78.png' },
  { id: 135, title: 'Serie A', logo: 'https://media.api-sports.io/football/leagues/135.png' },
  { id: 94, title: 'Primeira Liga', logo: 'https://media.api-sports.io/football/leagues/94.png' },
  { id: 88, title: 'Eredivisie', logo: 'https://media.api-sports.io/football/leagues/88.png' },
  { id: 144, title: 'Jupiler Pro League', logo: 'https://media.api-sports.io/football/leagues/144.png' },
  { id: 2, title: 'Champions League', logo: 'https://media.api-sports.io/football/leagues/2.png' },
  { id: 3, title: 'Europa League', logo: 'https://media.api-sports.io/football/leagues/3.png' }
];

interface LeagueShortcutsProps {
  currentLeagueId?: string;
}

const LeagueShortcuts: React.FC<LeagueShortcutsProps> = ({ currentLeagueId }) => {
  const navigate = useNavigate();
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
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-none scroll-smooth mx-8"
      >
        {LEAGUES.map((league) => (
          <button
            key={league.id}
            onClick={() => navigate(`/create/football/${league.id}`)}
            className={`
              flex items-center gap-3 px-6 py-3 rounded-full 
              transition-all duration-200 whitespace-nowrap flex-shrink-0
              ${league.id.toString() === currentLeagueId
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
            <img 
              src={league.logo} 
              alt={league.title}
              className="w-5 h-5 object-contain"
            />
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

export default LeagueShortcuts;