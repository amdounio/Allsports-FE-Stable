import { api } from './config';
import { Match, League } from '../../types';

export const generateMatchVisuals = async (match: Match & { league?: League; typography?: string; background?: string }): Promise<{ story: string; square: string; view: string }> => {
  try {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    if (!userId) {
      throw new Error('User ID not found');
    }

    const requestBody = {
      userId,
      typography: match.typography || 'font-montserrat',
      background: match.background || '',
      match: {
        id: match.id,
        address: match.address || '',
        firstTeam: match.firstTeam || { 
          id: 0, 
          name: match.homeTeam, 
          logo: match.homeTeamLogo 
        },
        secondTeam: match.secondTeam || { 
          id: 0, 
          name: match.awayTeam, 
          logo: match.awayTeamLogo 
        },
        startDate: match.startDate instanceof Date ? match.startDate.toISOString() : match.startDate,
        endDate: match.endDate instanceof Date ? match.endDate.toISOString() : match.endDate,
        periods: match.periods || { first: null, second: null },
        championship: match.championship || match.league || {}
      }
    };

    const response = await api.post('/api/generator/generate-image/combined', requestBody);

    if (!response.data || (!response.data.story && !response.data.square)) {
      throw new Error('Invalid response from visual generation service');
    }

    return {
      story: response.data.story || '',
      square: response.data.square || '',
      view: response.data.view || ''
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate visuals: ${error.message}`);
    }
    throw new Error('Failed to generate visuals');
  }
};

export const saveToMediaLibrary = async (matches: any[], userId: number) => {
  try {
    const response = await api.post('/api/generator/save', {
      userId,
      matches
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to save to library');
  }
};

export const getMediaLibrary = async (userId: number) => {
  try {
    const response = await api.get(`/api/mediatheques/matches/${userId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch media');
  }
};

export const deleteMediaItem = async (userId: number, matchId: string, mediathequeId: string) => {
  try {
    const response = await api.post(`/api/mediatheques/matches/${matchId}`, {
      userId,
      mediathequeId
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to delete media item');
  }
};