import api from './client';
import { Hall } from '../types';

export const getHalls = async (params?: {
  search?: string;
  minCapacity?: number;
  maxPrice?: number;
}): Promise<Hall[]> => {
  const res = await api.get('/halls', { params });
  return res.data.data;
};

export const getHallById = async (id: number): Promise<Hall> => {
  const res = await api.get(`/halls/${id}`);
  return res.data.data;
};
