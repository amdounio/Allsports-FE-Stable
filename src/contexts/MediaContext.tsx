import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Match, League } from '../types';

interface SavedMatch extends Match {
  date: Date;
  league: League;
}

interface MediaContextType {
  savedMatches: SavedMatch[];
  addMatch: (match: Match, date: Date, league: League) => void;
  deleteMatch: (matchId: string) => void;
  clearAllMatches: () => void;
}

const STORAGE_KEY = 'am-sports-saved-matches';

const MediaContext = createContext<MediaContextType | undefined>(undefined);

const parseSavedMatches = (stored: string | null): SavedMatch[] => {
  if (!stored) return [];
  
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((match: any) => ({
      ...match,
      date: new Date(match.date)
    }));
  } catch (error) {
    console.error('Error parsing saved matches:', error);
    return [];
  }
};

export const MediaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedMatches, setSavedMatches] = useState<SavedMatch[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return parseSavedMatches(stored);
  });

  // Persist matches to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMatches));
    } catch (error) {
      console.error('Error saving matches to localStorage:', error);
    }
  }, [savedMatches]);

  const addMatch = (match: Match, date: Date, league: League) => {
    setSavedMatches(prev => {
      // Check if match already exists for this date
      const exists = prev.some(m => 
        m.id === match.id && 
        m.date.toDateString() === date.toDateString()
      );
      
      if (exists) return prev;
      
      // Add new match
      return [{
        ...match,
        date,
        league
      }, ...prev];
    });
  };

  const deleteMatch = (matchId: string) => {
    setSavedMatches(prev => prev.filter(match => match.id !== matchId));
  };

  const clearAllMatches = () => {
    setSavedMatches([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <MediaContext.Provider value={{
      savedMatches,
      addMatch,
      deleteMatch,
      clearAllMatches
    }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};