import { api } from './config';
import { format } from 'date-fns';
import { Match, League } from '../../types';

export const getLeagues = async (): Promise<League[]> => {
  try {
    const response = await api.get('/api/matches/leagues');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch leagues');
  }
};

export const getFixtures = async (
  leagueId: number, 
  season: number = new Date().getFullYear(), 
  date: Date = new Date()
): Promise<Match[]> => {
  try {
    const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    
    const response = await api.post(`/api/matches/leagues/${leagueId}/matches`, {
      season,
      date: formattedDate
    });

    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format from server');
    }
    
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch fixtures');
  }
};