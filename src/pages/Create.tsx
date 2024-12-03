import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Lock } from 'lucide-react';
import PageTitle from '../components/PageTitle';

const sports = [
  {
    id: 'football',
    title: 'Football',
    gradient: 'from-blue-900 to-blue-600',
    enabled: true
  },
  {
    id: 'tennis',
    title: 'Tennis',
    gradient: 'from-zinc-700 to-zinc-500',
    enabled: false
  },
  {
    id: 'rugby',
    title: 'Rugby',
    gradient: 'from-zinc-700 to-zinc-500',
    enabled: false
  },
  {
    id: 'cricket',
    title: 'Cricket',
    gradient: 'from-zinc-700 to-zinc-500',
    enabled: false
  },
  {
    id: 'baseball',
    title: 'Baseball',
    gradient: 'from-zinc-700 to-zinc-500',
    enabled: false
  },
  {
    id: 'nfl',
    title: 'NFL',
    gradient: 'from-zinc-700 to-zinc-500',
    enabled: false
  }
];

const Create = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const handleSportClick = (sportId: string, enabled: boolean) => {
    if (!enabled) return;
    setSelectedSport(sportId);
    if (sportId === 'football') {
      navigate('/create/football');
    }
  };

  return (
    <div className="space-y-12">
      <section>
        <PageTitle 
          title="Sports"
          subtitle="Choose your discipline"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sports.map((sport, index) => (
            <motion.div
              key={sport.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={sport.enabled ? { scale: 1.02 } : {}}
              onClick={() => handleSportClick(sport.id, sport.enabled)}
              className={`relative overflow-hidden rounded-xl aspect-[16/9] cursor-pointer ${
                !sport.enabled && 'cursor-not-allowed'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${sport.gradient}`} />
              <div className="relative h-full p-6 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-montserrat text-white mb-2">
                  {sport.title}
                </h3>
                {!sport.enabled && (
                  <>
                    <Lock className="w-6 h-6 text-white/80 mb-2" />
                    <span className="text-white/80 text-sm font-inter">Coming Soon</span>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {selectedSport && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[30px] p-8 ${isDark ? 'bg-zinc-900/30' : 'bg-white/50'}`}
        >
          <h2 className="text-xl font-montserrat mb-6">
            Select your competition
          </h2>
          <div className="h-32 flex items-center justify-center text-zinc-500 font-inter">
            {selectedSport === 'football' ? (
              <p>Loading competitions...</p>
            ) : (
              <p>Feature coming soon</p>
            )}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default Create;