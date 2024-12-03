import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface LeagueCardProps {
  title: string;
  description: string;
  image: string;
  logo: string;
  gradient: string;
}

const LeagueCard: React.FC<LeagueCardProps> = ({ title, description, image, logo, gradient }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => navigate('/create/football')}
      className="relative overflow-hidden rounded-2xl h-[300px] cursor-pointer group"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 ${gradient} transition-opacity duration-300 group-hover:opacity-95`} />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-8">
        <div className="flex items-start justify-between">
          <h2 className="text-4xl font-bold tracking-wider text-white">{title}</h2>
          <img 
            src={logo} 
            alt={`${title} logo`} 
            className="w-16 h-16 object-contain"
          />
        </div>

        <div>
          <p className="text-white/90 mb-4 font-light">{description}</p>
          <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Crée tes visuels
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LeagueCard;