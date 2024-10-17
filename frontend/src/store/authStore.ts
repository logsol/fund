import { create } from 'zustand';
import axios from 'axios';

export interface User {
  _id: string;
  name: string;
  email: string;
  balance: number;
  isCrew: boolean;
}

export interface AuthState {
  token: string | null;
  userId: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isCrewMember: () => boolean;
  getCurrentUser: () => Promise<User | null>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      set({ token, userId, isAuthenticated: true });
      // Fetch user data after successful login
      await get().getCurrentUser();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    set({ token: null, userId: null, user: null, isAuthenticated: false });
  },
  isCrewMember: () => {
    const user = get().user;
    return user?.isCrew || false;
  },
  getCurrentUser: async () => {
    const { token } = get();
    if (!token) return null;

    try {
      const response = await axios.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = response.data;
      set({ user, isAuthenticated: true });
      return user;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      set({ isAuthenticated: false, user: null });
      return null;
    }
  },
}));
