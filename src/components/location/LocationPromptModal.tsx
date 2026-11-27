'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, X, Check, Loader2, AlertCircle } from 'lucide-react';
import { useLocationStore, CITIES_DATA } from '@/store/useLocationStore';

export function LocationPromptModal() {
  const {
    selectedCity,
    setSelectedCity,
    setUserCoords,
    setHasLocationPermission,
    isLocationModalOpen,
    openLocationModal,
    closeLocationModal,
  } = useLocationStore();

  const [locating, setLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showManualCities, setShowManualCities] = useState(false);

  // Industry Standard: Check permission on initial website visit
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedCity = localStorage.getItem('yetzo_selected_city');
    const permStatus = localStorage.getItem('yetzo_location_permission');

    // If user already granted location or selected their city, don't interrupt them
    if (savedCity && permStatus === 'granted') {
      return;
    }

    // Check navigator permissions API silently
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
        if (result.state === 'granted') {
          // Already granted -> silently resolve location without showing annoying popups
          detectLiveGpsLocation(true);
        } else if (result.state === 'prompt') {
          // First visit -> Show professional marketplace permission banner
          if (!savedCity) {
            openLocationModal();
          }
        }
      }).catch(() => {
        if (!savedCity) openLocationModal();
      });
    } else if (!savedCity) {
      openLocationModal();
    }
  }, []);

  const detectLiveGpsLocation = (isSilent: boolean = false) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      if (!isSilent) setErrorMsg('Geolocation is not supported by your browser.');
      setShowManualCities(true);
      return;
    }

    setLocating(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords({ lat, lng });
        setHasLocationPermission(true);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const detectedCity =
              addr.city ||
              addr.town ||
              addr.state_district ||
              addr.county ||
              addr.state ||
              'Delhi NCR';

            // Match against operational cities or fallback cleanly
            const matched = CITIES_DATA.find((c) =>
              c.name.toLowerCase().includes(detectedCity.toLowerCase()) ||
              detectedCity.toLowerCase().includes(c.name.toLowerCase())
            );

            const finalCity = matched ? matched.name : detectedCity;
            setSelectedCity(finalCity);
            closeLocationModal();
          } else {
            setSelectedCity('Delhi NCR');
            closeLocationModal();
          }
        } catch {
          setSelectedCity('Delhi NCR');
          closeLocationModal();
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setHasLocationPermission(false);
        if (!isSilent) {
          setErrorMsg('Location access was denied. Please select your city manually to continue.');
          setShowManualCities(true);
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectCity = (cityName: string) => {
    setSelectedCity(cityName);
    closeLocationModal();
  };

  if (!isLocationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button only if city is already selected */}
        {selectedCity && (
          <button
            onClick={closeLocationModal}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4">
          <Navigation className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold font-heading text-slate-900 tracking-tight">
          Where would you like your chores done?
        </h3>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          Yetzo dispatches verified domestic helpers and maids in 15 minutes. Enable live GPS location to find professionals near your doorstep.
        </p>

        {errorMsg && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Primary Action: Live GPS Auto-Detection */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => detectLiveGpsLocation(false)}
            disabled={locating}
            className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold font-heading text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2.5 disabled:opacity-60"
          >
            {locating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Locating Your Device...</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                <span>Use Current Live Location</span>
              </>
            )}
          </button>

          {!showManualCities ? (
            <button
              onClick={() => setShowManualCities(true)}
              className="w-full py-2.5 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Or select your city manually
            </button>
          ) : (
            <div className="pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Available Coverage Cities:
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {CITIES_DATA.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => handleSelectCity(c.name)}
                    className={`py-2 px-3 text-xs text-left rounded-lg border transition flex items-center justify-between ${
                      selectedCity === c.name
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.name}</span>
                    {c.isOperational ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    ) : (
                      <span className="text-[9px] text-slate-400">Soon</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
