import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BE_URL = 'https://allsports.2points.fr';

export const api = axios.create({
  baseURL: BE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

interface JWTPayload {
  exp?: number;
  user?: any;
}

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  
  if (token) {
    try {
      // Verify token expiration
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp && decoded.exp > currentTime) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      // Clear invalid tokens
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    }
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

    // Handle 401 Unauthorized errors
    if (error.response.status === 401) {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    const errorMessage = error.response?.data?.error || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;