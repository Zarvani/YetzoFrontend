'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, User, Phone, MapPin, Wrench, ArrowRight, AlertCircle, Loader2, Navigation, IndianRupee, Clock, Award } from 'lucide-react';
import { useLocationStore } from '@/store/useLocationStore';

export default function ProfessionalRegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [trade, setTrade] = useState('Deep Home Cleaning & Housekeeping');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-detect partner city on load or click
  const detectLiveLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationStatus('GPS not supported');
      return;
    }

    setLocating(true);
    setLocationStatus('Detecting GPS location...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
          if (res.ok) {
            const data = await res.json();
            const detected = data.address?.city || data.address?.town || data.address?.state_district || data.address?.state || '';
            if (detected) {
              setCity(detected);
              setLocationStatus(`Detected: ${detected}`);
            } else {
              setLocationStatus('Location captured');
            }
          }
        } catch {
          setLocationStatus('GPS coordinates captured');
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setLocationStatus('Permission not granted. Please select city manually.');
      },
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    detectLiveLocation();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

      const res = await fetch('/api/proxy/v1/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: fullName.trim() || 'Partner',
          last_name: '',
          phone: formattedPhone,
          password: 'PartnerDefaultSecurePass123!',
          role: 'PROFESSIONAL',
          city: city.trim(),
          trade: trade,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.data?.access) {
          localStorage.setItem('access_token', data.data.access);
          localStorage.setItem('refresh_token', data.data.refresh);
        }
        router.push('/professional/pro/onboarding');
      } else {
        router.push('/professional/pro/onboarding');
      }
    } catch (err: any) {
      router.push('/professional/pro/onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      {/* Partner Header */}
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-sm border border-slate-700 flex-shrink-0">
            <Image src="/logo.jpg" alt="Yetzo" fill className="object-cover" priority />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-lg tracking-tight text-white uppercase">Yetzo Partner</span>
            <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider">Service Fleet Network</span>
          </div>
        </Link>
        <Link
          href="/professional/pro/login"
          className="text-xs font-bold text-slate-300 hover:text-white transition"
        >
          Existing Partner? <span className="text-blue-400 underline">Sign In</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-10">
        <div className="w-full max-w-xl bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
          
          {/* Headline & Earnings Highlight */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-sky-400 border border-blue-500/20 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Join India's Highest-Earning Household Service Fleet</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              Register as a Yetzo Partner
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              Get guaranteed daily doorstep job dispatches within 15 minutes of your location. Earn weekly UPI payouts with transparent customer billing.
            </p>

            {/* Quick Benefits Banner (Urban Company style) */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400">Monthly Earning</p>
                <p className="text-sm font-black text-emerald-400 mt-0.5">₹35,000+</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400">Payout Cycle</p>
                <p className="text-sm font-black text-sky-400 mt-0.5">Weekly UPI</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400">Insurance</p>
                <p className="text-sm font-black text-amber-400 mt-0.5">₹5 Lakh</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Full Name (As per Aadhaar Card) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Suresh Kumar"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-white font-medium text-xs focus:outline-none focus:border-[#2563EB] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Mobile Number (For Job Dispatches) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-3.5 py-3 text-white font-bold text-xs focus:outline-none focus:border-[#2563EB] transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300">Operational City *</label>
                  <button
                    type="button"
                    onClick={detectLiveLocation}
                    className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                  >
                    <Navigation className="w-2.5 h-2.5" />
                    <span>{locating ? 'Detecting...' : 'Auto-Detect'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delhi NCR, Bangalore..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-white font-medium text-xs focus:outline-none focus:border-[#2563EB] transition"
                />
                {locationStatus && (
                  <p className="text-[10px] text-slate-400 mt-1">{locationStatus}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Primary Skill / Chore *</label>
                <select
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-white font-medium text-xs focus:outline-none focus:border-[#2563EB] transition"
                >
                  <option value="Deep Home Cleaning & Housekeeping">Deep Home Cleaning & Housekeeping</option>
                  <option value="Daily Maid & Utensil Scrub">Daily Maid & Utensil Scrub</option>
                  <option value="Home Cooking & Kitchen Meal Prep">Home Cooking & Kitchen Meal Prep</option>
                  <option value="Bathroom Sanitization Expert">Bathroom Sanitization Expert</option>
                  <option value="AC & Appliance Service">AC & Appliance Service</option>
                  <option value="Electrician & Minor Repairs">Electrician & Minor Repairs</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white rounded-xl font-bold font-heading text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Registration...</span>
                </>
              ) : (
                <>
                  <span>Continue to KYC & Document Upload</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-[10px] text-slate-500 text-center leading-normal">
            By registering, you agree to undergo mandatory government identity verification (Aadhaar UIDAI) and police record clearance.
          </p>

        </div>
      </main>
    </div>
  );
}
