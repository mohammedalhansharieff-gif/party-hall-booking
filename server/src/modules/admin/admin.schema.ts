import { z } from 'zod';

export const adminLoginSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Valid email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const updateBookingStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Booking ID must be numeric'),
  }),
  body: z.object({
    reason: z.string().optional(),
  }),
});
