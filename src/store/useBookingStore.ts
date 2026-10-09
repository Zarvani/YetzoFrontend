import { create } from 'zustand';

interface BookingState {
  currentBookingId: string | null;
  setCurrentBookingId: (id: string) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  currentBookingId: null,
  setCurrentBookingId: (id) => set({ currentBookingId: id }),
  clearBooking: () => set({ currentBookingId: null }),
}));
