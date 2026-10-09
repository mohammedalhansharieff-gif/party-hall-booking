import { Router } from 'express';
import { checkAvailability } from './availability.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { getAvailabilitySchema } from './availability.schema';

const router = Router();

router.get('/', validateRequest(getAvailabilitySchema), checkAvailability);

export default router;
