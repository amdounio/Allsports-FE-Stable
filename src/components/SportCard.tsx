import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface SportCardProps {
  id: string;
  title: string;
  gradient: string;
  delay?: number;
  disabled?: boolean;
}

const SportCard: React.FC<SportCardProps> = ({ 
  id, 
  title, 
  gradient, 
  delay = 0, 
  disabled = false 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!disabled) {
      navigate(`/create/${id.toLowerCase()}`);
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
        relative overflow-hidden rounded-xl h-[200px] cursor-pointer 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
      <div className="relative h-full flex items-center justify-between p-6">
        <h3 className="text-2xl font-bold text-white tracking-wider">{title}</h3>
      </div>
    </motion.div>
  );
};

export default SportCard;