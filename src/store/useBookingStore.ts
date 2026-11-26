import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ServiceItem, AddressItem, CouponItem, Booking } from '@/types/booking';

export interface BookingState {
  service: ServiceItem | null;
  additionalServices: ServiceItem[];
  address: AddressItem | null;
  isInstant: boolean;
  isYetzoVerified: boolean;
  scheduledDate: string;
  scheduledTime: string;
  scheduledSlotLabel: string;
  appliedCoupon: CouponItem | null;
  answers: Record<string, any>;
  addons: string[];
  preferredProfessionalId: string | null;
  currentBooking: Booking | null;

  // Actions
  setService: (service: ServiceItem) => void;
  toggleAdditionalService: (service: ServiceItem) => void;
  setAddress: (address: AddressItem) => void;
  setSchedule: (isInstant: boolean, date?: string, time?: string, slotLabel?: string) => void;
  setYetzoVerified: (verified: boolean) => void;
  setCoupon: (coupon: CouponItem | null) => void;
  setAnswers: (answers: Record<string, any>) => void;
  setAddons: (addons: string[]) => void;
  setPreferredProfessional: (id: string | null) => void;
  setCurrentBooking: (booking: Booking | null) => void;
  getPricing: () => {
    subtotal: number;
    discount: number;
    taxableAmount: number;
    taxes: number;
    platformFee: number;
    totalAmount: number;
  };
  resetBooking: () => void;
}

const getBasePrice = (srv: ServiceItem | null): number => {
  if (!srv) return 0;
  if ((srv as any).starting_price) {
    return Number((srv as any).starting_price);
  }
  if (srv.pricing_rules && srv.pricing_rules.length > 0) {
    const p = srv.pricing_rules[0].base_price;
    return Number(p > 10000 ? p / 100 : p) || 199;
  }
  return srv.base_price ? Number(srv.base_price > 10000 ? srv.base_price / 100 : srv.base_price) : 199;
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      service: null,
      additionalServices: [],
      address: null,
      isInstant: true,
      isYetzoVerified: true,
      scheduledDate: '',
      scheduledTime: '10:00:00',
      scheduledSlotLabel: '15-Minute Ultra Fast Arrival',
      appliedCoupon: null,
      answers: {},
      addons: [],
      preferredProfessionalId: null,
      currentBooking: null,

      setService: (service) => set({ service }),

      toggleAdditionalService: (service) => {
        const { additionalServices } = get();
        const exists = additionalServices.some((s) => s.id === service.id);
        if (exists) {
          set({ additionalServices: additionalServices.filter((s) => s.id !== service.id) });
        } else {
          set({ additionalServices: [...additionalServices, service] });
        }
      },

      setAddress: (address) => set({ address }),

      setSchedule: (isInstant, date, time, slotLabel) =>
        set({
          isInstant,
          scheduledDate: date || (isInstant ? new Date().toISOString().split('T')[0] : get().scheduledDate),
          scheduledTime: time || (isInstant ? '10:00:00' : get().scheduledTime),
          scheduledSlotLabel: slotLabel || (isInstant ? '15-Minute Ultra Fast Arrival' : get().scheduledSlotLabel),
        }),

      setYetzoVerified: (isYetzoVerified) => set({ isYetzoVerified }),

      setCoupon: (appliedCoupon) => set({ appliedCoupon }),

      setAnswers: (answers) => set({ answers }),

      setAddons: (addons) => set({ addons }),

      setPreferredProfessional: (preferredProfessionalId) => set({ preferredProfessionalId }),

      setCurrentBooking: (currentBooking) => set({ currentBooking }),

      getPricing: () => {
        const { service, additionalServices, appliedCoupon } = get();
        const mainPrice = getBasePrice(service);
        const addPrices = additionalServices.reduce((sum, s) => sum + getBasePrice(s), 0);
        const subtotal = mainPrice + addPrices;

        // Task Stacking discount: 15% off for 2+ chores/services (Yetzo signature)
        let discount = additionalServices.length > 0 ? Math.round(subtotal * 0.15) : 0;

        // Apply coupon if present
        if (appliedCoupon) {
          if (appliedCoupon.discount_type === 'PERCENTAGE') {
            const couponDiscount = Math.round((subtotal * appliedCoupon.discount_value) / 100);
            const capped = appliedCoupon.max_discount_amount
              ? Math.min(couponDiscount, appliedCoupon.max_discount_amount)
              : couponDiscount;
            discount += capped;
          } else {
            discount += appliedCoupon.discount_value;
          }
        }

        const taxableAmount = Math.max(0, subtotal - discount);
        const taxes = Math.round(taxableAmount * 0.18); // 18% GST
        const platformFee = 29; // Ultra-transparent minimal fee
        const totalAmount = taxableAmount + taxes + platformFee;

        return {
          subtotal,
          discount,
          taxableAmount,
          taxes,
          platformFee,
          totalAmount,
        };
      },

      resetBooking: () =>
        set({
          service: null,
          additionalServices: [],
          address: null,
          isInstant: true,
          isYetzoVerified: true,
          scheduledDate: '',
          scheduledTime: '10:00:00',
          scheduledSlotLabel: '15-Minute Ultra Fast Arrival',
          appliedCoupon: null,
          answers: {},
          addons: [],
          preferredProfessionalId: null,
          currentBooking: null,
        }),
    }),
    {
      name: 'yetzo_booking_store',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
    }
  )
);
