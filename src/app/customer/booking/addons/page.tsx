'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Check, ShieldCheck, Tag, ArrowRight, Wrench } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { useBookingStore } from '@/store/useBookingStore';

function BookingAddonsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceIdParam = searchParams.get('serviceId');

  const [addons, setAddons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  useEffect(() => {
    fetchAddons();
  }, []);

  const fetchAddons = async () => {
    try {
      setLoading(true);
      const [pricingRes, servicesRes]: any = await Promise.all([
        apiClient('pricing/addon-pricing/').catch(() => ({ data: [] })),
        apiClient('services/').catch(() => ({ data: [] })),
      ]);

      const pricingList = pricingRes?.data || (Array.isArray(pricingRes) ? pricingRes : []);
      const servicesList = servicesRes?.data || (Array.isArray(servicesRes) ? servicesRes : []);

      // Extract all real addons from catalog
      const allAddons: any[] = [];
      servicesList.forEach((srv: any) => {
        if (srv.addons && Array.isArray(srv.addons)) {
          srv.addons.forEach((ad: any) => {
            const pricing = pricingList.find((p: any) => p.addon === ad.id);
            const price = pricing ? (pricing.price > 10000 ? pricing.price / 100 : pricing.price) : 299;
            allAddons.push({
              id: ad.id,
              name: ad.name,
              description: ad.description || `Genuine OEM part for ${srv.name}`,
              category: srv.category?.name || 'Service Addon',
              price: price,
            });
          });
        }
      });

      setAddons(allAddons);
    } catch (e) {
      console.warn('Addons fetch note:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleAddon = (id: string) => {
    if (selectedAddonIds.includes(id)) {
      setSelectedAddonIds(selectedAddonIds.filter((item) => item !== id));
    } else {
      setSelectedAddonIds([...selectedAddonIds, id]);
    }
  };

  const selectedItems = addons.filter((a) => selectedAddonIds.includes(a.id));
  const addonsTotal = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const handleContinue = () => {
    useBookingStore.getState().setAddons(selectedAddonIds);
    router.push('/customer/booking/schedule');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Booking
        </button>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Urban Company Rate-Card Transparency
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Recommended Service Add-ons & Spare Parts</h1>
          <p className="text-xs text-slate-500 mt-1">
            Standardized fixed rates. OEM-grade genuine replacement parts with 30-day warranty.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading live spare parts catalog...</div>
        ) : addons.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-3">
            <Wrench className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-600 font-medium">
              No add-ons or spare parts required for this service visit.
            </p>
            <button
              onClick={() => router.push('/customer/booking')}
              className="px-5 py-2 bg-[#059669] text-white text-xs font-bold rounded-xl hover:bg-[#047857] shadow transition"
            >
              Continue with Standard Service
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {addons.map((item) => {
              const isSelected = selectedAddonIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleAddon(item.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-start justify-between ${
                    isSelected
                      ? 'border-[#059669] bg-emerald-50/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 transition ${
                        isSelected
                          ? 'bg-[#059669] border-[#059669] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{item.name}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                      <span className="inline-block mt-1.5 text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-4">
                    <span className="text-sm font-extrabold text-slate-900 font-mono">
                      ₹{item.price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Total & CTA */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">Add-ons Selected: {selectedAddonIds.length}</span>
            <span className="text-lg font-black text-slate-900 font-mono">₹{addonsTotal}</span>
          </div>

          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow-md transition text-xs flex items-center gap-2"
          >
            <span>Continue to Booking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingAddonsPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-slate-400 font-bold">Loading add-ons...</div>}>
      <BookingAddonsPageContent />
    </React.Suspense>
  );
}
