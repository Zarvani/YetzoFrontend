'use client';

import { create } from 'zustand';

export interface CityInfo {
  name: string;
  slug: string;
  isOperational: boolean;
  state: string;
}

export const CITIES_DATA: CityInfo[] = [
  { name: 'Delhi NCR', slug: 'delhi-ncr', isOperational: true, state: 'Delhi' },
  { name: 'Bengaluru', slug: 'bengaluru', isOperational: true, state: 'Karnataka' },
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
  userCoords: { lat: number; lng: number } | null;
  hasLocationPermission: boolean;
  isLocationModalOpen: boolean;
  setSelectedCity: (city: string) => void;
  setUserCoords: (coords: { lat: number; lng: number }) => void;
  setHasLocationPermission: (val: boolean) => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  selectedCity: typeof window !== 'undefined' ? localStorage.getItem('yetzo_selected_city') || '' : '',
  userCoords: null,
  hasLocationPermission: typeof window !== 'undefined' ? localStorage.getItem('yetzo_location_permission') === 'granted' : false,
  isLocationModalOpen: false,
  setSelectedCity: (city: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('yetzo_selected_city', city);
      window.dispatchEvent(new CustomEvent('yetzo-city-changed', { detail: city }));
    }
    set({ selectedCity: city });
  },
  setUserCoords: (coords) => set({ userCoords: coords }),
  setHasLocationPermission: (val) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('yetzo_location_permission', val ? 'granted' : 'denied');
    }
    set({ hasLocationPermission: val });
  },
  openLocationModal: () => set({ isLocationModalOpen: true }),
  closeLocationModal: () => set({ isLocationModalOpen: false }),
}));
