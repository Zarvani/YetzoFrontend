import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, MapPin, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export const metadata: Metadata = {
  title: 'Cities We Serve | Yetzo',
  description: 'Explore all operational cities served by Yetzo verified home service specialists.',
};

export default async function CitiesPage() {
  let cities: any[] = [];
  try {
    const res: any = await apiClient('locations/cities/');
    cities = res?.results || (Array.isArray(res) ? res : []);
  } catch {
    cities = [];
  }

  return (
    <div className="min-h-screen bg-slate-50 font-body">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-16 px-4 text-center text-white">
        <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-4">Operational Cities</h1>
        <p className="text-slate-300 font-medium text-base sm:text-lg max-w-xl mx-auto">
          Delivering 15-minute house help and verified home services across active metro clusters.
        </p>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {cities.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-sm p-8">
            <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold font-heading text-slate-800">Connecting to Service Network...</h3>
            <p className="text-xs text-slate-500 mt-1">Operational hubs are updating in real-time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cities.filter(c => c.is_active).map((city) => {
              const slug = city.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <Link
                  key={city.id}
                  href={`/cities/${slug}`}
                  className="bg-white p-5 rounded-sm border border-slate-200 hover:border-blue-400 hover:shadow-sm transition group"
                >
                  <div className="w-9 h-9 rounded-sm bg-blue-50 border border-blue-100 flex items-center justify-center mb-3 text-[#2563EB]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold font-heading text-slate-900 group-hover:text-[#2563EB] transition">
                    {city.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{city.state}, {city.country}</p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#2563EB] font-heading font-medium">
                    <span>View Services</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
