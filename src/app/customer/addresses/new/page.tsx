'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Save, AlertCircle, Navigation, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { useLocationStore } from '@/store/useLocationStore';

export default function NewAddressPage() {
  const router = useRouter();
  const { selectedCity } = useLocationStore();
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState(selectedCity || '');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [addressType, setAddressType] = useState('HOME');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setLocationStatus('Resolving location details...');

        try {
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
            setLocationStatus('Coordinates captured from GPS.');
          }
        } catch (err) {
          setLocationStatus('Coordinates captured from GPS.');
        } finally {
          setLocating(false);
        }
      },
      (geoErr) => {
        setLocating(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setLocationStatus('Location permission denied. Please enter manually.');
        } else {
          setLocationStatus('Unable to detect location. Please enter manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      await apiClient('locations/addresses/', {
        method: 'POST',
        body: {
          address_line_1: addressLine.trim(),
          city: city.trim() || selectedCity,
          state: state.trim() || 'Delhi',
          pincode: pincode.trim(),
          address_type: addressType,
          latitude: coords ? coords.lat.toString() : '28.6328',
          longitude: coords ? coords.lng.toString() : '77.2995',
        },
      });

      router.push('/customer/addresses');
    } catch (err: any) {
      setError(err?.message || 'Failed to save address.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Addresses
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Add Service Address</h1>
              <p className="text-xs text-slate-500">Enter delivery and service execution location.</p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Live GPS Detection Banner */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Use Current GPS Location</p>
                <p className="text-[11px] text-slate-500">
                  {locationStatus || 'Detect your live city, street and pincode automatically'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={detectLiveLocation}
              disabled={locating}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 disabled:opacity-50 transition shadow-sm"
            >
              {locating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Detecting...</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Detect Location</span>
                </>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">House / Flat / Street Address *</label>
              <textarea
                rows={3}
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="e.g. Flat 301, Tower C, Prateek Laurel, Sector 120"
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] text-slate-900"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] text-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Address Label</label>
              <div className="flex gap-2">
                {['HOME', 'WORK', 'OTHER'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAddressType(type)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition ${
                      addressType === type
                        ? 'border-[#2563EB] bg-blue-50 text-blue-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 text-xs flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {submitting ? 'Saving Address...' : 'Save Service Address'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
