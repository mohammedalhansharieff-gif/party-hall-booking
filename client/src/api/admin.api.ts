import api from './client';
import { AdminUser, Booking, DashboardStats, Hall } from '../types';

export const initiateLogin = async (
  email: string,
  password: string
): Promise<{ success: boolean; requiresOtp: boolean; message: string; email: string; name?: string; previewOtp?: string }> => {
  const res = await api.post('/auth/send-otp', { email, password });
  return res.data;
};

export const verifyOtp = async (
  email: string,
  otp: string
): Promise<{ admin: AdminUser; token: string }> => {
  const res = await api.post('/auth/verify-otp', { email, otp });
  return res.data.data;
};

export const resendOtp = async (
  email: string
): Promise<{ success: boolean; message: string; previewOtp?: string }> => {
  const res = await api.post('/auth/resend-otp', { email });
  return res.data;
};

export const adminLogin = async (
  email: string,
  password: string
): Promise<{ admin: AdminUser; token: string }> => {
  const res = await api.post('/admin/auth/login', { email, password });
  return res.data.data;
};

export const userSignup = async (
  name: string,
  email: string,
  password: string
): Promise<{ admin: AdminUser; token: string }> => {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data.data;
};

export const adminLogout = async () => {
  await api.post('/admin/auth/logout');
};

export const getAdminProfile = async (): Promise<AdminUser> => {
  const res = await api.get('/admin/auth/me');
  return res.data.data;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get('/admin/stats');
  return res.data.data;
};

export const getAdminBookings = async (params?: {
  status?: string;
  hallId?: number;
  date?: string;
  search?: string;
}): Promise<Booking[]> => {
  const res = await api.get('/admin/bookings', { params });
  return res.data.data;
};

export const confirmBooking = async (id: number): Promise<Booking> => {
  const res = await api.patch(`/admin/bookings/${id}/confirm`);
  return res.data.data;
};

export const cancelBooking = async (id: number, reason?: string): Promise<Booking> => {
  const res = await api.patch(`/admin/bookings/${id}/cancel`, { reason });
  return res.data.data;
};

export const exportBookingsCsv = async (): Promise<Blob> => {
  const res = await api.get('/admin/bookings/export', { responseType: 'blob' });
  return res.data;
};

export const getAdminHalls = async (): Promise<Hall[]> => {
  const res = await api.get('/admin/halls');
  return res.data.data;
};

export const createHall = async (data: Partial<Hall>): Promise<Hall> => {
  const res = await api.post('/admin/halls', data);
  return res.data.data;
};

export const updateHall = async (id: number, data: Partial<Hall>): Promise<Hall> => {
  const res = await api.put(`/admin/halls/${id}`, data);
  return res.data.data;
};

export const deleteHall = async (id: number): Promise<Hall> => {
  const res = await api.delete(`/admin/halls/${id}`);
  return res.data.data;
};

export const uploadImage = async (file: File): Promise<{ url: string; filename: string }> => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
};
