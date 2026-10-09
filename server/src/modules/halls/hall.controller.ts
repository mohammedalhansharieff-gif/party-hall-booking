import { Request, Response, NextFunction } from 'express';
import * as hallService from './hall.service';

export const getAllHalls = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, minCapacity, maxPrice } = req.query;
    const halls = await hallService.getHalls({
      search: search ? String(search) : undefined,
      minCapacity: minCapacity ? parseInt(String(minCapacity), 10) : undefined,
      maxPrice: maxPrice ? parseFloat(String(maxPrice)) : undefined,
      includeInactive: false,
    });
    return res.json({ success: true, count: halls.length, data: halls });
  } catch (error) {
    next(error);
  }
};

export const getHallDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hallId = parseInt(req.params.id, 10);
    const hall = await hallService.getHallById(hallId);
    if (!hall) {
      return res.status(404).json({ success: false, message: 'Hall not found' });
    }
    return res.json({ success: true, data: hall });
  } catch (error) {
    next(error);
  }
};
