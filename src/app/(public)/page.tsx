'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Zap, Clock, ShieldCheck, MapPin, Check,
  ArrowRight, Star, Layers, Sparkles, Repeat,
  Lock, Award, Utensils, ChefHat, Bath, Shirt,
  Wrench, Hammer, Wind, Bug, Paintbrush, Truck, Droplets
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { useLocationStore, CITIES_DATA } from '@/store/useLocationStore';
import { useBookingStore } from '@/store/useBookingStore';

// Yetzo-standard core chores with realistic durations & pricing
const FEATURED_CHORES = [
  { id: 'chore-sweep-mop', name: 'Sweeping & Mopping', duration: 30, price: 199, iconType: 'sweep', desc: 'Brooming, microfiber floor scrub & skirting sanitization', eta: '12m' },
  { id: 'chore-utensils', name: 'Utensils & Sink Scrub', duration: 25, price: 179, iconType: 'utensils', desc: 'Wash dishes, sink degrease & drying rack stacking', eta: '10m' },
  { id: 'chore-cook-prep', name: 'Kitchen Meal Prep & Cooking', duration: 45, price: 299, iconType: 'cooking', desc: 'Veggie chopping, dough kneading & 2-dish fresh home cooking', eta: '15m' },
  { id: 'chore-bathroom', name: 'Bathroom Deep Sanitization', duration: 35, price: 249, iconType: 'bath', desc: 'Tiles scrub, commode disinfection, mirror polish & drain cleaning', eta: '14m' },
  { id: 'chore-dusting', name: 'Dusting & Surface Wiping', duration: 25, price: 169, iconType: 'dusting', desc: 'Shelves, electronics, sofa fabric, table wipedown', eta: '11m' },
  { id: 'chore-laundry', name: 'Laundry & Clothes Folding', duration: 30, price: 189, iconType: 'laundry', desc: 'Washing machine load, balcony clothes hanging & crisp folding', eta: '12m' },
];

const renderChoreIcon = (type: string) => {
  switch (type) {
    case 'sweep': return <Sparkles className="w-4 h-4 text-[#2563EB]" />;
    case 'utensils': return <Utensils className="w-4 h-4 text-[#2563EB]" />;
    case 'cooking': return <ChefHat className="w-4 h-4 text-[#2563EB]" />;
    case 'bath': return <Bath className="w-4 h-4 text-[#2563EB]" />;
    case 'dusting': return <Layers className="w-4 h-4 text-[#2563EB]" />;
    case 'laundry': return <Shirt className="w-4 h-4 text-[#2563EB]" />;
    default: return <Sparkles className="w-4 h-4 text-[#2563EB]" />;
  }
};

export default function Homepage() {
  const router = useRouter();
  const { selectedCity, setSelectedCity } = useLocationStore();
  const currentCityObj = CITIES_DATA.find((c) => c.name === selectedCity) || { name: selectedCity, isOperational: true };
  const isCityOperational = currentCityObj.isOperational;

  // Interactive Task Stacking state for live demo on homepage
  const [selectedChores, setSelectedChores] = useState<string[]>(['chore-sweep-mop', 'chore-utensils']);
  const [activeTab, setActiveTab] = useState<'instant' | 'later' | 'recurring'>('instant');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [liveServices, setLiveServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(true);

  useEffect(() => {
    // Fetch live services from PostgreSQL via apiClient
    apiClient('services/')
      .then((res: any) => {
        const list = res?.data || (Array.isArray(res) ? res : res?.results || []);
        setLiveServices(list);
      })
      .catch(() => {
        // Fallback curated services if network or API not yet seeded
        setLiveServices([]);
      })
      .finally(() => {
        setLoadingServices(false);
      });
  }, []);

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
      <section id="instant-dispatch" className="bg-white border-b border-slate-200 relative overflow-hidden pt-10 pb-16 sm:pb-24">
        {/* Subtle geometric gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Value Proposition & Booking CTA */}
            <div className="lg:col-span-7 space-y-6">

              {/* Live Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-blue-50 border border-blue-200/80 text-blue-900 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]"></span>
                </span>
                <span className="font-heading font-medium tracking-wide">
                  15-Minute Instant House Help · 48 Pros Online Near You
                </span>
              </div>

              {/* Thin Montserrat Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-[200] font-heading text-slate-900 tracking-tight leading-[1.08]">
                  Trusted house help, <br />
                  <span className="font-[400] text-blue-700">at your door in minutes.</span>
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
                    className={`px-4 py-2 rounded-sm transition flex items-center gap-1.5 ${activeTab === 'instant' ? 'bg-white text-slate-900 font-medium shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-[#2563EB] fill-[#2563EB]" />
                    <span>Instant (15 Mins)</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('later')}
                    className={`px-4 py-2 rounded-sm transition flex items-center gap-1.5 ${activeTab === 'later' ? 'bg-white text-slate-900 font-medium shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Schedule Ahead</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('recurring')}
                    className={`px-4 py-2 rounded-sm transition flex items-center gap-1.5 ${activeTab === 'recurring' ? 'bg-white text-slate-900 font-medium shadow-sm' : 'text-slate-600 hover:text-slate-900'
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
                  className="px-7 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs uppercase tracking-wider rounded-sm shadow-sm transition flex items-center justify-center gap-2 font-heading"
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
                  <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                  <span>100% Background & Police Verified</span>
                </div>
              </div>

            </div>

            {/* Right Column: Live Radar Simulation & Dispatch Card */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200 rounded-md p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-5">

                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-ping"></span>
                    <span className="text-xs font-semibold font-heading uppercase tracking-wider text-slate-900">
                      Live Hyper-Local Dispatch
                    </span>
                  </div>
                  <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm font-semibold">
                    ~12 Min Arrival
                  </span>
                </div>

                {/* Radar Visual */}
                <div className="relative h-44 bg-slate-900 rounded-sm overflow-hidden flex items-center justify-center border border-slate-800">
                  {/* Concentric rings */}
                  <div className="absolute w-36 h-36 rounded-full border border-blue-500/20 animate-ping"></div>
                  <div className="absolute w-24 h-24 rounded-full border border-blue-500/30"></div>
                  <div className="absolute w-12 h-12 rounded-full border border-blue-500/50"></div>

                  {/* Center beacon */}
                  <div className="w-4 h-4 rounded-full bg-[#2563EB] shadow-[0_0_16px_#2563EB] z-10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>

                  {/* Micro Pro markers */}
                  <div className="absolute top-8 left-14 bg-white/90 text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow">
                    Pro · 6m away
                  </div>
                  <div className="absolute bottom-10 right-12 bg-white/90 text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow">
                    Pro · 11m away
                  </div>

                  <div className="absolute bottom-2 left-3 text-[10px] text-sky-400 font-mono">
                    Searching 3km radius · 48 active pros
                  </div>
                </div>

                {/* Live Pro Profile Snapshot */}
                <div className="p-3 bg-slate-50 rounded-sm border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-blue-800 text-white font-heading font-medium flex items-center justify-center text-sm">
                      YS
                    </div>
                    <div>
                      <div className="text-xs font-semibold font-heading text-slate-900">Verified Doorstep Specialist</div>
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

      {/* 02. Explore Categories & Live Services */}
      <section id="services" className="py-16 sm:py-20 border-b border-slate-200 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#2563EB] font-bold font-heading">
                Service Catalog
              </span>
              <h2 className="text-3xl sm:text-4xl font-[200] font-heading text-slate-900 tracking-tight mt-1">
                Explore Categories & Popular Services
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-body mt-1">
                Transparent flat rates, police-verified specialists, and instant 15-minute doorstep dispatch.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition font-heading uppercase tracking-wider"
            >
              <span>View All Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
            {[
              { id: 'all', name: 'All Services', icon: Sparkles },
              { id: 'maid', name: 'Maid & Chores', icon: Utensils },
              { id: 'cleaning', name: 'Deep Cleaning', icon: Bath },
              { id: 'ac', name: 'AC & Cooling', icon: Wind },
              { id: 'plumbing', name: 'Plumbing', icon: Droplets },
              { id: 'electrical', name: 'Electrical', icon: Zap },
              { id: 'carpentry', name: 'Carpentry', icon: Hammer },
              { id: 'appliance', name: 'Appliance Repair', icon: Wrench },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#2563EB]'}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {!isCityOperational ? (
            /* Coming Soon Animation & Notification State for Non-Operational Cities */
            <div className="bg-white border border-slate-200 rounded-sm p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-20 h-20 mx-auto mb-5 relative flex items-center justify-center">
                <span className="w-20 h-20 rounded-full bg-blue-100/60 animate-ping absolute"></span>
                <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] shadow-xs relative">
                  <MapPin className="w-8 h-8 animate-bounce text-[#2563EB]" />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Fleet Expansion Underway</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-[300] font-heading text-slate-900 tracking-tight">
                Yetzo is Coming to <span className="font-semibold text-[#2563EB]">{selectedCity}</span> in a few days!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                We are currently onboarding police-verified helpers, setting up micro-hubs, and calibrating our 15-minute dispatch network in {selectedCity}.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCity('Bengaluru')}
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-sm transition font-heading"
                >
                  Switch to Active City (Bengaluru)
                </button>
                <Link
                  href="/partner"
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-sm transition font-heading"
                >
                  Join as Partner in {selectedCity}
                </Link>
              </div>
            </div>
          ) : (
            /* Service Cards Grid for Operational Cities */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id: 'srv-sweep-mop',
                name: 'Express Sweeping & Mopping',
                category: 'maid',
                categoryLabel: 'Maid & Chores',
                price: 199,
                duration: '30 mins',
                rating: '4.9',
                reviews: '14,200',
                desc: 'Microfiber dual scrubbing, edge dusting, and germicidal floor sanitization.',
                badge: '15m SLA',
                image: '/images/cleaning.jpg',
                slug: 'sweeping-mopping'
              },
              {
                id: 'srv-utensils',
                name: 'Utensil Scrub & Degreasing',
                category: 'maid',
                categoryLabel: 'Maid & Chores',
                price: 179,
                duration: '25 mins',
                rating: '4.8',
                reviews: '11,800',
                desc: 'Thorough stainless & glass scrubbing, sink trap clear, drying rack stacking.',
                badge: '15m SLA',
                image: '/images/cleaning.jpg',
                slug: 'utensils-scrub'
              },
              {
                id: 'srv-cook-prep',
                name: 'Cook & Meal Preparation',
                category: 'maid',
                categoryLabel: 'Maid & Chores',
                price: 299,
                duration: '45 mins',
                rating: '4.9',
                reviews: '8,400',
                desc: 'Dough kneading, vegetable chopping, and 2-dish fresh healthy home cooking.',
                badge: 'Popular',
                image: '/images/cleaning.jpg',
                slug: 'cook-meal-prep'
              },
              {
                id: 'srv-bath-deep',
                name: 'Bathroom Tile & Acid Free Scrub',
                category: 'cleaning',
                categoryLabel: 'Deep Cleaning',
                price: 249,
                duration: '35 mins',
                rating: '4.9',
                reviews: '16,700',
                desc: 'Hard water scale removal, commode descaling, mirror buff, and drain sanitization.',
                badge: 'Top Rated',
                image: '/images/cleaning.jpg',
                slug: 'bathroom-deep-cleaning'
              },
              {
                id: 'srv-ac-deep',
                name: 'Split AC Power Jet Clean',
                category: 'ac',
                categoryLabel: 'AC & Cooling',
                price: 499,
                duration: '45 mins',
                rating: '4.9',
                reviews: '22,100',
                desc: 'High-pressure foam jet wash, cooling coil scrub, tray wipe & airflow test.',
                badge: 'Summer Special',
                image: '/images/ac-service.jpg',
                slug: 'split-ac-power-jet'
              },
              {
                id: 'srv-plumb-tap',
                name: 'Tap Leakage & Pipe Repair',
                category: 'plumbing',
                categoryLabel: 'Plumbing',
                price: 149,
                duration: '20 mins',
                rating: '4.8',
                reviews: '9,300',
                desc: 'Washer replacement, cartridge fix, jet spray fitting & angle valve check.',
                badge: '15m SLA',
                image: '/images/plumbing.jpg',
                slug: 'tap-leakage-pipe-repair'
              },
              {
                id: 'srv-elec-switch',
                name: 'Switchboard & Fan Repair',
                category: 'electrical',
                categoryLabel: 'Electrical',
                price: 129,
                duration: '20 mins',
                rating: '4.8',
                reviews: '7,900',
                desc: 'Short-circuit diagnosis, regulator replacement, and modular switch fixing.',
                badge: '15m SLA',
                image: '/images/electrical.jpg',
                slug: 'switchboard-fan-repair'
              },
              {
                id: 'srv-carp-bed',
                name: 'Bed, Table & Hinge Fixing',
                category: 'carpentry',
                categoryLabel: 'Carpentry',
                price: 249,
                duration: '40 mins',
                rating: '4.8',
                reviews: '6,400',
                desc: 'Joint tightening, hydraulic shock pump alignment & channel replacement.',
                badge: 'Quick Fix',
                image: '/images/mechanic.jpg',
                slug: 'bed-table-hinge-fixing'
              },
            ]
              .filter((s) => activeCategory === 'all' || s.category === activeCategory)
              .map((service) => (
                <div
                  key={service.id}
                  onClick={() => router.push(`/service/${service.slug}`)}
                  className="bg-white border border-slate-200 rounded-sm overflow-hidden hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between group cursor-pointer"
                >
                  {/* Service Image Header */}
                  <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-semibold text-white bg-blue-600/90 backdrop-blur-xs px-2 py-0.5 rounded-sm uppercase tracking-wider font-heading">
                        {service.badge}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-sm flex items-center gap-1 text-[11px] font-semibold text-slate-800 shadow-xs">
                      <span className="text-amber-500">★</span>
                      <span>{service.rating}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold font-heading text-slate-900 group-hover:text-[#2563EB] transition leading-snug">
                        {service.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {service.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#2563EB]" />
                        <span>Verified Pro</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-heading">Starts at</span>
                        <span className="text-base font-bold font-heading text-slate-900">
                          ₹{service.price}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const store = useBookingStore.getState();
                          store.setService({
                            id: service.id,
                            name: service.name,
                            description: service.desc,
                            pricing_rules: [{ base_price: service.price }],
                            category: { name: service.categoryLabel || 'Home Service' },
                          } as any);
                          store.setSchedule(true, new Date().toISOString().split('T')[0]);
                          router.push('/customer/booking/schedule');
                        }}
                        className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-sm tracking-wide transition flex items-center gap-1 font-heading"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 03. Task Stacking Showcase (Yetzo Core Feature) */}
      <section id="task-stacking" className="py-16 sm:py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#2563EB] font-bold font-heading">
              Yetzo Signature Feature
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
                    className={`p-4 rounded-sm border cursor-pointer transition flex items-start justify-between ${isSelected
                      ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                        }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-sm bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                            {renderChoreIcon(chore.iconType)}
                          </div>
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
                          <span className="text-blue-700 font-medium">ETA {chore.eta}</span>
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
                  <span className="text-[10px] uppercase tracking-wider text-sky-400 font-heading font-bold">
                    Live Stacking Calculator
                  </span>
                  <div className="text-xl font-[300] font-heading mt-1 text-white">
                    {stackedItems.length} Chores Combined
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Estimated duration: <strong className="text-white">{demoDuration} minutes</strong>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {stackedItems.map((c) => (
                    <div key={c.id} className="flex justify-between items-center text-slate-200">
                      <span className="truncate max-w-[180px] text-slate-200">{c.name}</span>
                      <span className="font-heading text-white">₹{c.price}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-300">Task Subtotal</span>
                    <span className="font-heading text-white">₹{demoSubtotal}</span>
                  </div>

                  {demoDiscount > 0 && (
                    <div className="flex justify-between text-sky-400 font-semibold bg-blue-950/60 p-2 rounded-sm border border-blue-800/40">
                      <span>Stacking Discount (15%)</span>
                      <span className="font-heading text-sky-300">-₹{demoDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-300">Platform & Insurance Fee</span>
                    <span className="font-heading text-white">₹29</span>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex justify-between items-baseline text-base font-bold text-white">
                    <span className="font-heading text-white">Total Payable</span>
                    <span className="text-xl text-sky-400 font-heading">₹{demoTotal}</span>
                  </div>
                </div>

                <Link
                  href={`/customer/booking?stack=${selectedChores.join(',')}`}
                  className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs uppercase tracking-wider rounded-sm shadow-sm transition flex items-center justify-center gap-2 font-heading"
                >
                  <span>Book This Task Bundle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 04. Yetzo-Verified Safety & Technology Section */}
      <section className="py-16 sm:py-20 border-b border-slate-200 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#2563EB] font-bold font-heading">
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
              <div className="w-9 h-9 rounded-sm bg-blue-100 text-blue-800 flex items-center justify-center">
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
              <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">
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
                  className="px-2.5 py-1 rounded-sm bg-slate-50 border border-slate-200 text-slate-700 hover:border-blue-500 transition"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 05. App Download Banner */}
      <section className="py-20 bg-[#0B0F19] text-white relative overflow-hidden">
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#38BDF8] font-bold font-heading">
                Yetzo Mobile Experience
              </span>
              <h2 className="text-3xl sm:text-4xl font-[200] font-heading leading-tight text-white">
                House help in 15 minutes, <br />
                <span className="text-sky-400 font-[300]">right in the palm of your hand.</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-body max-w-xl">
                Experience the fastest domestic help dispatch in India. Download the Yetzo Customer App for instant booking, live GPS technician radar, and zero-cancellation daily routine passes.
              </p>

              {/* App Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-900/60 flex items-center justify-center text-sky-400">
                    <Check className="w-3 h-3 text-sky-400 stroke-[3]" />
                  </div>
                  <span>Real-time GPS Live Telemetry</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-900/60 flex items-center justify-center text-sky-400">
                    <Check className="w-3 h-3 text-sky-400 stroke-[3]" />
                  </div>
                  <span>15% Multi-Chore Task Stacking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-900/60 flex items-center justify-center text-sky-400">
                    <Check className="w-3 h-3 text-sky-400 stroke-[3]" />
                  </div>
                  <span>Instant UPI & Card Escrow Holding</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-900/60 flex items-center justify-center text-sky-400">
                    <Check className="w-3 h-3 text-sky-400 stroke-[3]" />
                  </div>
                  <span>100% Police & SOP Verified Fleet</span>
                </div>
              </div>

              {/* Store Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold rounded-sm transition font-heading flex items-center gap-3 shadow-sm group"
                >
                  <svg className="w-5 h-5 text-slate-900 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.996 1.996 0 0 1-.61-1.436V3.25c0-.547.222-1.045.609-1.436zm11.233 11.233l2.392 2.392-11.45 6.44 9.058-8.832zm2.392-4.094l-2.392 2.392-9.058-8.832 11.45 6.44zm1.196 1.848a1.996 1.996 0 0 1 0 2.296l-1.942 1.092-2.392-2.24 2.392-2.24 1.942 1.092z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider font-body leading-none">Get it on</p>
                    <p className="font-bold text-xs leading-tight">Google Play</p>
                  </div>
                </a>
                <a
                  href="https://apple.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold rounded-sm transition font-heading flex items-center gap-3 shadow-sm group"
                >
                  <svg className="w-5 h-5 text-slate-900 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.61 1.34-.55.63-1.03 1.67-.9 2.71 1 .08 2.02-.45 2.59-1.2"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider font-body leading-none">Download on the</p>
                    <p className="font-bold text-xs leading-tight">App Store</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Right: App Preview Mockup */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative group">
                <Image
                  src="/yetzo_app_mockup.png"
                  alt="Yetzo Mobile App"
                  width={320}
                  height={560}
                  className="w-full max-w-[280px] sm:max-w-[320px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
