import { create } from 'zustand';
import { AdminUser } from '../types';
import { adminLogin as apiLogin, adminLogout as apiLogout, getAdminProfile } from '../api/admin.api';

interface AuthState {
  admin: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  admin: null,
  token: localStorage.getItem('admin_token'),
  isLoading: true,

  login: async (email, password) => {
    const { admin, token } = await apiLogin(email, password);
    localStorage.setItem('admin_token', token);
    set({ admin, token, isLoading: false });
  },

  logout: async () => {
    try {
      await apiLogout();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('admin_token');
    set({ admin: null, token: null, isLoading: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      set({ admin: null, token: null, isLoading: false });
      return;
    }

    try {
      const admin = await getAdminProfile();
      set({ admin, token, isLoading: false });
    } catch {
      localStorage.removeItem('admin_token');
      set({ admin: null, token: null, isLoading: false });
    }
  },
}));
