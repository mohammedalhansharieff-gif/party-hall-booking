import api from './client';
import { AvailabilityResponse } from '../types';

export const getAvailability = async (hallId: number, date: string): Promise<AvailabilityResponse> => {
  const res = await api.get('/availability', {
    params: { hallId, date },
  });
  return res.data;
};
