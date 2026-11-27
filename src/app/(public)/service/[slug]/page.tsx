'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Star, Clock, ShieldCheck, Award, Check, Plus,
  ArrowRight, Tag, Zap, AlertCircle
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { useBookingStore } from '@/store/useBookingStore';
import { JsonLd } from '@/components/seo/JsonLd';

function ServiceDetailContent() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [cartTotal, setCartTotal] = useState(0);
  const [basePrice, setBasePrice] = useState(0);

  const extractPrice = (item: any): number => {
    if (!item) return 0;
    if (item.starting_price && Number(item.starting_price) > 0) {
      return Number(item.starting_price);
    }
    if (item.pricing_rules && item.pricing_rules.length > 0) {
      const bp = item.pricing_rules[0].base_price;
      if (bp) {
        return bp > 1000 ? Math.round(bp / 100) : Number(bp);
      }
    }
    return 0;
  };

  useEffect(() => {
    const fetchRealData = async () => {
      if (!slug) return;
      try {
        setIsLoading(true);
        setError(null);
        // Direct fetch from real PostgreSQL database via apiClient
        const payload: any = await apiClient(`services/${slug}/`);
        setData(payload);
        const price = extractPrice(payload);
        setBasePrice(price);
        setCartTotal(price);
      } catch (err: any) {
        setError(err.message || 'Service not found in database');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealData();
  }, [slug]);

  // Dynamic Real SEO Head Injection
  useEffect(() => {
    if (data?.seo_title) {
      document.title = `${data.seo_title} | Yetzo`;
    } else if (data?.name) {
      document.title = `${data.name} | Yetzo Instant House Help`;
    }
    if (data?.seo_description || data?.description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', data.seo_description || data.description);
    }
  }, [data]);

  const toggleAddon = (addon: any) => {
    const newSet = new Set(selectedAddons);
    const addonPrice = Number(addon.price || 99);
    if (newSet.has(addon.id)) {
      newSet.delete(addon.id);
      setCartTotal(prev => Math.max(basePrice, prev - addonPrice));
    } else {
      newSet.add(addon.id);
      setCartTotal(prev => prev + addonPrice);
    }
    setSelectedAddons(newSet);
  };

  const proceedToBooking = () => {
    if (!data) return;
    const store = useBookingStore.getState();
    store.setService({
      id: data.id,
      name: data.name,
      description: data.description || '',
      pricing_rules: [{ base_price: basePrice }],
      category: { name: data.category?.name || 'Home Service' },
    } as any);
    if (selectedAddons.size > 0) {
      store.setAddons(Array.from(selectedAddons));
    }
    store.setSchedule(true, new Date().toISOString().split('T')[0]);
    router.push('/customer/booking/schedule');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4 font-body">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-[#2563EB] rounded-full animate-spin"></div>
        <p className="text-slate-500 text-xs font-heading">Loading live service details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-body">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold font-heading text-slate-900 mb-2">Service Not Found</h1>
        <p className="text-slate-500 text-xs max-w-md mb-6">{error || 'This service is not active in the database.'}</p>
        <button
          onClick={() => router.push('/services')}
          className="bg-[#2563EB] text-white px-5 py-2.5 rounded-sm font-heading text-xs uppercase tracking-wider font-medium"
        >
          View All Services
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-body pb-24 md:pb-12">
      {/* Real Dynamic JSON-LD Schema generated from PostgreSQL */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: data.category?.name || 'Home Service',
          name: data.name,
          description: data.description,
          provider: {
            '@type': 'HomeAndConstructionBusiness',
            name: 'Yetzo',
            url: 'https://yetzo.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Priyadarshini Vihar',
              addressLocality: 'Delhi',
              postalCode: '110092',
              addressCountry: 'IN',
            },
          },
          offers: {
            '@type': 'Offer',
            price: basePrice,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
          },
          ...(data.rating && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: String(data.rating),
              reviewCount: String(data.reviews_count || 100),
            },
          }),
        }}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 grid md:grid-cols-12 gap-8 items-start relative">
        {/* Left Column: Real Media & Headline */}
        <div className="md:col-span-8 space-y-8">

          <div className="w-full rounded-sm overflow-hidden border border-slate-200 bg-slate-900 text-white relative shadow-sm">
            <div className="h-64 sm:h-80 w-full relative">
              {data.image_url ? (
                <img
                  src={data.image_url}
                  alt={data.name}
                  className="w-full h-full object-cover opacity-60"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 opacity-80" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#2563EB] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider font-heading">
                    Yetzo Verified
                  </span>
                  {data.supports_instant && (
                    <span className="text-[11px] text-sky-400 font-semibold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-sky-400" />
                      15-Minute Instant SLA
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl font-[300] font-heading text-white tracking-tight leading-tight">
                  {data.name}
                </h1>

                <div className="flex flex-wrap items-baseline gap-3 pt-1">
                  <div className="inline-flex items-baseline gap-1.5 bg-white text-slate-900 px-3 py-1 rounded-sm shadow-sm font-heading">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Starts at</span>
                    <span className="text-xl sm:text-2xl font-bold text-blue-700">₹{basePrice}</span>
                  </div>
                  {data.estimated_duration_minutes > 0 && (
                    <span className="text-slate-300 text-xs flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      ~{data.estimated_duration_minutes} mins
                    </span>
                  )}
                  {data.rating && (
                    <span className="text-slate-300 text-xs flex items-center gap-1 font-medium">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {data.rating} ({data.reviews_count || 0} reviews)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Transparent Rate Card Banner */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#2563EB]" />
                <span className="text-xs font-bold font-heading uppercase tracking-wider text-blue-900">
                  Transparent Rate Card
                </span>
              </div>
              <div className="text-lg font-bold font-heading text-slate-900">
                ₹{basePrice} Base Rate
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-body">
                Standard rate includes professional labor, safety gear, and doorstep arrival.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-sm font-heading">
                Zero Hidden Charges
              </span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-y border-slate-200 py-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold font-heading text-slate-900 uppercase">100% Police Verified</h4>
                <p className="text-[11px] text-slate-500">Aadhaar vetted fleet</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold font-heading text-slate-900 uppercase">
                  {data.warranty_days > 0 ? `${data.warranty_days}-Day Warranty` : '₹10,000 Damage Cover'}
                </h4>
                <p className="text-[11px] text-slate-500">Service warranty included</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-sky-400 fill-sky-400" />
              </div>
              <div>
                <h4 className="text-xs font-semibold font-heading text-slate-900 uppercase">
                  {data.supports_instant ? '15-Min Arrival SLA' : 'Scheduled Express'}
                </h4>
                <p className="text-[11px] text-slate-500">Dark-cluster dispatch</p>
              </div>
            </div>
          </div>

          {/* Description & Scope from Database */}
          <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-semibold font-heading text-slate-900 uppercase tracking-wide">
              Service Overview & Specifications
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body whitespace-pre-line">
              {data.description}
            </p>
          </div>

          {/* Real Service Variants from Database */}
          {data.variants && data.variants.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-3 shadow-xs">
              <h3 className="text-sm font-semibold font-heading text-slate-900 uppercase tracking-wider">
                Service Variants
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {data.variants.map((v: any) => (
                  <div key={v.id} className="p-3 bg-slate-50 border border-slate-200 rounded-sm">
                    <h4 className="text-xs font-bold font-heading text-slate-900">{v.name}</h4>
                    {v.description && <p className="text-[11px] text-slate-500 mt-1">{v.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real Addons from Database */}
          {data.addons && data.addons.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-4 shadow-xs">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-semibold font-heading text-slate-900 uppercase tracking-wider">
                  Available Add-Ons & Extras
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Customize your service visit.</p>
              </div>

              <div className="space-y-2.5">
                {data.addons.map((addon: any) => {
                  const isSelected = selectedAddons.has(addon.id);
                  const addonPrice = Number(addon.price || 99);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`flex items-center justify-between p-4 rounded-sm border transition cursor-pointer ${isSelected
                          ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                    >
                      <div>
                        <h4 className="text-xs font-semibold font-heading text-slate-900">{addon.name}</h4>
                        {addon.duration_minutes > 0 && (
                          <p className="text-[11px] text-slate-500 mt-0.5">+{addon.duration_minutes} mins</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold font-heading text-slate-900">₹{addonPrice}</span>
                        <div className={`w-5 h-5 rounded-sm border flex items-center justify-center transition ${isSelected ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'border-slate-300 bg-white'
                          }`}>
                          {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3 text-slate-400" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Sticky Booking Summary */}
        <div className="hidden md:block md:col-span-4 sticky top-24">
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">
                Booking Summary
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold font-heading text-slate-900">₹{cartTotal}</span>
                <span className="text-xs text-slate-400">Total payable</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Held in escrow until work completed to your satisfaction
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Service</span>
                <span className="font-heading font-medium text-slate-900">₹{basePrice}</span>
              </div>
              {selectedAddons.size > 0 && (
                <div className="flex justify-between text-blue-700">
                  <span>Selected Addons ({selectedAddons.size})</span>
                  <span className="font-heading font-medium">₹{cartTotal - basePrice}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Platform Safety & Warranty</span>
                <span className="font-heading font-medium text-slate-900">₹29</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-sm p-3 text-xs text-blue-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>Includes express dispatch with ₹10,000 property protection warranty.</span>
            </div>

            <button
              onClick={proceedToBooking}
              className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium font-heading uppercase tracking-wider text-xs rounded-sm shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>{data.supports_instant ? 'Book Instant (15-Min SLA)' : 'Book Service'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-3.5 px-4 pb-safe flex items-center justify-between z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-heading">Total Amount</p>
          <h3 className="text-xl font-bold font-heading text-slate-900">₹{cartTotal}</h3>
        </div>
        <button
          onClick={proceedToBooking}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium font-heading text-xs uppercase tracking-wider py-2.5 px-6 rounded-sm shadow-sm transition flex items-center gap-1.5"
        >
          <span>Book Now</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
}

export default function ServiceDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-body text-xs text-slate-500">Loading service details...</div>}>
      <ServiceDetailContent />
    </Suspense>
  );
}
