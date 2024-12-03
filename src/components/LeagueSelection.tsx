import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface LeagueSelectionProps {
  id: string;
  title: string;
  image: string;
  gradient: string;
  delay?: number;
  disabled?: boolean;
}

const LeagueSelection: React.FC<LeagueSelectionProps> = ({ 
  id, 
  title, 
  image, 
  gradient, 
  delay = 0,
  disabled = false 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!disabled) {
      navigate(`/create/football/${id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      onClick={handleClick}
      className={`
        relative overflow-hidden rounded-xl aspect-[16/9] cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} mix-blend-multiply`} />
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative h-full flex items-end p-6">
        <h3 className="text-2xl font-bold text-white tracking-wider">{title}</h3>
      </div>
    </motion.div>
  );
};

export default LeagueSelection;