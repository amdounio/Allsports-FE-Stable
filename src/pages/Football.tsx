import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { League } from '../types';
import { getLeagues } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import VideoBackground from '../components/VideoBackground';

// Video mapping for leagues with lazy imports
const LEAGUE_VIDEOS: { [key: string]: string } = {
  'Bundesliga': 'https://2points.fr/allsports/wp-content/uploads/2024/11/Bundesliga.webm',
  'UEFA Champions League': 'https://2points.fr/allsports/wp-content/uploads/2024/11/ChampionsLeague.webm',
  'Eredivisie': 'https://2points.fr/allsports/wp-content/uploads/2024/11/Eredivisie.webm',
  'UEFA Europa League': 'https://2points.fr/allsports/wp-content/uploads/2024/11/Europa-League.webm',
  'La Liga': 'https://2points.fr/allsports/wp-content/uploads/2024/11/La-Liga.webm',
  'Ligue 1': 'https://2points.fr/allsports/wp-content/uploads/2024/11/Ligue1.webm',
  'Premier League': 'https://2points.fr/allsports/wp-content/uploads/2024/11/Premier-League.webm',
  'Primeira Liga': 'https://2points.fr/allsports/wp-content/uploads/2024/11/Primeira-Division.webm',
  'Serie A': 'https://2points.fr/allsports/wp-content/uploads/2024/11/Serie-A.webm'
};

// Ordered list of allowed leagues
const ALLOWED_LEAGUES = [
  { title: 'Ligue 1', country: 'France' },
  { title: 'Premier League', country: 'England' },
  { title: 'La Liga', country: 'Spain' },
  { title: 'Bundesliga', country: 'Germany' },
  { title: 'Serie A', country: 'Italy' },
  { title: 'Primeira Liga', country: 'Portugal' },
  { title: 'Eredivisie', country: 'Netherlands' },
  { title: 'Jupiler Pro League', country: 'Belgium' },
  { title: 'UEFA Champions League', country: 'Europe' },
  { title: 'UEFA Europa League', country: 'Europe' }
];

const Football = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setLoading(true);
        const allLeagues = await getLeagues();
        
        // Filter and sort leagues according to ALLOWED_LEAGUES order
        const filteredAndSortedLeagues = ALLOWED_LEAGUES
          .map(allowed => allLeagues.find(league => league.title === allowed.title))
          .filter((league): league is League => league !== undefined);
        
        setLeagues(filteredAndSortedLeagues);
      } catch (error) {
        console.error('Error fetching leagues:', error);
        toast.error('Failed to load leagues. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  const handleLeagueClick = (leagueId: number) => {
    navigate(`/create/football/${leagueId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mb-16 space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-light tracking-widest">FOOTBALL</h1>
          <p className="text-sm font-light tracking-wider text-zinc-400">SELECT YOUR COMPETITION</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {leagues.map((league, index) => {
          const videoUrl = LEAGUE_VIDEOS[league.title];
          
          return (
            <motion.div
              key={league.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleLeagueClick(league.id)}
              className="relative overflow-hidden rounded-xl aspect-[16/9] cursor-pointer group"
            >
              {/* Background */}
              {videoUrl ? (
                <VideoBackground videoUrl={videoUrl} />
              ) : (
                <>
                  <img 
                    src={league.image}
                    alt={league.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </>
              )}

              {/* Content */}
              <div className="relative h-full p-6 flex flex-col justify-between z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-light tracking-wider text-white">
                    {league.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Football;