'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Zap, Clock, ShieldCheck, MapPin, Plus, Check, 
  Sparkles, Layers, Tag, ArrowRight, AlertCircle, CheckCircle2, Loader2 
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { BookingStepper } from '@/components/booking/BookingStepper';
import { useBookingStore } from '@/store/useBookingStore';

function CustomerBookingHubPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceIdParam = searchParams.get('serviceId');

  // Booking Configuration State
  const [isInstant, setIsInstant] = useState(true);
  const [isProntoVerified, setIsProntoVerified] = useState(true);
  const [services, setServices] = useState<any[]>([]);
  const [selectedChoreIds, setSelectedChoreIds] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [servicesRes, addrRes]: any = await Promise.all([
        apiClient('services/').catch(() => ({ data: [] })),
        apiClient('locations/addresses/').catch(() => ({ data: [] })),
      ]);

      const sList: any[] = servicesRes?.data || (Array.isArray(servicesRes) ? servicesRes : servicesRes?.results || []);
      const aList: any[] = addrRes?.data || (Array.isArray(addrRes) ? addrRes : addrRes?.results || []);

      setServices(sList);

      if (sList.length > 0) {
        if (serviceIdParam && sList.some((s) => s.id === serviceIdParam)) {
          setSelectedChoreIds([serviceIdParam]);
        } else {
          setSelectedChoreIds([sList[0].id]);
        }
      }

      setAddresses(aList);
      if (aList.length > 0) {
        setSelectedAddressId(aList[0].id);
      }
    } catch (e: any) {
      setError(e?.message || 'Could not load service catalog');
    } finally {
      setLoading(false);
    }
  };

  const toggleChore = (choreId: string) => {
    if (selectedChoreIds.includes(choreId)) {
      if (selectedChoreIds.length === 1) return; // Keep at least one chore
      setSelectedChoreIds(selectedChoreIds.filter((id) => id !== choreId));
    } else {
      setSelectedChoreIds([...selectedChoreIds, choreId]);
    }
  };

  // Pricing & duration calculations directly from database records
  const selectedChores = services.filter((c) => selectedChoreIds.includes(c.id));
  const totalDuration = selectedChores.reduce((sum, c) => sum + (c.estimated_duration_minutes || c.duration || 45), 0);
  const subtotal = selectedChores.reduce((sum, c) => {
    const price = c.starting_price || c.pricing_rules?.[0]?.base_price || c.price || 299;
    return sum + Number(price);
  }, 0);

  // Pronto signature: 15% discount when stacking 2+ chores in a single pro visit
  const stackingDiscount = selectedChores.length >= 2 ? Math.round(subtotal * 0.15) : 0;
  const taxableAmount = subtotal - stackingDiscount;
  const gst = Math.round(taxableAmount * 0.18);
  const platformFee = 29; // Ultra-transparent minimal fee
  const totalAmount = taxableAmount + gst + platformFee;

  const handleProceedToSchedule = () => {
    if (selectedChores.length === 0) {
      setError('Please select at least one service.');
      return;
    }

    const store = useBookingStore.getState();
    const primaryService = selectedChores[0];
    store.setService({
      id: primaryService.id,
      name: primaryService.name,
      description: primaryService.description || primaryService.desc || '',
      pricing_rules: [{ base_price: primaryService.starting_price || 299 }],
      category: { name: primaryService.category?.name || primaryService.category_name || 'Home Maintenance' },
    } as any);

    store.setProntoVerified(isProntoVerified);
    store.setSchedule(isInstant, new Date().toISOString().split('T')[0]);

    if (selectedAddressId) {
      const matchedAddr = addresses.find((a) => a.id === selectedAddressId);
      if (matchedAddr) store.setAddress(matchedAddr);
    }

    router.push('/customer/booking/schedule');
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3 font-body">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
        <h2 className="text-base font-[300] font-heading text-slate-900">Loading Live Service Catalog...</h2>
        <p className="text-xs text-slate-500">Querying real-time services from PostgreSQL database</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-body pb-16">
      <BookingStepper currentStep={1} />

      {/* Hero Headline Card */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>15-Minute Instant House Help SLA · Pronto Quality Guaranteed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-[300] font-heading text-slate-900 tracking-tight">
              Select Your Tasks & Stack Chores
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-body">
              Stack multiple household chores into a single visit. One trusted, verified pro handles everything, saving you 15% with zero extra callout charges.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-sm shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <div className="font-heading font-medium text-slate-900">₹10,000 Damage Guarantee</div>
              <div className="text-slate-500 text-[11px]">100% Police & SOP Verified</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-sm text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Two-Column Grid: Configurator & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Cols: Step Modules */}
        <div className="lg:col-span-2 space-y-6">

          {/* Step 1: SLA Dispatch Velocity */}
          <div className="bg-white border border-slate-200 rounded-sm p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-semibold font-heading text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-emerald-600" />
                1. Dispatch SLA & Timing
              </h2>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Choose between instant dark-dispatch arrival or scheduled slot.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setIsInstant(true)}
                className={`p-4 rounded-sm border cursor-pointer transition ${
                  isInstant
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-heading font-semibold text-xs">
                    <Zap className="w-4 h-4 fill-emerald-600" />
                    <span>Instant Doorstep Help</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">
                    15 Min SLA
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Nearest verified pro dispatched immediately from hyper-local cluster.
                </p>
              </div>

              <div
                onClick={() => setIsInstant(false)}
                className={`p-4 rounded-sm border cursor-pointer transition ${
                  !isInstant
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-slate-800 font-heading font-semibold text-xs">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>Scheduled Visit</span>
                  </div>
                  <span className="text-[10px] uppercase font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                    Flexible
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Book a precise 2-hour window up to 7 days in advance or Daily Pass.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Live Database Services Catalog & Stacking */}
          <div className="bg-white border border-slate-200 rounded-sm p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-semibold font-heading text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  2. Select Chores & Services ({services.length})
                </h2>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Select multiple chores to unlock 15% Task Stacking discount.
                </p>
              </div>

              {selectedChores.length >= 2 && (
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-sm flex items-center gap-1 font-heading">
                  <Tag className="w-3 h-3" />
                  15% Bundle Discount Active
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {services.map((chore) => {
                const isSelected = selectedChoreIds.includes(chore.id);
                const price = chore.starting_price || chore.price || 299;

                return (
                  <div
                    key={chore.id}
                    onClick={() => toggleChore(chore.id)}
                    className={`p-3.5 rounded-sm border cursor-pointer transition flex items-start justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="text-xs font-semibold font-heading text-slate-900 block">
                          {chore.name}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {chore.description || chore.desc || 'Certified domestic service'}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                          <span>~{chore.estimated_duration_minutes || 45} mins</span>
                          <span>•</span>
                          <span className="text-slate-600 font-medium">
                            {chore.category?.name || 'Home Care'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <span className="text-xs font-semibold text-slate-900 font-heading">
                        ₹{price}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Pronto Verified Security Suite */}
          <div className="bg-white border border-slate-200 rounded-sm p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-sm bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold font-heading text-slate-900 uppercase tracking-wide">
                    Pronto Verified: Encrypted Bodycam Session
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Partner records audio/video stream during visit with end-to-end encryption. Footage stored in compliance with India DPDP Act 2023.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={isProntoVerified}
                  onChange={(e) => setIsProntoVerified(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#05AC5F]"></div>
              </label>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Live Escrow Summary Card */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-5 sticky top-24">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold font-heading">
              Visit Breakdown
            </span>
            <h3 className="text-base font-[300] font-heading text-slate-900 mt-0.5">
              Escrow Estimate
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Selected Chores ({selectedChores.length})</span>
              <span className="font-medium text-slate-900">₹{subtotal}</span>
            </div>

            {stackingDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Task Stacking (15% Off)
                </span>
                <span>-₹{stackingDiscount}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Platform Safety Fee</span>
              <span className="font-medium text-slate-900">₹{platformFee}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>GST (18% Statutory SAC 9987)</span>
              <span className="font-medium text-slate-900">₹{gst}</span>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-900 font-heading">
                Total Held in Escrow
              </span>
              <span className="text-xl font-bold font-heading text-slate-900 text-emerald-800">
                ₹{totalAmount}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleProceedToSchedule}
              disabled={selectedChores.length === 0}
              className="w-full py-3 bg-[#05AC5F] hover:bg-[#049652] text-white font-medium font-heading uppercase tracking-wider text-xs rounded-sm shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>Confirm & Choose Slot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Zero prepayment risk: Escrow funds released to professional only after customer provides 4-digit End OTP at door.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CustomerBookingHubPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 font-body">Loading booking hub...</div>}>
      <CustomerBookingHubPageContent />
    </Suspense>
  );
}
