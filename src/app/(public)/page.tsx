'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, Clock, ShieldCheck, MapPin, Check, 
  ArrowRight, Star, Layers, Sparkles, Repeat, 
  Lock, Award 
} from 'lucide-react';

// Pronto-competitive core chores with realistic durations & pricing
const FEATURED_CHORES = [
  { id: 'chore-sweep-mop', name: 'Sweeping & Mopping', duration: 30, price: 199, icon: '🧹', desc: 'Brooming, microfiber floor scrub & skirting sanitization', eta: '12m' },
  { id: 'chore-utensils', name: 'Utensils & Sink Scrub', duration: 25, price: 179, icon: '🍽️', desc: 'Wash dishes, sink degrease & drying rack stacking', eta: '10m' },
  { id: 'chore-cook-prep', name: 'Kitchen Meal Prep & Cooking', duration: 45, price: 299, icon: '🍳', desc: 'Veggie chopping, dough kneading & 2-dish fresh home cooking', eta: '15m' },
  { id: 'chore-bathroom', name: 'Bathroom Deep Sanitization', duration: 35, price: 249, icon: '🚿', desc: 'Tiles scrub, commode disinfection, mirror polish & drain cleaning', eta: '14m' },
  { id: 'chore-dusting', name: 'Dusting & Surface Wiping', duration: 25, price: 169, icon: '🪟', desc: 'Shelves, electronics, sofa fabric, table wipedown', eta: '11m' },
  { id: 'chore-laundry', name: 'Laundry & Clothes Folding', duration: 30, price: 189, icon: '🧺', desc: 'Washing machine load, balcony clothes hanging & crisp folding', eta: '12m' },
];

export default function Homepage() {
  // Interactive Task Stacking state for live demo on homepage
  const [selectedChores, setSelectedChores] = useState<string[]>(['chore-sweep-mop', 'chore-utensils']);
  const [activeTab, setActiveTab] = useState<'instant' | 'later' | 'recurring'>('instant');

  const toggleStackChore = (id: string) => {
    if (selectedChores.includes(id)) {
      if (selectedChores.length === 1) return;
      setSelectedChores(selectedChores.filter((c) => c !== id));
    } else {
      setSelectedChores([...selectedChores, id]);
    }
  };

  const stackedItems = FEATURED_CHORES.filter((c) => selectedChores.includes(c.id));
  const demoDuration = stackedItems.reduce((acc, c) => acc + c.duration, 0);
  const demoSubtotal = stackedItems.reduce((acc, c) => acc + c.price, 0);
  const demoDiscount = stackedItems.length >= 2 ? Math.round(demoSubtotal * 0.15) : 0;
  const demoTotal = demoSubtotal - demoDiscount + 29;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-body text-slate-900">
      
      {/* 01. Hero Section */}
      <section className="bg-white border-b border-slate-200 relative overflow-hidden pt-10 pb-16 sm:pb-24">
        {/* Subtle geometric gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Proposition & Booking CTA */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Live Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#05AC5F]"></span>
                </span>
                <span className="font-heading font-medium tracking-wide">
                  15-Minute Instant House Help · 48 Pros Online Near You
                </span>
              </div>

              {/* Thin Montserrat Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-[200] font-heading text-slate-900 tracking-tight leading-[1.08]">
                  Trusted house help, <br />
                  <span className="font-[400] text-emerald-700">at your door in minutes.</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed font-body">
                  Instant domestic maids, cooks, deep cleaning & utensils on demand. 100% police verified, SOP trained, and insured with ₹10,000 damage protection.
                </p>
              </div>

              {/* Instant vs Scheduled Mode Tabs */}
              <div className="pt-2">
                <div className="p-1 bg-slate-100 rounded-sm inline-flex border border-slate-200 text-xs font-heading">
                  <button
                    onClick={() => setActiveTab('instant')}
                    className={`px-4 py-2 rounded-sm transition flex items-center gap-1.5 ${
                      activeTab === 'instant' ? 'bg-white text-slate-900 font-medium shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-[#05AC5F] fill-[#05AC5F]" />
                    <span>Instant (15 Mins)</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('later')}
                    className={`px-4 py-2 rounded-sm transition flex items-center gap-1.5 ${
                      activeTab === 'later' ? 'bg-white text-slate-900 font-medium shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Schedule Ahead</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('recurring')}
                    className={`px-4 py-2 rounded-sm transition flex items-center gap-1.5 ${
                      activeTab === 'recurring' ? 'bg-white text-slate-900 font-medium shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Repeat className="w-3.5 h-3.5 text-amber-500" />
                    <span>Daily Maid Pass</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/customer/booking"
                  className="px-7 py-3.5 bg-[#05AC5F] hover:bg-[#049652] text-white font-medium text-xs uppercase tracking-wider rounded-sm shadow-sm transition flex items-center justify-center gap-2 font-heading"
                >
                  <span>Book Instant Help (15-Min SLA)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/customer/booking/schedule"
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-medium text-xs uppercase tracking-wider rounded-sm transition flex items-center justify-center gap-2 font-heading"
                >
                  <span>Explore Daily Routine Pass</span>
                </Link>
              </div>

              {/* Social Proof Strip */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {'★'.repeat(5)}
                  </div>
                  <strong className="text-slate-900 font-semibold font-heading">4.8 / 5</strong>
                  <span>(42,700+ homes)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#05AC5F]" />
                  <span>100% Background & Police Verified</span>
                </div>
              </div>

            </div>

            {/* Right Column: Live Radar Simulation & Dispatch Card */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200 rounded-md p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-5">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#05AC5F] animate-ping"></span>
                    <span className="text-xs font-semibold font-heading uppercase tracking-wider text-slate-900">
                      Live Hyper-Local Dispatch
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm font-semibold">
                    ~12 Min Arrival
                  </span>
                </div>

                {/* Radar Visual */}
                <div className="relative h-44 bg-slate-900 rounded-sm overflow-hidden flex items-center justify-center border border-slate-800">
                  {/* Concentric rings */}
                  <div className="absolute w-36 h-36 rounded-full border border-emerald-500/20 animate-ping"></div>
                  <div className="absolute w-24 h-24 rounded-full border border-emerald-500/30"></div>
                  <div className="absolute w-12 h-12 rounded-full border border-emerald-500/50"></div>
                  
                  {/* Center beacon */}
                  <div className="w-4 h-4 rounded-full bg-[#05AC5F] shadow-[0_0_16px_#05AC5F] z-10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>

                  {/* Micro Pro markers */}
                  <div className="absolute top-8 left-14 bg-white/90 text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow">
                    Pro · 6m away
                  </div>
                  <div className="absolute bottom-10 right-12 bg-white/90 text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow">
                    Pro · 11m away
                  </div>

                  <div className="absolute bottom-2 left-3 text-[10px] text-emerald-400 font-mono">
                    Searching 3km radius · 48 active pros
                  </div>
                </div>

                {/* Live Pro Profile Snapshot */}
                <div className="p-3 bg-slate-50 rounded-sm border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-emerald-800 text-white font-heading font-medium flex items-center justify-center text-sm">
                      RK
                    </div>
                    <div>
                      <div className="text-xs font-semibold font-heading text-slate-900">Radha Kumari</div>
                      <div className="text-[11px] text-slate-500">SOP Certified · 1,840+ house visits</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-sm">
                      ★ 4.9
                    </span>
                  </div>
                </div>

                <Link
                  href="/customer/booking"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs uppercase tracking-wider rounded-sm transition flex items-center justify-center gap-1.5 font-heading"
                >
                  <span>Dispatch Helper to My Location</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 02. Task Stacking Showcase (Pronto Core Feature) */}
      <section className="py-16 sm:py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#05AC5F] font-bold font-heading">
              Pronto Signature Feature
            </span>
            <h2 className="text-3xl sm:text-4xl font-[200] font-heading text-slate-900 tracking-tight">
              Why pay separate fees? <br />
              <span className="font-[400] text-slate-900">Stack chores in one single visit.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-body">
              Combine sweeping, dishwashing, cooking, and bathroom cleaning. One certified professional handles everything without double base charges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Chores Grid (Left 8 cols) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURED_CHORES.map((chore) => {
                const isSelected = selectedChores.includes(chore.id);
                return (
                  <div
                    key={chore.id}
                    onClick={() => toggleStackChore(chore.id)}
                    className={`p-4 rounded-sm border cursor-pointer transition flex items-start justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{chore.icon}</span>
                          <h3 className="text-xs font-semibold font-heading text-slate-900">
                            {chore.name}
                          </h3>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                          {chore.desc}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                          <span>~{chore.duration} mins</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium">ETA {chore.eta}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <span className="text-xs font-semibold font-heading text-slate-900">
                        ₹{chore.price}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Interactive Counter (Right 4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-[#0B0F19] text-white rounded-md p-6 shadow-xl space-y-5 border border-slate-800 sticky top-24">
                
                <div className="border-b border-white/10 pb-4">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-heading">
                    Live Stacking Calculator
                  </span>
                  <div className="text-xl font-[300] font-heading mt-1">
                    {stackedItems.length} Chores Combined
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Estimated duration: <strong className="text-white">{demoDuration} minutes</strong>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {stackedItems.map((c) => (
                    <div key={c.id} className="flex justify-between items-center text-slate-300">
                      <span className="truncate max-w-[180px]">{c.name}</span>
                      <span className="font-heading">₹{c.price}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Task Subtotal</span>
                    <span className="font-heading">₹{demoSubtotal}</span>
                  </div>

                  {demoDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold bg-emerald-950/60 p-2 rounded-sm border border-emerald-800/40">
                      <span>Stacking Discount (15%)</span>
                      <span className="font-heading">-₹{demoDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-400">
                    <span>Platform & Insurance Fee</span>
                    <span className="font-heading">₹29</span>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex justify-between items-baseline text-base font-bold text-white">
                    <span className="font-heading">Total Payable</span>
                    <span className="text-xl text-emerald-400 font-heading">₹{demoTotal}</span>
                  </div>
                </div>

                <Link
                  href="/customer/booking"
                  className="w-full py-3 bg-[#05AC5F] hover:bg-[#049652] text-white font-medium text-xs uppercase tracking-wider rounded-sm shadow-sm transition flex items-center justify-center gap-2 font-heading"
                >
                  <span>Book This Task Bundle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 03. Pronto-Verified Safety & Technology Section */}
      <section className="py-16 sm:py-20 border-b border-slate-200 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#05AC5F] font-bold font-heading">
              Safety & Compliance
            </span>
            <h2 className="text-3xl sm:text-4xl font-[200] font-heading text-slate-900 tracking-tight">
              Safety standards that lead the industry.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-body">
              Every professional undergoes a 4-tier verification protocol before entering any customer home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-3 shadow-sm">
              <div className="w-9 h-9 rounded-sm bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-medium font-heading text-slate-900">
                100% Police & Govt ID Verified
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Biometric Aadhaar check, permanent address verification, and court criminal history clearance conducted by third-party background certifiers.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-3 shadow-sm">
              <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-medium font-heading text-slate-900">
                Encrypted Bodycam Session
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Optional bodycam recording session. Video is encrypted on device, automatically face-blurred, and purged after 48 hours unless a dispute is flagged.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-3 shadow-sm">
              <div className="w-9 h-9 rounded-sm bg-amber-100 text-amber-800 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-medium font-heading text-slate-900">
                ₹10,000 Property Damage Cover
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complimentary damage protection warranty for every single booking. Accidental breakage during service is settled within 24 hours.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 04. 11 Cities Coverage Strip */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold font-heading">
                Operational Reach
              </span>
              <h3 className="text-xl font-[300] font-heading text-slate-900">
                Serving 11 Metropolitan Cities
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Express 15-minute dispatch available across all major micro-clusters.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-medium">
              {[
                'Bengaluru', 'Mumbai', 'Delhi NCR', 'Gurgaon', 'Noida', 
                'Pune', 'Hyderabad', 'Faridabad', 'Ghaziabad', 'Navi Mumbai', 'Thane'
              ].map((city) => (
                <span
                  key={city}
                  className="px-2.5 py-1 rounded-sm bg-slate-50 border border-slate-200 text-slate-700 hover:border-emerald-500 transition"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 05. App Download Banner */}
      <section className="py-16 bg-[#0B0F19] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold font-heading">
              Yetzo Mobile App
            </span>
            <h2 className="text-2xl sm:text-3xl font-[200] font-heading">
              Book domestic help in seconds from your phone.
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              Download the Yetzo Customer App on iOS and Android for live GPS tracking, instant rebooking, and exclusive routine pass pricing.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-white text-slate-900 text-xs font-semibold rounded-sm hover:bg-slate-100 transition font-heading flex items-center gap-2"
            >
              <span>Google Play</span>
            </a>
            <a
              href="https://apple.com"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-white text-slate-900 text-xs font-semibold rounded-sm hover:bg-slate-100 transition font-heading flex items-center gap-2"
            >
              <span>App Store</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
