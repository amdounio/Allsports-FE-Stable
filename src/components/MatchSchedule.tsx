import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { Match } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface MatchScheduleProps {
  matches: Match[];
  selectedMatches: string[];
  onMatchSelect: (matchId: string) => void;
  loading?: boolean;
  currentDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
  generatedCount: number;
}

const MatchSchedule: React.FC<MatchScheduleProps> = ({
  matches,
  selectedMatches,
  onMatchSelect,
  loading = false,
  currentDate,
  onPreviousDay,
  onNextDay,
  generatedCount
}) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const freePlanLimit = Number(import.meta.env.VITE_FREE_PLAN_LIMIT) || 3;
  const isLimitReached = user?.plan === 'Free' && generatedCount >= freePlanLimit;

  const formatMatchTime = (match: Match): string => {
    if (match.time) return match.time;
    if (match.startDate) {
      return format(new Date(match.startDate), 'HH:mm');
    }
    return '--:--';
  };

  if (loading) {
    return (
      <div className={`rounded-[30px] overflow-hidden ${isDark ? 'bg-zinc-900/30' : 'bg-white'} p-8`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-[30px] overflow-hidden ${isDark ? 'bg-zinc-900/30' : 'bg-white'}`}>
      <div className={`flex items-center justify-between px-8 py-4 border-b ${isDark ? 'border-zinc-800/20' : 'border-zinc-100'}`}>
        <button 
          onClick={onPreviousDay}
          className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-zinc-100'}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-montserrat tracking-widest">
          {format(currentDate, 'EEEE d MMMM', { locale: fr }).toUpperCase()}
        </h2>
        <button 
          onClick={onNextDay}
          className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-zinc-100'}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {isLimitReached && (
        <div className="px-8 py-4 bg-amber-500/10 text-amber-500 text-sm flex items-center gap-2">
          <Lock className="w-4 h-4" />
          <span>You have reached your monthly limit of {freePlanLimit} visuals. Please upgrade your plan to generate more.</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-[1px] divide-zinc-800/20">
        {matches.length > 0 ? (
          matches.map((match) => (
            <div
              key={match.id}
              className={`relative group ${
                selectedMatches.includes(match.id) 
                  ? isDark ? 'bg-zinc-800/20' : 'bg-zinc-50'
                  : ''
              }`}
            >
              <button
                onClick={() => !isLimitReached && onMatchSelect(match.id)}
                disabled={isLimitReached}
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border transition-colors ${
                  selectedMatches.includes(match.id)
                    ? 'border-white bg-white'
                    : isDark 
                      ? 'border-zinc-700 group-hover:border-zinc-500'
                      : 'border-zinc-300 group-hover:border-zinc-400'
                } ${isLimitReached ? 'cursor-not-allowed opacity-50' : ''}`}
              />
              <div className={`flex items-center justify-between px-12 py-4 ${isLimitReached ? 'opacity-50' : ''}`}>
                <div className="flex items-center space-x-3 min-w-[120px]">
                  <img 
                    src={match.firstTeam?.logo || match.homeTeamLogo} 
                    alt={match.firstTeam?.name || match.homeTeam} 
                    className="w-5 h-5 object-contain"
                  />
                  <span className="text-sm font-inter">
                    {match.firstTeam?.name || match.homeTeam}
                  </span>
                </div>
                <div className="flex flex-col items-center px-4">
                  <span className={`text-xs ${isDark ? 'text-zinc-600' : 'text-zinc-400'} font-inter`}>
                    {formatMatchTime(match)}
                  </span>
                </div>
                <div className="flex items-center space-x-3 min-w-[120px] justify-end">
                  <span className="text-sm font-inter">
                    {match.secondTeam?.name || match.awayTeam}
                  </span>
                  <img 
                    src={match.secondTeam?.logo || match.awayTeamLogo} 
                    alt={match.secondTeam?.name || match.awayTeam} 
                    className="w-5 h-5 object-contain"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 flex items-center justify-center h-32 text-zinc-500 font-inter">
            No matches scheduled for this date
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchSchedule;