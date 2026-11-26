'use client';

import { create } from 'zustand';

export interface CityInfo {
  name: string;
  slug: string;
  isOperational: boolean;
  state: string;
}

export const CITIES_DATA: CityInfo[] = [
  { name: 'Bengaluru', slug: 'bengaluru', isOperational: true, state: 'Karnataka' },
  { name: 'Delhi NCR', slug: 'delhi-ncr', isOperational: true, state: 'Delhi' },
  { name: 'Mumbai', slug: 'mumbai', isOperational: true, state: 'Maharashtra' },
  { name: 'Gurgaon', slug: 'gurgaon', isOperational: true, state: 'Haryana' },
  { name: 'Noida', slug: 'noida', isOperational: true, state: 'Uttar Pradesh' },
  { name: 'Pune', slug: 'pune', isOperational: true, state: 'Maharashtra' },
  { name: 'Hyderabad', slug: 'hyderabad', isOperational: false, state: 'Telangana' },
  { name: 'Faridabad', slug: 'faridabad', isOperational: false, state: 'Haryana' },
  { name: 'Ghaziabad', slug: 'ghaziabad', isOperational: false, state: 'Uttar Pradesh' },
  { name: 'Navi Mumbai', slug: 'navi-mumbai', isOperational: false, state: 'Maharashtra' },
  { name: 'Thane', slug: 'thane', isOperational: false, state: 'Maharashtra' },
  { name: 'Chennai', slug: 'chennai', isOperational: false, state: 'Tamil Nadu' },
  { name: 'Kolkata', slug: 'kolkata', isOperational: false, state: 'West Bengal' },
  { name: 'Jaipur', slug: 'jaipur', isOperational: false, state: 'Rajasthan' },
  { name: 'Ahmedabad', slug: 'ahmedabad', isOperational: false, state: 'Gujarat' },
];

interface LocationStore {
  selectedCity: string;
  isLocationModalOpen: boolean;
  setSelectedCity: (city: string) => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  selectedCity: typeof window !== 'undefined' ? localStorage.getItem('yetzo_selected_city') || 'Bengaluru' : 'Bengaluru',
  isLocationModalOpen: false,
  setSelectedCity: (city: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('yetzo_selected_city', city);
      window.dispatchEvent(new CustomEvent('yetzo-city-changed', { detail: city }));
    }
    set({ selectedCity: city });
  },
  openLocationModal: () => set({ isLocationModalOpen: true }),
  closeLocationModal: () => set({ isLocationModalOpen: false }),
}));
