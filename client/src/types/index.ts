export interface TimeSlot {
  id: number;
  label: string; // Morning, Evening, Full Day
  startTime: string; // "09:00"
  endTime: string; // "14:00"
  price: number;
}

export interface Hall {
  id: number;
  name: string;
  description?: string;
  capacity: number;
  location?: string;
  pricePerSlot: number;
  images: string[];
  amenities: string[];
  isActive: boolean;
  timeSlots?: TimeSlot[];
  createdAt: string;
  updatedAt: string;
}

export interface SlotAvailability {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
  price: number;
  available: boolean;
  status: 'AVAILABLE' | 'PENDING' | 'CONFIRMED' | 'CONFLICT';
}

export interface AvailabilityResponse {
  date: string;
  hall: {
    id: number;
    name: string;
  };
  slots: SlotAvailability[];
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';

export interface Booking {
  id: number;
  bookingRef: string;
  hallId: number;
  timeSlotId: number;
  date: string;
  status: BookingStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  guestCount?: number | null;
  specialRequests?: string | null;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentId?: string | null;
  createdAt: string;
  updatedAt: string;
  hall: Hall;
  timeSlot: TimeSlot;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'STAFF';
}

export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  todayBookings: number;
  monthlyRevenue: number;
  occupancyRate: number;
  totalHalls: number;
}
