'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MapPin, Plus, Check, Home, Building2, MapPinned, AlertCircle, Loader2, Navigation } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { AddressItem } from '@/types/booking';
import { useLocationStore, CITIES_DATA } from '@/store/useLocationStore';

interface BookingAddressSelectorProps {
  selectedAddressId?: string;
  onSelectAddress: (address: AddressItem) => void;
}

export function BookingAddressSelector({
  selectedAddressId,
  onSelectAddress,
}: BookingAddressSelectorProps) {
  const { selectedCity } = useLocationStore();
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State: starts with customer selectedCity context or blank, then auto-populated by GPS
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState(selectedCity || '');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [addressType, setAddressType] = useState<'HOME' | 'WORK' | 'OTHER'>('HOME');

  // Trigger GPS detection when opening modal if fields are empty
  const detectLiveLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    setLocationStatus('Requesting current GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        setLocationStatus('Resolving street and pincode...');

        try {
          // Reverse geocoding via OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const detectedCity = addr.city || addr.town || addr.village || addr.state_district || addr.county || selectedCity;
            const detectedState = addr.state || '';
            const detectedPostcode = addr.postcode || '';
            const road = addr.road || addr.suburb || addr.neighbourhood || '';
            const house = addr.house_number || '';
            const detectedLine = [house, road, addr.suburb].filter(Boolean).join(', ');

            if (detectedCity) setCity(detectedCity);
            if (detectedState) setState(detectedState);
            if (detectedPostcode) setPincode(detectedPostcode);
            if (detectedLine && !addressLine) setAddressLine(detectedLine);
            setLocationStatus('Current location detected successfully.');
          } else {
            setLocationStatus('Location detected from GPS coordinates.');
          }
        } catch (err) {
          setLocationStatus('GPS coordinates captured.');
        } finally {
          setLocating(false);
        }
      },
      (geoErr) => {
        setLocating(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setLocationStatus('Location permission not granted. Please enter manually.');
        } else {
          setLocationStatus('Unable to determine location. Please enter manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient<any>('locations/addresses/');
      const list: AddressItem[] = res?.data || (Array.isArray(res) ? res : res?.results || []);
      setAddresses(list);

      // Auto-select first address if none selected
      if (list.length > 0 && !selectedAddressId) {
        onSelectAddress(list[0]);
      }
    } catch (err: any) {
      console.warn('Address fetch note:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        address_line_1: addressLine.trim(),
        city: city.trim() || selectedCity,
        state: state.trim() || 'Delhi',
        pincode: pincode.trim(),
        address_type: addressType,
        latitude: coords ? coords.lat.toString() : '28.6328',
        longitude: coords ? coords.lng.toString() : '77.2995',
      };

      const res = await apiClient<any>('locations/addresses/', {
        method: 'POST',
        body: payload,
      });

      const newAddr: AddressItem = res?.data || res;
      setShowAddModal(false);
      setAddressLine('');
      await fetchAddresses();
      if (newAddr?.id) {
        onSelectAddress(newAddr);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save address. Please check input.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-sm border border-slate-200 font-body">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600 mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-medium">Loading saved addresses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-body">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-sm text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Address Cards List */}
      <div className="grid grid-cols-1 gap-2.5">
        {addresses.map((addr) => {
          const isSelected = selectedAddressId === addr.id;
          const TypeIcon = addr.address_type === 'WORK' ? Building2 : addr.address_type === 'HOME' ? Home : MapPinned;

          return (
            <div
              key={addr.id}
              onClick={() => onSelectAddress(addr)}
              className={`p-4 rounded-sm border cursor-pointer transition flex items-start gap-3.5 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div
                className={`p-2 rounded-sm mt-0.5 shrink-0 ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <TypeIcon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] font-semibold font-heading uppercase tracking-wider text-slate-900">
                    {addr.address_type || 'Address'}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-sm border flex items-center justify-center transition ${
                      isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-xs text-slate-700 line-clamp-2">
                  {addr.address_line_1}
                  {addr.address_line_2 ? `, ${addr.address_line_2}` : ''}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Address Trigger */}
      <button
        type="button"
        onClick={() => setShowAddModal(true)}
        className="w-full py-3 px-4 rounded-sm border border-dashed border-slate-300 bg-white hover:border-blue-600 hover:bg-blue-50/20 text-slate-600 hover:text-blue-700 font-medium text-xs transition flex items-center justify-center gap-2 font-heading uppercase tracking-wider"
      >
        <Plus className="w-3.5 h-3.5" />
        Add New Service Address
      </button>

      {/* Modal for New Address */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-6 max-w-lg w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-[300] font-heading text-slate-900">Add Service Location</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-medium"
              >
                Cancel
              </button>
            </div>

            {/* Live Location / GPS Detection Button */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-sm p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">Use Current GPS Location</p>
                  <p className="text-[11px] text-slate-500">
                    {locationStatus || 'Detect your live city, street and pincode automatically'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={detectLiveLocation}
                disabled={locating}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-[11px] font-medium font-heading uppercase tracking-wider flex items-center gap-1.5 shrink-0 disabled:opacity-50 transition"
              >
                {locating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Detecting...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3 h-3" />
                    <span>Detect Location</span>
                  </>
                )}
              </button>
            </div>

            <form onSubmit={handleCreateAddress} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Address Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['HOME', 'WORK', 'OTHER'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAddressType(type)}
                      className={`py-2 px-3 text-xs font-medium rounded-sm border transition ${
                        addressType === type
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Street / Flat / House Details *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g. Flat / House number, Apartment or Building name"
                  className="w-full text-xs font-medium p-2.5 border border-slate-300 rounded-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs font-medium p-2 border border-slate-300 rounded-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full text-xs font-medium p-2 border border-slate-300 rounded-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs uppercase tracking-wider rounded-sm shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2 font-heading"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Address...</span>
                  </>
                ) : (
                  <span>Save and Select Address</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
