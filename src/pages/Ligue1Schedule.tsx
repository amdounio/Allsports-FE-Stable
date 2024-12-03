import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFixtures } from '../services/api';
import { Match } from '../types';
import MatchVisual from '../components/MatchVisual';

const LIGUE_1_ID = 61; // Ligue 1 ID from API-Sports
const CURRENT_SEASON = 2023;

const Ligue1Schedule = () => {
  const [currentDate, setCurrentDate] = useState("VENDREDI 17 JUIN");
  const [selectedMatches, setSelectedMatches] = useState<string[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      const fixtures = await getFixtures(LIGUE_1_ID, CURRENT_SEASON);
      setMatches(fixtures);
      setLoading(false);
    };

    fetchMatches();
  }, []);

  const toggleMatchSelection = (matchId: string) => {
    setSelectedMatches(prev => {
      if (prev.includes(matchId)) {
        return prev.filter(id => id !== matchId);
      }
      if (prev.length < 2) {
        return [...prev, matchId];
      }
      return prev;
    });
  };

  const getSelectedMatchesData = () => {
    return matches.filter(match => selectedMatches.includes(match.id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-light tracking-widest">LIGUE 1</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Back
          </button>
        </div>

        <p className="text-sm font-light tracking-wider text-zinc-400">
          SELECT YOUR MATCHES
        </p>

        <div className="flex justify-between items-center">
          <button className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-light tracking-widest">{currentDate}</h2>
          <button className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => (
            <div
              key={match.id}
              onClick={() => toggleMatchSelection(match.id)}
              className={`bg-zinc-900/50 rounded-xl p-6 hover:bg-zinc-900 transition-colors cursor-pointer
                ${selectedMatches.includes(match.id) ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <img src={match.homeTeamLogo} alt={match.homeTeam} className="w-8 h-8" />
                  <span className="font-light">{match.homeTeam}</span>
                </div>
                <span className="text-sm text-zinc-500">{match.time}</span>
                <div className="flex items-center space-x-4">
                  <span className="font-light">{match.awayTeam}</span>
                  <img src={match.awayTeamLogo} alt={match.awayTeam} className="w-8 h-8" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 space-y-6">
          <div>
            <h2 className="text-2xl font-light tracking-widest mb-2">VISUELS</h2>
            <p className="text-sm font-light tracking-wider text-zinc-400">
              CUSTOM YOUR POSTERS
            </p>
          </div>

          {selectedMatches.length > 0 ? (
            <div className="flex gap-6">
              {getSelectedMatchesData().map((match, index) => (
                <MatchVisual
                  key={match.id}
                  match={match}
                  variant={index === 0 ? 'story' : 'square'}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-zinc-900/50 rounded-xl">
              <p className="text-zinc-500">Select a match to generate a visual</p>
            </div>
          )}

          {selectedMatches.length > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <button className="px-6 py-2 bg-zinc-900 text-white rounded-full text-sm hover:bg-zinc-800 transition-colors">
                  Background change
                </button>
                <button className="px-6 py-2 bg-zinc-900 text-white rounded-full text-sm hover:bg-zinc-800 transition-colors">
                  Change typography
                </button>
              </div>
              <button className="px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
                Suivant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ligue1Schedule;