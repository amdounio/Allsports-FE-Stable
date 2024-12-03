import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const SPORTS = [
  { id: 'football', name: 'Football', enabled: true },
  { id: 'basketball', name: 'Basketball', enabled: false },
  { id: 'mma-ufc', name: 'MMA/UFC', enabled: false },
  { id: 'tennis', name: 'Tennis', enabled: false },
  { id: 'football-us', name: 'Football US', enabled: false },
  { id: 'cricket', name: 'Cricket', enabled: false },
  { id: 'rugby', name: 'Rugby', enabled: false },
  { id: 'boxe', name: 'Boxe', enabled: false },
  { id: 'handball', name: 'Handball', enabled: false },
];

const LEAGUES = [
  { id: 'champions-league', name: 'Champions League' },
  { id: 'europa-league', name: 'Europa League' },
  { id: 'premiere-league', name: 'Premiere League' },
  { id: 'la-liga', name: 'La Liga' },
  { id: 'bundesliga', name: 'Bundesliga' },
  { id: 'ligue-1', name: 'Ligue 1' },
  { id: 'liga-portugal', name: 'Liga Portugal' },
  { id: 'eredivisie', name: 'Eredivisie' },
  { id: 'division-1a', name: 'Division 1A' },
];

const Favorites = () => {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);

  const handleSportSelect = (sportId: string, enabled: boolean) => {
    if (!enabled) return;
    setSelectedSport(sportId);
  };

  const handleLeagueSelect = (leagueId: string) => {
    setSelectedLeagues(prev => {
      if (prev.includes(leagueId)) {
        return prev.filter(id => id !== leagueId);
      }
      return [...prev, leagueId];
    });
  };

  const handleBack = () => {
    if (selectedSport) {
      setSelectedSport(null);
      setSelectedLeagues([]);
    } else {
      navigate(-1);
    }
  };

  const handleNext = () => {
    if (selectedSport === 'football' && selectedLeagues.length > 0) {
      navigate('/');
    }
  };

  return (
    <AuthLayout variant="medium">
      <div className="flex-1 p-12 flex flex-col justify-center">
        <div className="max-w-3xl mx-auto w-full">
          {/* Logo */}
          <img src="/logo.svg" alt="AM Sports" className="w-12 h-12 mb-8" />

          {/* Title */}
          <h1 className="text-3xl font-bold tracking-wider text-white mb-2">CHOOSE YOUR FAVORITES</h1>
          <p className="text-zinc-400 mb-6">
            {selectedSport === 'football' 
              ? "Select your favorite leagues to get started."
              : "Select your favorite sports and leagues to get started."
            }
          </p>

          {selectedSport === 'football' ? (
            /* Leagues Grid */
            <div className="grid grid-cols-3 gap-3 mb-8">
              {LEAGUES.map((league) => (
                <button
                  key={league.id}
                  onClick={() => handleLeagueSelect(league.id)}
                  className={`
                    px-6 py-3 rounded-lg text-sm font-medium transition-colors
                    ${selectedLeagues.includes(league.id)
                      ? 'bg-white text-black'
                      : 'bg-zinc-900 text-white hover:bg-zinc-800'
                    }
                  `}
                >
                  {league.name}
                </button>
              ))}
            </div>
          ) : (
            /* Sports Grid */
            <div className="grid grid-cols-3 gap-3 mb-8">
              {SPORTS.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => handleSportSelect(sport.id, sport.enabled)}
                  className={`
                    px-6 py-3 rounded-lg text-sm font-medium transition-colors
                    ${sport.enabled 
                      ? selectedSport === sport.id
                        ? 'bg-white text-black'
                        : 'bg-zinc-900 text-white hover:bg-zinc-800'
                      : 'bg-zinc-900/50 text-zinc-600 cursor-not-allowed'
                    }
                  `}
                >
                  {sport.name}
                </button>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-12 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              Back
            </button>
            {(selectedSport === 'football' && selectedLeagues.length > 0) && (
              <button
                onClick={handleNext}
                className="px-12 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Favorites;