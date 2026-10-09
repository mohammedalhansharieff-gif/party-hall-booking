import { prisma } from '../../config/db';
import { formatHall } from '../halls/hall.service';
import { createPaymentOrder, verifyPaymentSignature } from '../../services/payment.service';
import {
  sendBookingReceivedEmail,
  sendBookingConfirmedEmail,
  sendAdminNewBookingAlert,
  sendBookingCancelledEmail,
} from '../../services/email.service';

export const generateBookingRef = (): string => {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `HALL-${year}-${random}`;
};

export interface CreateBookingInput {
  hallId: number;
  timeSlotId: number;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  guestCount?: number;
  specialRequests?: string;
}

export const createBooking = async (input: CreateBookingInput) => {
  const eventDate = new Date(`${input.date}T00:00:00.000Z`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (eventDate < today) {
    throw new Error('Cannot book dates in the past');
  }

  const startDate = new Date(`${input.date}T00:00:00.000Z`);
  const endDate = new Date(`${input.date}T23:59:59.999Z`);

  return await prisma.$transaction(async (tx) => {
    // 1. Fetch hall & timeSlot
    const hall = await tx.hall.findUnique({
      where: { id: input.hallId },
      include: { timeSlots: { where: { timeSlotId: input.timeSlotId } } },
    });

    if (!hall || !hall.isActive) {
      throw new Error('Selected hall is not available or does not exist');
    }

    const timeSlot = await tx.timeSlot.findUnique({
      where: { id: input.timeSlotId },
    });

    if (!timeSlot) {
      throw new Error('Selected time slot not found');
    }

    // 2. Overlap & Conflict Check
    const activeBookings = await tx.booking.findMany({
      where: {
        hallId: input.hallId,
        date: { gte: startDate, lte: endDate },
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
      include: { timeSlot: true },
    });

    const isFullDayRequested = timeSlot.label.toLowerCase() === 'full day';
    const isFullDayAlreadyBooked = activeBookings.some(
      (b) => b.timeSlot.label.toLowerCase() === 'full day'
    );
    const hasAnyExistingBooking = activeBookings.length > 0;
    const isSameSlotBooked = activeBookings.some((b) => b.timeSlotId === input.timeSlotId);

    if (isSameSlotBooked || isFullDayAlreadyBooked || (isFullDayRequested && hasAnyExistingBooking)) {
      throw new Error('SLOT_ALREADY_BOOKED: This slot is already reserved or conflicts with existing bookings.');
    }

    // 3. Calculate price
    const slotOverride = hall.timeSlots[0];
    const totalAmount = slotOverride?.price ?? hall.pricePerSlot ?? timeSlot.defaultPrice;

    // 4. Generate unique ref
    let bookingRef = generateBookingRef();
    let existingRef = await tx.booking.findUnique({ where: { bookingRef } });
    while (existingRef) {
      bookingRef = generateBookingRef();
      existingRef = await tx.booking.findUnique({ where: { bookingRef } });
    }

    // 5. Create booking record
    const booking = await tx.booking.create({
      data: {
        bookingRef,
        hallId: input.hallId,
        timeSlotId: input.timeSlotId,
        date: startDate,
        status: 'PENDING',
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        guestCount: input.guestCount,
        specialRequests: input.specialRequests,
        totalAmount,
        paymentStatus: 'UNPAID',
      },
      include: {
        hall: true,
        timeSlot: true,
      },
    });

    // 6. Create payment order (Razorpay or dev mock)
    const paymentOrder = await createPaymentOrder({
      amount: totalAmount,
      receipt: bookingRef,
    });

    // 7. Fire and forget notifications
    const emailData = {
      bookingRef: booking.bookingRef,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      hallName: booking.hall.name,
      date: input.date,
      timeSlotLabel: booking.timeSlot.label,
      timeSlotTime: `${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}`,
      totalAmount: booking.totalAmount,
      guestCount: booking.guestCount,
      location: booking.hall.location,
    };

    sendBookingReceivedEmail(emailData).catch(console.error);
    sendAdminNewBookingAlert(emailData).catch(console.error);

    return {
      booking: {
        ...booking,
        hall: formatHall(booking.hall),
      },
      paymentOrder,
    };
  });
};

export const getBookingByRef = async (bookingRef: string) => {
  const booking = await prisma.booking.findUnique({
    where: { bookingRef },
    include: {
      hall: true,
      timeSlot: true,
    },
  });

  if (!booking) return null;

  return {
    ...booking,
    hall: formatHall(booking.hall),
  };
};

export const cancelBookingByCustomer = async (bookingRef: string, reason?: string) => {
  const booking = await prisma.booking.findUnique({
    where: { bookingRef },
    include: { hall: true, timeSlot: true },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.status === 'CANCELLED') {
    throw new Error('Booking is already cancelled');
  }

  if (booking.status === 'COMPLETED') {
    throw new Error('Completed bookings cannot be cancelled');
  }

  const updated = await prisma.booking.update({
    where: { bookingRef },
    data: {
      status: 'CANCELLED',
      paymentStatus: booking.paymentStatus === 'PAID' ? 'REFUNDED' : booking.paymentStatus,
    },
    include: { hall: true, timeSlot: true },
  });

  sendBookingCancelledEmail({
    bookingRef: updated.bookingRef,
    customerName: updated.customerName,
    customerEmail: updated.customerEmail,
    hallName: updated.hall.name,
    date: updated.date.toISOString().split('T')[0],
    timeSlotLabel: updated.timeSlot.label,
    timeSlotTime: `${updated.timeSlot.startTime} - ${updated.timeSlot.endTime}`,
    totalAmount: updated.totalAmount,
    reason,
  }).catch(console.error);

  return updated;
};

export const confirmBookingPayment = async (
  bookingRef: string,
  paymentDetails: { paymentId: string; orderId?: string; signature?: string }
) => {
  const booking = await prisma.booking.findUnique({
    where: { bookingRef },
    include: { hall: true, timeSlot: true },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (paymentDetails.orderId && paymentDetails.signature) {
    const isValid = verifyPaymentSignature(
      paymentDetails.orderId,
      paymentDetails.paymentId,
      paymentDetails.signature
    );
    if (!isValid) {
      throw new Error('Invalid payment verification signature');
    }
  }

  const updated = await prisma.booking.update({
    where: { bookingRef },
    data: {
      paymentStatus: 'PAID',
      paymentId: paymentDetails.paymentId,
      status: 'CONFIRMED',
    },
    include: { hall: true, timeSlot: true },
  });

  sendBookingConfirmedEmail({
    bookingRef: updated.bookingRef,
    customerName: updated.customerName,
    customerEmail: updated.customerEmail,
    hallName: updated.hall.name,
    date: updated.date.toISOString().split('T')[0],
    timeSlotLabel: updated.timeSlot.label,
    timeSlotTime: `${updated.timeSlot.startTime} - ${updated.timeSlot.endTime}`,
    totalAmount: updated.totalAmount,
    guestCount: updated.guestCount,
    location: updated.hall.location,
  }).catch(console.error);

  return {
    ...updated,
    hall: formatHall(updated.hall),
  };
};
