import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout } from '../services/api/auth';
import { AuthResponse, UserInfo } from '../types/api';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (data: SignupData) => Promise<AuthResponse>;
  logout: () => void;
}

interface SignupData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  acceptLegalPolicy: boolean;
}

interface JWTPayload {
  exp?: number;
  user?: UserInfo;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    apiLogout();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  const handleSetUser = (newUser: UserInfo) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const validateAndSetSession = (token: string, userData: UserInfo, rememberMe: boolean = false) => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;

      if (!decoded.exp || decoded.exp <= currentTime) {
        throw new Error('Token expired');
      }

      // Store token based on remember me preference
      if (rememberMe) {
        localStorage.setItem('auth_token', token);
        sessionStorage.removeItem('auth_token');
      } else {
        sessionStorage.setItem('auth_token', token);
        localStorage.removeItem('auth_token');
      }

      // Always store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      handleLogout();
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check both storage locations for token
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');
        
        if (!token || !storedUser) {
          setIsInitialized(true);
          return;
        }

        const userData = JSON.parse(storedUser);
        const isRemembered = !!localStorage.getItem('auth_token');

        if (validateAndSetSession(token, userData, isRemembered)) {
          setIsAuthenticated(true);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        handleLogout();
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await apiLogin(email, password);
      
      if (!response?.token || !response?.user) {
        throw new Error('Invalid authentication response');
      }

      validateAndSetSession(response.token, response.user, rememberMe);
    } catch (error) {
      handleLogout();
      throw error;
    }
  };

  const handleSignup = async (data: SignupData): Promise<AuthResponse> => {
    try {
      const response = await apiSignup(data);
      
      if (!response?.token || !response?.user) {
        throw new Error('Invalid signup response');
      }

      // Always remember users on signup
      validateAndSetSession(response.token, response.user, true);
      return response;
    } catch (error) {
      handleLogout();
      throw error;
    }
  };

  if (!isInitialized) {
    return null;
  }

  const value = {
    isAuthenticated,
    user,
    setUser: handleSetUser,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};