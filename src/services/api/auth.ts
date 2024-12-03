import { api } from './config';
import { AuthResponse } from '../../types/api';

export const login = async (
  email: string, 
  password: string, 
  rememberMe: boolean = false
): Promise<AuthResponse> => {
  try {
    const response = await api.post('/api/auth/login', { email, password, rememberMe });
    
    if (!response.data || !response.data.token) {
      throw new Error('Invalid response from server');
    }
    
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
    
    if (!response.data || !response.data.token) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to create account');
  }
};

export const logout = () => {
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};