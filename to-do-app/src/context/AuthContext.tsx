import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { AuthContextType, AuthResponse, LoginCredentials, RegisterData, User } from '../types/interfaces';


export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (): Promise<void> => {
    try {
      const response = await api.get<User>('/api/users/me');
      setCurrentUser(response.data);
      setLoading(false);
    } catch (err) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setError('Session expired. Please login again.');
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<{ token: string; user: User }>('/api/auth/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      await api.post('/api/auth/register', userData);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to register';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  const updateProfile = async (userData: Partial<User>): Promise<AuthResponse> => {
    try {
      const response = await api.put<User>('/api/users/me', userData);
      setCurrentUser(response.data);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
