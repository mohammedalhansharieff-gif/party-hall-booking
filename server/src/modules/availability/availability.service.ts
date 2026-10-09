import { prisma } from '../../config/db';

export const getSlotAvailability = async (hallId: number, dateStr: string) => {
  // Parse date into day start and day end
  const startDate = new Date(`${dateStr}T00:00:00.000Z`);
  const endDate = new Date(`${dateStr}T23:59:59.999Z`);

  // 1. Fetch hall
  const hall = await prisma.hall.findUnique({
    where: { id: hallId },
    select: { id: true, name: true, pricePerSlot: true },
  });

  if (!hall) {
    throw new Error('Hall not found');
  }

  // 2. Fetch hall's time slots
  const hallSlots = await prisma.hallTimeSlot.findMany({
    where: { hallId },
    include: { timeSlot: true },
    orderBy: { timeSlot: { startTime: 'asc' } },
  });

  // 3. Fetch all active bookings for this hall on this date (CONFIRMED or PENDING)
  const existingBookings = await prisma.booking.findMany({
    where: {
      hallId,
      date: {
        gte: startDate,
        lte: endDate,
      },
      status: {
        in: ['CONFIRMED', 'PENDING'],
      },
    },
    include: {
      timeSlot: true,
    },
  });

  const bookedSlotLabels = new Set(existingBookings.map((b) => b.timeSlot.label.toLowerCase()));
  const isFullDayBooked = bookedSlotLabels.has('full day');

  // Check which slot IDs are directly or overlappingly booked
  const slots = hallSlots.map((hs) => {
    const slotLabel = hs.timeSlot.label.toLowerCase();
    let isAvailable = true;

    if (isFullDayBooked) {
      isAvailable = false;
    } else if (bookedSlotLabels.has(slotLabel)) {
      isAvailable = false;
    } else if (slotLabel === 'full day' && bookedSlotLabels.size > 0) {
      // If any slot (Morning or Evening) is booked, Full Day cannot be booked
      isAvailable = false;
    }

    // Find pending/confirmed status if booked
    const matchBooking = existingBookings.find((b) => b.timeSlotId === hs.timeSlotId);
    const bookingStatus = matchBooking ? matchBooking.status : (isAvailable ? null : 'CONFLICT');

    return {
      id: hs.timeSlot.id,
      label: hs.timeSlot.label,
      startTime: hs.timeSlot.startTime,
      endTime: hs.timeSlot.endTime,
      price: hs.price ?? hall.pricePerSlot ?? hs.timeSlot.defaultPrice,
      available: isAvailable,
      status: isAvailable ? 'AVAILABLE' : (bookingStatus || 'BOOKED'),
    };
  });

  return {
    date: dateStr,
    hall: {
      id: hall.id,
      name: hall.name,
    },
    slots,
  };
};
