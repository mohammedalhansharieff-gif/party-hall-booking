import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    hallId: z.number().int().positive('Hall ID is required'),
    timeSlotId: z.number().int().positive('Time Slot ID is required'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    customerName: z.string().min(2, 'Name must be at least 2 characters'),
    customerEmail: z.string().email('Valid email is required'),
    customerPhone: z.string().min(10, 'Phone must have at least 10 digits'),
    guestCount: z.number().int().positive().optional(),
    specialRequests: z.string().optional(),
  }),
});

export const getBookingRefSchema = z.object({
  params: z.object({
    bookingRef: z.string().min(4, 'Booking reference is required'),
  }),
});

export const cancelBookingSchema = z.object({
  params: z.object({
    bookingRef: z.string().min(4),
  }),
  body: z.object({
    reason: z.string().optional(),
  }),
});

export const processPaymentSchema = z.object({
  params: z.object({
    bookingRef: z.string().min(4),
  }),
  body: z.object({
    paymentId: z.string().min(1, 'Payment ID is required'),
    orderId: z.string().optional(),
    signature: z.string().optional(),
  }),
});
