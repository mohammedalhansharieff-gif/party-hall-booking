import { create } from 'zustand';
import { Hall, SlotAvailability } from '../types';

interface BookingFlowState {
  selectedHall: Hall | null;
  selectedDate: string; // YYYY-MM-DD
  selectedSlot: SlotAvailability | null;
  setSelectedHall: (hall: Hall | null) => void;
  setSelectedDate: (date: string) => void;
  setSelectedSlot: (slot: SlotAvailability | null) => void;
  clearBookingFlow: () => void;
}

export const useBookingStore = create<BookingFlowState>((set) => ({
  selectedHall: null,
  selectedDate: '',
  selectedSlot: null,
  setSelectedHall: (hall) => set({ selectedHall: hall }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  clearBookingFlow: () => set({ selectedHall: null, selectedDate: '', selectedSlot: null }),
}));
