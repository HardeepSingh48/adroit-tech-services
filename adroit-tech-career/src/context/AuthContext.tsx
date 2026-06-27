import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, ApiResponse } from '@/lib/api';
import { AppUser } from '@/types/app.types';

export interface User extends AppUser {
  profile?: Record<string, unknown> | null;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (data: Record<string, unknown>) => Promise<ApiResponse<AuthResponseData>>;
  registerJobSeeker: (data: Record<string, unknown>) => Promise<ApiResponse<AuthResponseData>>;
  registerEmployer: (data: Record<string, unknown>) => Promise<ApiResponse<AuthResponseData>>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await apiRequest<User>('/auth/me');
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setAccessToken(null);
          }
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setAccessToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: Record<string, unknown>) => {
    const res = await apiRequest<AuthResponseData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (res.success && res.data) {
      const { accessToken, refreshToken, user } = res.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setAccessToken(accessToken);
      setUser(user);
    }
    return res;
  };

  const registerJobSeeker = async (data: Record<string, unknown>) => {
    const res = await apiRequest<AuthResponseData>('/auth/register/job-seeker', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res;
  };

  const registerEmployer = async (data: Record<string, unknown>) => {
    const res = await apiRequest<AuthResponseData>('/auth/register/employer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res;
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        registerJobSeeker,
        registerEmployer,
        logout,
      }}
    >
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
