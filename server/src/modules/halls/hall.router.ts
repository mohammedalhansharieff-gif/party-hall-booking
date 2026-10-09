import { Router } from 'express';
import { getAllHalls, getHallDetails } from './hall.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { getHallParamsSchema } from './hall.schema';

const router = Router();

router.get('/', getAllHalls);
router.get('/:id', validateRequest(getHallParamsSchema), getHallDetails);

export default router;
