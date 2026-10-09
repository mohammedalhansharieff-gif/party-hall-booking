import { z } from 'zod';

export const createHallSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    capacity: z.number().int().positive('Capacity must be a positive integer'),
    location: z.string().optional(),
    pricePerSlot: z.number().positive('Price must be greater than 0'),
    images: z.array(z.string().url()).optional().default([]),
    amenities: z.array(z.string()).optional().default([]),
    isActive: z.boolean().optional().default(true),
    timeSlotIds: z.array(z.number().int()).optional(), // specific time slots to associate
  }),
});

export const updateHallSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be an integer'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    capacity: z.number().int().positive().optional(),
    location: z.string().optional(),
    pricePerSlot: z.number().positive().optional(),
    images: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    timeSlotIds: z.array(z.number().int()).optional(),
  }),
});

export const getHallParamsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be an integer'),
  }),
});
