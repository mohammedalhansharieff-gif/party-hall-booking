import { z } from 'zod';

export const getAvailabilitySchema = z.object({
  query: z.object({
    hallId: z.string().regex(/^\d+$/, 'hallId must be an integer'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format'),
  }),
});
