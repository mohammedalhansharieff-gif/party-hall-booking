import { create } from 'zustand';
import { AdminUser } from '../types';
import {
  adminLogin as apiLogin,
  userSignup as apiSignup,
  initiateLogin as apiInitiateLogin,
  verifyOtp as apiVerifyOtp,
  resendOtp as apiResendOtp,
  adminLogout as apiLogout,
  getAdminProfile,
} from '../api/admin.api';

interface AuthState {
  admin: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  requestLoginOtp: (email: string, pass: string) => Promise<{ success: boolean; email: string; name?: string; message?: string; previewOtp?: string }>;
  verifyLoginOtp: (email: string, otp: string) => Promise<void>;
  resendLoginOtp: (email: string) => Promise<{ success: boolean; message?: string; previewOtp?: string }>;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Synchronously restore session from localStorage so refresh never kicks the user out
const getInitialAuth = () => {
  const token = localStorage.getItem('admin_token');
  let admin: AdminUser | null = null;
  if (token) {
    try {
      const stored = localStorage.getItem('admin_user');
      if (stored) {
        admin = JSON.parse(stored);
      }
    } catch {
      admin = null;
    }
  }
  return { token, admin };
};

const initialAuth = getInitialAuth();

export const useAuthStore = create<AuthState>((set) => ({
  admin: initialAuth.admin,
  token: initialAuth.token,
  isLoading: false,

  requestLoginOtp: async (email, password) => {
    const res = await apiInitiateLogin(email, password);
    return res;
  },

  verifyLoginOtp: async (email, otp) => {
    const { admin, token } = await apiVerifyOtp(email, otp);
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(admin));
    set({ admin, token, isLoading: false });
  },

  resendLoginOtp: async (email) => {
    const res = await apiResendOtp(email);
    return res;
  },

  login: async (email, password) => {
    const { admin, token } = await apiLogin(email, password);
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(admin));
    set({ admin, token, isLoading: false });
  },

  signup: async (name, email, password) => {
    const { admin, token } = await apiSignup(name, email, password);
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(admin));
    set({ admin, token, isLoading: false });
  },

  logout: async () => {
    try {
      await apiLogout();
    } catch {
      // ignore
    }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
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
      localStorage.setItem('admin_user', JSON.stringify(admin));
      set({ admin, token, isLoading: false });
    } catch {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      set({ admin: null, token: null, isLoading: false });
    }
  },
}));
