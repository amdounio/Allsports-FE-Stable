import axios from 'axios';
import { format } from 'date-fns';
import { Match, League } from '../types';
import { AuthResponse, UserInfo, GeneratedImages } from '../types/api';

const BE_URL = 'https://allsports.2points.fr';

export const api = axios.create({
  baseURL: BE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling middleware
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    const errorMessage = error.response?.data?.error || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// User Info APIs
export const updateUserInfo = async (data: FormData | any): Promise<{ message: string; user: UserInfo; status: string }> => {
  try {
    const headers = data instanceof FormData 
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' };

    const response = await api.put('/api/edit-info', data, { headers });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to update user information');
  }
};

export const updateUserPhoto = async (userId: number, photo: File): Promise<{ message: string; photoUrl: string; user: UserInfo; status: string }> => {
  try {
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('userId', userId.toString());

    const response = await api.post('/users/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to update profile photo');
  }
};

// Visual Generation APIs
export const generateMatchVisuals = async (match: Match & { league?: League; typography?: string; background?: string }): Promise<{ story: string; square: string; view: string }> => {
  try {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    if (!userId) {
      throw new Error('User ID not found');
    }

    const matchData = {
      userId,
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
        championship: match.championship || match.league || {},
        typography: match.typography || 'font-montserrat',
        background: match.background || ''
      }
    };

    const response = await api.post('/api/generator/generate-image/combined', matchData);

    if (!response.data || (!response.data.story && !response.data.square)) {
      throw new Error('Invalid response from visual generation service');
    }

    return {
      story: response.data.story || '',
      square: response.data.square || '',
      view: response.data.view || ''
    };
  } catch (error) {
    console.error('Visual generation error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate visuals: ${error.message}`);
    }
    throw new Error('Failed to generate visuals');
  }
};

// Auth APIs
export const login = async (email: string, password: string, rememberMe: boolean = false): Promise<AuthResponse> => {
  try {
    const response = await api.post('/api/auth/login', { email, password, rememberMe });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Invalid email or password');
  }
};

export const signup = async (data: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  acceptLegalPolicy: boolean;
}): Promise<AuthResponse> => {
  try {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to create account');
  }
};

// League APIs
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

// Match APIs
export const getFixtures = async (leagueId: number, season: number = new Date().getFullYear(), date: Date = new Date()): Promise<Match[]> => {
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

// Media Library APIs
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

// User Data APIs
export const getUserGeneratedImagesCount = async (userId: number): Promise<{ generatedImagesCount: number }> => {
  try {
    const response = await api.get(`/api/users/${userId}/generated-images-count`);
    return {
      generatedImagesCount: response.data.generatedImagesCount || 0
    };
  } catch (error) {
    console.error('Error fetching generated images count:', error);
    return { generatedImagesCount: 0 };
  }
};

export const getUserSubscription = async (userId: number): Promise<{ currentPlan: string }> => {
  try {
    const response = await api.get(`/api/users/${userId}/subscription`);
    return {
      currentPlan: response.data.currentPlan || 'Free'
    };
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return { currentPlan: 'Free' };
  }
};

// Payment Methods APIs
export const getPaymentMethods = async (userId: number) => {
  try {
    const response = await api.get(`/api/payment/payment-methods?userId=${userId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch payment methods');
  }
};

export const addPaymentMethod = async (userId: number, paymentMethodId: string) => {
  try {
    const response = await api.post('/api/payment/payment-methods', {
      userId,
      paymentMethodId
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to add payment method');
  }
};

export const deletePaymentMethod = async (userId: number, paymentMethodId: string) => {
  try {
    const response = await api.delete(`/api/payment/payment-methods/${paymentMethodId}`, {
      data: { userId }
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to delete payment method');
  }
};

export const setDefaultPaymentMethod = async (userId: number, paymentMethodId: string) => {
  try {
    const response = await api.post(`/api/payment/payment-methods/${paymentMethodId}/default`, {
      userId
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to set default payment method');
  }
};