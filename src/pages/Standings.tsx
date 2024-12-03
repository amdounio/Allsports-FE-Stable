import React, { useState, useEffect } from 'react';
import { getStandings } from '../services/api';
import { Standing } from '../types';
import LeagueSelector from '../components/LeagueSelector';
import StandingsTable from '../components/StandingsTable';
import LoadingSpinner from '../components/LoadingSpinner';

const LEAGUES = [
  { id: 61, name: 'Ligue 1', country: 'France' },
  { id: 140, name: 'La Liga', country: 'Spain' },
  { id: 135, name: 'Serie A', country: 'Italy' },
  { id: 78, name: 'Bundesliga', country: 'Germany' },
  { id: 39, name: 'Premier League', country: 'England' },
  { id: 2, name: 'UEFA Champions League', country: 'Europe' },
  { id: 3, name: 'UEFA Europa League', country: 'Europe' }
];

const CURRENT_SEASON = 2024;

const Standings = () => {
  const [selectedLeague, setSelectedLeague] = useState(LEAGUES[0]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      const data = await getStandings(selectedLeague.id, CURRENT_SEASON);
      setStandings(data);
      setLoading(false);
    };

    fetchStandings();
  }, [selectedLeague]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <LeagueSelector
          leagues={LEAGUES}
          selectedLeague={selectedLeague}
          onLeagueSelect={setSelectedLeague}
        />
        {loading ? <LoadingSpinner /> : <StandingsTable standings={standings} />}
      </div>
    </div>
  );
};

export default Standings;