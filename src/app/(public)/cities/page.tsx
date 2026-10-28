'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function CitiesPage() {
  const router = useRouter();
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient('locations/cities/').then((d: any) => {
      setCities(d?.results || d || []);
    }).catch(() => setCities([])).finally(() => setLoading(false));
  }, []);

  // Fallback cities if API returns empty
  const fallbackCities = [
    { name: 'Delhi NCR', state: 'Delhi', services_count: 200 },
    { name: 'Mumbai', state: 'Maharashtra', services_count: 200 },
    { name: 'Bengaluru', state: 'Karnataka', services_count: 200 },
    { name: 'Hyderabad', state: 'Telangana', services_count: 200 },
    { name: 'Chennai', state: 'Tamil Nadu', services_count: 180 },
    { name: 'Kolkata', state: 'West Bengal', services_count: 180 },
    { name: 'Pune', state: 'Maharashtra', services_count: 150 },
    { name: 'Ahmedabad', state: 'Gujarat', services_count: 150 },
    { name: 'Jaipur', state: 'Rajasthan', services_count: 120 },
    { name: 'Surat', state: 'Gujarat', services_count: 100 },
    { name: 'Lucknow', state: 'Uttar Pradesh', services_count: 100 },
    { name: 'Chandigarh', state: 'Punjab', services_count: 80 },
  ];
  const displayCities = cities.length > 0 ? cities : fallbackCities;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <title>Cities We Serve — Yetzo</title>
      <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <img src="/assets/images/logo.png" alt="Yetzo" className="h-8 cursor-pointer" onClick={() => router.push('/')} />
        <button onClick={() => router.push('/auth/login')} className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-sm">Sign In</button>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 py-16 px-4 text-center text-white">
        <h1 className="text-5xl font-black mb-4">We're in Your City</h1>
        <p className="text-slate-300 font-medium text-xl">Serving 30+ cities across India and expanding every month</p>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(12).fill(0).map((_,i) => <div key={i} className="bg-white h-28 rounded-2xl animate-pulse border border-slate-200"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayCities.map((city: any, i) => (
              <button
                key={i}
                onClick={() => router.push(`/cities/${(city.name || city.slug || city.id).toLowerCase().replace(/\s+/g, '-')}`)}
                className="bg-white p-5 rounded-2xl border border-slate-200 text-left hover:border-blue-400 hover:shadow-md transition-all shadow-sm group"
              >
                <div className="text-2xl mb-2">🏙️</div>
                <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{city.name}</h3>
                <p className="text-slate-500 font-medium text-sm">{city.state}</p>
                <p className="text-blue-600 font-bold text-xs mt-2">{city.services_count || '100+'}+ services</p>
              </button>
            ))}
          </div>
        )}

        {/* Expansion note */}
        <div className="mt-12 bg-blue-50 border border-blue-200 p-6 rounded-3xl text-center">
          <h3 className="font-black text-slate-900 text-xl mb-2">Don't see your city?</h3>
          <p className="text-slate-600 font-medium mb-4">We expand to new cities every month. Register your interest and be the first to know when Yetzo launches near you.</p>
          <button onClick={() => router.push('/contact')} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">Notify Me When Available</button>
        </div>
      </main>
    </div>
  );
}
