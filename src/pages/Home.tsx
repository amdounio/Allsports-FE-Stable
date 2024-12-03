import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import VideoBackground from '../components/VideoBackground';

const leagues = [
  {
    id: 61,
    name: 'LIGUE 1',
    description: [
      "La rentrée du football français",
      "c'est maintenant !"
    ],
    videoUrl: 'https://2points.fr/allsports/wp-content/uploads/2024/11/Ligue1.mp4'
  },
  {
    id: 39,
    name: 'PREMIER LEAGUE',
    description: [
      "Vivez l'intensité du football anglais",
      "comme si vous y étiez"
    ],
    videoUrl: 'https://2points.fr/allsports/wp-content/uploads/2024/11/Premier-League.mp4'
  },
  {
    id: 2,
    name: 'CHAMPIONS LEAGUE',
    description: [
      "Les plus grandes équipes européennes",
      "s'affrontent pour le titre suprême"
    ],
    videoUrl: 'https://2points.fr/allsports/wp-content/uploads/2024/11/ChampionsLeague.mp4'
  }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {leagues.map((league, index) => (
          <motion.div
            key={league.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => navigate(`/create/football/${league.id}`)}
            className="relative overflow-hidden rounded-2xl h-[280px] cursor-pointer group"
          >
            {/* Background Video */}
            <VideoBackground videoUrl={league.videoUrl} />

            {/* Content */}
            <div className="relative h-full p-8 flex flex-col justify-between">
              <div className="text-right">
                <h2 className="text-4xl font-light tracking-wider text-white mb-3">{league.name}</h2>
                <div className="space-y-1">
                  {league.description.map((line, i) => (
                    <p key={i} className="text-white/80 text-sm">{line}</p>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Crée tes visuels
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;