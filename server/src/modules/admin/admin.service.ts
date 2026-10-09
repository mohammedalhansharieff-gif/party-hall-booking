import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/db';
import { ENV } from '../../config/env';
import { formatHall } from '../halls/hall.service';
import { sendBookingConfirmedEmail, sendBookingCancelledEmail } from '../../services/email.service';

export const adminLogin = async (email: string, password: string) => {
  const admin = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!admin) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
    ENV.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
    token,
  };
};

export const getAdminBookings = async (filters: {
  status?: string;
  hallId?: number;
  date?: string;
  search?: string;
}) => {
  const where: any = {};

  if (filters.status && filters.status !== 'ALL') {
    where.status = filters.status;
  }

  if (filters.hallId) {
    where.hallId = filters.hallId;
  }

  if (filters.date) {
    const startDate = new Date(`${filters.date}T00:00:00.000Z`);
    const endDate = new Date(`${filters.date}T23:59:59.999Z`);
    where.date = { gte: startDate, lte: endDate };
  }

  if (filters.search) {
    where.OR = [
      { bookingRef: { contains: filters.search } },
      { customerName: { contains: filters.search } },
      { customerEmail: { contains: filters.search } },
      { customerPhone: { contains: filters.search } },
    ];
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      hall: true,
      timeSlot: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return bookings.map((b) => ({
    ...b,
    hall: formatHall(b.hall),
  }));
};

export const getAdminBookingById = async (id: number) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
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

export const confirmBooking = async (id: number) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { hall: true, timeSlot: true },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.status === 'CONFIRMED') {
    return booking;
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: 'CONFIRMED' },
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

  return updated;
};

export const cancelBooking = async (id: number, reason?: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { hall: true, timeSlot: true },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  const updated = await prisma.booking.update({
    where: { id },
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

export const exportBookingsToCsv = async () => {
  const bookings = await prisma.booking.findMany({
    include: { hall: true, timeSlot: true },
    orderBy: { createdAt: 'desc' },
  });

  const headers = [
    'Booking Reference',
    'Hall Name',
    'Date',
    'Time Slot',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Guests',
    'Amount (INR)',
    'Status',
    'Payment Status',
    'Created At',
  ];

  const rows = bookings.map((b) => [
    `"${b.bookingRef}"`,
    `"${b.hall.name}"`,
    `"${b.date.toISOString().split('T')[0]}"`,
    `"${b.timeSlot.label} (${b.timeSlot.startTime}-${b.timeSlot.endTime})"`,
    `"${b.customerName}"`,
    `"${b.customerEmail}"`,
    `"${b.customerPhone}"`,
    b.guestCount || '',
    b.totalAmount,
    `"${b.status}"`,
    `"${b.paymentStatus}"`,
    `"${b.createdAt.toISOString()}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};

export const getDashboardStats = async () => {
  const totalBookings = await prisma.booking.count();
  const pendingBookings = await prisma.booking.count({ where: { status: 'PENDING' } });
  const confirmedBookings = await prisma.booking.count({ where: { status: 'CONFIRMED' } });

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const todayBookings = await prisma.booking.count({
    where: {
      date: { gte: todayStart, lte: todayEnd },
      status: { in: ['CONFIRMED', 'PENDING'] },
    },
  });

  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const revenueAgg = await prisma.booking.aggregate({
    _sum: { totalAmount: true },
    where: {
      createdAt: { gte: firstDayOfMonth },
      status: { in: ['CONFIRMED', 'COMPLETED'] },
    },
  });

  const totalHalls = await prisma.hall.count({ where: { isActive: true } });
  const totalSlotsCount = await prisma.hallTimeSlot.count();
  // Simple occupancy calculation based on current month bookings
  const monthlyConfirmedCount = await prisma.booking.count({
    where: {
      createdAt: { gte: firstDayOfMonth },
      status: { in: ['CONFIRMED', 'COMPLETED'] },
    },
  });

  const possibleSlotsPerMonth = Math.max(1, totalSlotsCount * 30);
  const occupancyRate = Math.min(100, Math.round((monthlyConfirmedCount / possibleSlotsPerMonth) * 100));

  return {
    totalBookings,
    pendingBookings,
    confirmedBookings,
    todayBookings,
    monthlyRevenue: revenueAgg._sum.totalAmount || 0,
    occupancyRate,
    totalHalls,
  };
};
