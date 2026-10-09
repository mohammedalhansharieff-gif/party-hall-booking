import { Router } from 'express';
import {
  handleCreateBooking,
  handleGetBookingByRef,
  handleCancelBooking,
  handleProcessPayment,
} from './booking.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import {
  createBookingSchema,
  getBookingRefSchema,
  cancelBookingSchema,
  processPaymentSchema,
} from './booking.schema';

const router = Router();

router.post('/', validateRequest(createBookingSchema), handleCreateBooking);
router.get('/:bookingRef', validateRequest(getBookingRefSchema), handleGetBookingByRef);
router.patch('/:bookingRef/cancel', validateRequest(cancelBookingSchema), handleCancelBooking);
router.post('/:bookingRef/pay', validateRequest(processPaymentSchema), handleProcessPayment);

export default router;
