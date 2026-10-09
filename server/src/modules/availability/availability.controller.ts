import { Request, Response, NextFunction } from 'express';
import * as availabilityService from './availability.service';

export const checkAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hallId = parseInt(req.query.hallId as string, 10);
    const dateStr = req.query.date as string;

    const result = await availabilityService.getSlotAvailability(hallId, dateStr);
    return res.json({ success: true, ...result });
  } catch (error: any) {
    if (error.message === 'Hall not found') {
      return res.status(404).json({ success: false, message: 'Hall not found' });
    }
    next(error);
  }
};
