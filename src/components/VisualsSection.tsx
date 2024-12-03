import React from 'react';
import MatchVisual from './MatchVisual';
import { Match } from '../types';

interface VisualsSectionProps {
  selectedMatches: Match[];
}

const VisualsSection: React.FC<VisualsSectionProps> = ({ selectedMatches }) => {
  const selectedMatch = selectedMatches[0];

  if (!selectedMatch) {
    return (
      <div className="flex items-center justify-center h-64 bg-zinc-900/50 rounded-xl">
        <p className="text-zinc-500">Select a match for generate a visual</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-6">
        <MatchVisual match={selectedMatch} variant="story" />
        <MatchVisual match={selectedMatch} variant="square" />
      </div>

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
    </>
  );
};

export default VisualsSection;