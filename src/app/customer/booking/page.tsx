'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Zap, Clock, ShieldCheck, MapPin, Plus, Check, 
  Sparkles, Layers, Tag, ArrowRight, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { BookingStepper } from '@/components/booking/BookingStepper';
import { useBookingStore } from '@/store/useBookingStore';

// Curated Pronto-benchmark household chore list with default durations & base rates
const PRONTO_CORE_CHORES = [
  { id: 'chore-sweep-mop', name: 'Sweeping & Mopping', category: 'Floor Care', duration: 30, price: 199, icon: '🧹', desc: 'Brooming, microfiber floor scrub & skirting sanitization' },
  { id: 'chore-utensils', name: 'Utensils & Sink Scrub', category: 'Kitchen Care', duration: 25, price: 179, icon: '🍽️', desc: 'Wash dishes, sink degrease & drying rack stacking' },
  { id: 'chore-cook-prep', name: 'Kitchen Meal Prep & Cooking', category: 'Cooking', duration: 45, price: 299, icon: '🍳', desc: 'Veggie chopping, dough kneading & 2-dish fresh home cooking' },
  { id: 'chore-bathroom', name: 'Bathroom Deep Sanitization', category: 'Deep Clean', duration: 35, price: 249, icon: '🚿', desc: 'Tiles scrub, commode disinfection, mirror polish & drain cleaning' },
  { id: 'chore-dusting', name: 'Dusting & Surface Wiping', category: 'General Cleaning', duration: 25, price: 169, icon: '🪟', desc: 'Shelves, electronics, sofa fabric, table wipedown' },
  { id: 'chore-laundry', name: 'Laundry & Clothes Folding', category: 'Wardrobe', duration: 30, price: 189, icon: '🧺', desc: 'Washing machine load, balcony clothes hanging & crisp folding' },
  { id: 'chore-fridge', name: 'Fridge Clean & Defrost', category: 'Appliance Care', duration: 25, price: 199, icon: '❄️', desc: 'Shelf removal, food sorting & deodorizing interior scrub' },
  { id: 'chore-balcony', name: 'Balcony Wash & Plant Care', category: 'Outdoor', duration: 20, price: 149, icon: '🌿', desc: 'Floor jetting, railing dust & plant watering' },
];

function CustomerBookingHubPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceIdParam = searchParams.get('serviceId');

  // Booking Configuration State
  const [isInstant, setIsInstant] = useState(true);
  const [isProntoVerified, setIsProntoVerified] = useState(true);
  const [services, setServices] = useState<any[]>([]);
  const [selectedChoreIds, setSelectedChoreIds] = useState<string[]>(['chore-sweep-mop', 'chore-utensils']);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

      const sList = servicesRes?.data || (Array.isArray(servicesRes) ? servicesRes : []);
      const aList = addrRes?.data || (Array.isArray(addrRes) ? addrRes : []);

      // If backend services exist, map them; otherwise use PRONTO_CORE_CHORES as high-fidelity base
      if (sList && sList.length > 0) {
        setServices(sList);
        if (serviceIdParam) {
          setSelectedChoreIds([serviceIdParam]);
        }
      } else {
        setServices(PRONTO_CORE_CHORES);
      }

      setAddresses(aList);
      if (aList.length > 0) {
        setSelectedAddressId(aList[0].id);
      }
    } catch (e) {
      console.warn('Initial data note:', e);
      setServices(PRONTO_CORE_CHORES);
    } finally {
      setLoading(false);
    }
  };

  const choreCatalog = services.length > 0 ? services : PRONTO_CORE_CHORES;

  const toggleChore = (choreId: string) => {
    if (selectedChoreIds.includes(choreId)) {
      if (selectedChoreIds.length === 1) return; // Keep at least one chore
      setSelectedChoreIds(selectedChoreIds.filter((id) => id !== choreId));
    } else {
      setSelectedChoreIds([...selectedChoreIds, choreId]);
    }
  };

  // Pricing & duration calculations
  const selectedChores = choreCatalog.filter((c) => selectedChoreIds.includes(c.id));
  const totalDuration = selectedChores.reduce((sum, c) => sum + (c.duration || 30), 0);
  const subtotal = selectedChores.reduce((sum, c) => {
    const price = c.pricing_rules?.[0]?.base_price || c.price || 199;
    return sum + (Number(price > 10000 ? price / 100 : price) || 199);
  }, 0);

  // Pronto signature: 15% discount when stacking 2+ chores in a single pro visit
  const stackingDiscount = selectedChores.length >= 2 ? Math.round(subtotal * 0.15) : 0;
  const taxableAmount = subtotal - stackingDiscount;
  const gst = Math.round(taxableAmount * 0.18);
  const platformFee = 29; // Ultra-transparent minimal fee
  const totalAmount = taxableAmount + gst + platformFee;

  const handleProceedToSchedule = () => {
    if (selectedChores.length === 0) {
      setError('Please select at least one chore.');
      return;
    }

    const store = useBookingStore.getState();
    const primaryService = selectedChores[0];
    store.setService({
      id: primaryService.id,
      name: primaryService.name,
      description: primaryService.desc || primaryService.description,
      pricing_rules: [{ base_price: primaryService.price || 199 }],
      category: { name: primaryService.category?.name || primaryService.category || 'Household Chore' },
    } as any);

    store.setProntoVerified(isProntoVerified);
    store.setSchedule(isInstant, new Date().toISOString().split('T')[0]);

    if (selectedAddressId) {
      const matchedAddr = addresses.find((a) => a.id === selectedAddressId);
      if (matchedAddr) store.setAddress(matchedAddr);
    }

    router.push('/customer/booking/schedule');
  };

  return (
    <div className="space-y-6 font-body pb-16">
      <BookingStepper currentStep={1} />

      {/* Hero Headline Card (Crisp Border, Thin Montserrat) */}
      <div className="bg-white border border-slate-200 rounded-md p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
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
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-sm text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Left Chore Configurator / Right Sticky Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Step 1: Dispatch Speed */}
          <div className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-semibold font-heading text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-emerald-600" />
                1. Delivery Preference
              </h2>
              <span className="text-[11px] text-slate-400">Step 1 of 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsInstant(true)}
                className={`p-4 rounded-sm border text-left transition flex items-start justify-between ${
                  isInstant
                    ? 'border-emerald-600 bg-emerald-50/40 text-slate-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-heading font-medium text-sm">
                    <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                    Instant Dispatch (10-15 Mins)
                  </div>
                  <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                    Nearest verified helper dispatched immediately to your doorstep.
                  </p>
                </div>
                <div className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 mt-0.5 ${
                  isInstant ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                }`}>
                  {isInstant && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsInstant(false)}
                className={`p-4 rounded-sm border text-left transition flex items-start justify-between ${
                  !isInstant
                    ? 'border-emerald-600 bg-emerald-50/40 text-slate-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-heading font-medium text-sm">
                    <Clock className="w-4 h-4 text-slate-600" />
                    Schedule for Later
                  </div>
                  <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                    Pick your exact date & 90-minute slot or set a recurring daily pass.
                  </p>
                </div>
                <div className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 mt-0.5 ${
                  !isInstant ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                }`}>
                  {!isInstant && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Task Stacking Chore Selector */}
          <div className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-semibold font-heading text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  2. Stack Chores (Pronto Multi-Tasking)
                </h2>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Click to select multiple chores for your single visit.
                </p>
              </div>

              {selectedChores.length >= 2 && (
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-sm flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  15% Bundle Discount Applied
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {choreCatalog.map((chore) => {
                const isSelected = selectedChoreIds.includes(chore.id);
                const price = chore.pricing_rules?.[0]?.base_price || chore.price || 199;
                const formattedPrice = price > 10000 ? price / 100 : price;

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
                        <div className="flex items-center gap-1.5">
                          {chore.icon && <span className="text-sm">{chore.icon}</span>}
                          <span className="text-xs font-semibold font-heading text-slate-900">
                            {chore.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {chore.desc || chore.description || 'Verified domestic task'}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                          <span>~{chore.duration || 30} mins</span>
                          <span>•</span>
                          <span className="text-slate-600 font-medium">
                            {chore.category?.name || chore.category || 'Household'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <span className="text-xs font-semibold text-slate-900 font-heading">
                        ₹{formattedPrice}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Pronto Verified Security Suite */}
          <div className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-sm bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold font-heading text-slate-900 uppercase tracking-wide">
                    Pronto Verified: Encrypted Bodycam Security Session
                  </h3>
                  <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                    Partner is equipped with an encrypted bodycam recording throughout the visit for total household safety. Automated face blurring applied; auto-purged within 48 hours unless dispute raised.
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
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-sm peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-sm after:h-4 after:w-4 after:transition-all peer-checked:bg-[#05AC5F]"></div>
              </label>
            </div>
          </div>

          {/* Step 4: Service Location Quick Confirm */}
          <div className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-semibold font-heading text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-emerald-600" />
                3. Service Location
              </h2>
              <Link
                href="/customer/booking/address"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Change Address
              </Link>
            </div>

            {addresses.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-200 rounded-sm text-center">
                <p className="text-xs text-slate-500 mb-2">No saved address selected.</p>
                <Link
                  href="/customer/booking/address"
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-sm hover:bg-emerald-100 transition inline-block font-heading"
                >
                  Enter Address Details
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-3 rounded-sm border cursor-pointer transition text-xs ${
                      selectedAddressId === addr.id
                        ? 'border-emerald-600 bg-emerald-50/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-semibold text-slate-900 flex items-center justify-between mb-1 font-heading">
                      <span>{addr.address_type || 'Home Address'}</span>
                      {selectedAddressId === addr.id && (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-slate-600 line-clamp-1">{addr.address_line_1}</p>
                    <p className="text-slate-400 mt-0.5 text-[11px]">{addr.city} - {addr.pincode}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Sticky Summary & Checkout */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sticky top-24 space-y-5">
            
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold font-heading text-slate-900 uppercase tracking-wider">
                Visit Summary
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {selectedChores.length} Chores Stacked · ~{totalDuration} Mins Duration
              </p>
            </div>

            {/* Stacked Chores list */}
            <div className="space-y-2 text-xs">
              {selectedChores.map((chore) => {
                const price = chore.pricing_rules?.[0]?.base_price || chore.price || 199;
                const formattedPrice = price > 10000 ? price / 100 : price;
                return (
                  <div key={chore.id} className="flex justify-between items-center text-slate-700">
                    <span className="truncate max-w-[190px]">{chore.name}</span>
                    <span className="font-semibold text-slate-900 font-heading">₹{formattedPrice}</span>
                  </div>
                );
              })}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-slate-100 pt-3.5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Task Subtotal</span>
                <span className="font-heading">₹{subtotal}</span>
              </div>

              {stackingDiscount > 0 && (
                <div className="flex justify-between text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-sm">
                  <span>Stacking Discount (15%)</span>
                  <span className="font-heading">-₹{stackingDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>GST (18%)</span>
                <span className="font-heading">₹{gst}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Transparent Convenience Fee</span>
                <span className="font-heading">₹{platformFee}</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline font-bold text-base text-slate-900">
                <span className="font-heading">Total Payable</span>
                <span className="text-lg font-semibold text-emerald-700 font-heading">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            {/* Pronto Quality Guarantee */}
            <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 flex items-start gap-2.5 text-[11px] text-slate-600 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Full ₹10,000 damage coverage & free partner replacement if unsatisfied.</span>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleProceedToSchedule}
              disabled={submitting}
              className="w-full py-3 px-4 bg-[#05AC5F] hover:bg-[#049652] text-white font-medium text-xs uppercase tracking-wider rounded-sm shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2 font-heading"
            >
              <span>Continue to Timing (Step 2)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function CustomerBookingHubPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-slate-500 font-body">Loading booking hub...</div>}>
      <CustomerBookingHubPageContent />
    </React.Suspense>
  );
}

