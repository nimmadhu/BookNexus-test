import api from './api';
import type { LoginCredentials, RegisterData, User ,LibrarianData} from '../types/auth';

export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await api.post('/auth/login', credentials);
  
  // Store token and user info in localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data));
  
  return response.data;
};

export const register = async (userData: RegisterData): Promise<User> => {
  const response = await api.post('/auth/register', userData);
  
  // Store token and user info in localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data));
  
  return response.data;
};

// Used only by admins to register new librarians
export const registerLibrarian = async (data: LibrarianData): Promise<User> => {
  const response = await api.post('/auth/register-librarian', data);
  return response.data.user;
};

export const getLibrarians = async (): Promise<User[]> => {
  const response = await api.get('/auth/librarians');
  return response.data.librarians;
};

export const deleteLibrarian = async (id: number): Promise<void> => {
  await api.delete(`/auth/librarians/${id}`);
};


export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getProfile = async (): Promise<User> => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const getCurrentUser = (): User | null => {
  const userString = localStorage.getItem('user');
  if (!userString) return null;
  
  try {
    return JSON.parse(userString);
  } catch (error) {
    localStorage.removeItem('user');
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};