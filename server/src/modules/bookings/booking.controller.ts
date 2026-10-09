import { Request, Response, NextFunction } from 'express';
import * as bookingService from './booking.service';

export const handleCreateBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bookingService.createBooking(req.body);
    return res.status(201).json({
      success: true,
      message: 'Booking request created successfully',
      data: result.booking,
      paymentOrder: result.paymentOrder,
    });
  } catch (error: any) {
    if (error.message?.includes('SLOT_ALREADY_BOOKED')) {
      return res.status(409).json({
        success: false,
        message: 'The selected slot has already been booked. Please choose another slot or date.',
      });
    }
    if (error.message?.includes('Cannot book dates in the past')) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book dates in the past.',
      });
    }
    next(error);
  }
};

export const handleGetBookingByRef = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingRef } = req.params;
    const booking = await bookingService.getBookingByRef(bookingRef);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking found with reference ${bookingRef}`,
      });
    }

    return res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const handleCancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingRef } = req.params;
    const { reason } = req.body;
    const updated = await bookingService.cancelBookingByCustomer(bookingRef, reason);

    return res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: updated,
    });
  } catch (error: any) {
    if (error.message === 'Booking not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message?.includes('already cancelled') || error.message?.includes('Completed bookings')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const handleProcessPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingRef } = req.params;
    const { paymentId, orderId, signature } = req.body;

    const updated = await bookingService.confirmBookingPayment(bookingRef, {
      paymentId,
      orderId,
      signature,
    });

    return res.json({
      success: true,
      message: 'Payment confirmed and booking verified!',
      data: updated,
    });
  } catch (error: any) {
    if (error.message?.includes('Invalid payment verification')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};
