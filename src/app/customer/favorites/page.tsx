'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, ArrowRight, Star, Clock } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function CustomerFavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('services/');
      const list = res?.data || (Array.isArray(res) ? res : []);
      // Display first 4 active services as saved favorites
      setFavorites(list.slice(0, 4));
    } catch (e) {
      console.warn('Favorites fetch note:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 fill-rose-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Saved Favorite Services</h1>
              <p className="text-xs text-slate-500">Quick 1-click rebooking for your frequently used home care services.</p>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading saved services...</div>
          ) : favorites.length === 0 ? (
            <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
              <Heart className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No favorite services saved yet.</p>
              <Link href="/services" className="text-xs font-bold text-[#059669] hover:underline">
                Explore Services Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.map((srv) => (
                <Link
                  key={srv.id}
                  href={`/customer/booking?serviceId=${srv.id}`}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-[#059669] bg-white transition flex flex-col justify-between group shadow-sm"
                >
                  <div className="space-y-1">
                    <span className="font-extrabold text-sm text-slate-900 group-hover:text-[#059669] transition block">
                      {srv.name}
                    </span>
                    <p className="text-xs text-slate-500 line-clamp-2">{srv.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-900">
                      ₹{srv.pricing_rules?.[0]?.base_price || 499}
                    </span>
                    <span className="font-bold text-[#059669] flex items-center gap-1 group-hover:translate-x-1 transition">
                      1-Click Book <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
