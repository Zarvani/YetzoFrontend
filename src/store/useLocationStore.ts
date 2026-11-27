'use client';

import { create } from 'zustand';
import { apiClient } from '@/lib/apiClient';

export interface CityInfo {
  id: string;
  name: string;
  state: string;
  country?: string;
  is_active?: boolean;
}

interface LocationStore {
  selectedCity: string;
  selectedCityId: string | null;
  cities: CityInfo[];
  userCoords: { lat: number; lng: number } | null;
  hasLocationPermission: boolean;
  isLocationModalOpen: boolean;
  fetchCities: () => Promise<CityInfo[]>;
  setSelectedCity: (city: string, cityId?: string) => void;
  setUserCoords: (coords: { lat: number; lng: number }) => void;
  setHasLocationPermission: (val: boolean) => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
}

export const useLocationStore = create<LocationStore>((set, get) => ({
  selectedCity: typeof window !== 'undefined' ? localStorage.getItem('yetzo_selected_city') || '' : '',
  selectedCityId: typeof window !== 'undefined' ? localStorage.getItem('yetzo_selected_city_id') || null : null,
  cities: [],
  userCoords: null,
  hasLocationPermission: typeof window !== 'undefined' ? localStorage.getItem('yetzo_location_permission') === 'granted' : false,
  isLocationModalOpen: false,

  fetchCities: async () => {
    try {
      const res: any = await apiClient('locations/cities/');
      const list: CityInfo[] = res?.results || (Array.isArray(res) ? res : []);
      set({ cities: list });
      return list;
    } catch {
      return get().cities;
    }
  },

  setSelectedCity: (city: string, cityId?: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('yetzo_selected_city', city);
      if (cityId) {
        localStorage.setItem('yetzo_selected_city_id', cityId);
      }
      window.dispatchEvent(new CustomEvent('yetzo-city-changed', { detail: { city, cityId } }));
    }
    set({ selectedCity: city, ...(cityId ? { selectedCityId: cityId } : {}) });
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
