import api from './client';
import { Booking } from '../types';

export interface CreateBookingData {
  hallId: number;
  timeSlotId: number;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  guestCount?: number;
  specialRequests?: string;
}

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  data: Booking;
  paymentOrder: {
    orderId: string;
    amount: number;
    currency: string;
    isMock: boolean;
  };
}

export const createBooking = async (data: CreateBookingData): Promise<CreateBookingResponse> => {
  const res = await api.post('/bookings', data);
  return res.data;
};

export const getBookingByRef = async (ref: string): Promise<Booking> => {
  const res = await api.get(`/bookings/${ref}`);
  return res.data.data;
};

export const cancelBooking = async (ref: string, reason?: string): Promise<Booking> => {
  const res = await api.patch(`/bookings/${ref}/cancel`, { reason });
  return res.data.data;
};

export const confirmPayment = async (
  ref: string,
  paymentData: { paymentId: string; orderId?: string; signature?: string }
): Promise<Booking> => {
  const res = await api.post(`/bookings/${ref}/pay`, paymentData);
  return res.data.data;
};
