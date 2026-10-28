'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

function ServiceDetailContent() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const fetchRealData = async () => {
      if (!slug) return;
      try {
        const payload: any = await apiClient(`services/${slug}/`);
        setData(payload);
        setCartTotal(payload.base_price || 499);
      } catch (err: any) {
        setError(err.message || "Failed to load service details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealData();
  }, [slug]);

  // Dynamic SEO Injection
  useEffect(() => {
    if (data?.seo_title) document.title = data.seo_title;
    if (data?.seo_description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', data.seo_description);
    }
  }, [data]);

  const toggleAddon = (addon: any) => {
    const newSet = new Set(selectedAddons);
    if (newSet.has(addon.id)) {
      newSet.delete(addon.id);
      setCartTotal(prev => prev - addon.price);
    } else {
      newSet.add(addon.id);
      setCartTotal(prev => prev + addon.price);
    }
    setSelectedAddons(newSet);
  };

  const proceedToCart = async () => {
    try {
      await apiClient('carts/add/', {
        method: 'POST',
        body: { 
          service_id: data?.id, 
          addons: Array.from(selectedAddons) 
        }
      });
      router.push('/customer/cart');
    } catch(e) {
      // Proceed anyway for local dev if proxy isn't fully up
      router.push('/customer/booking/schedule');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Loading service details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-24 md:pb-0">
      
      {/* Mobile Navbar - Transparent to Solid on scroll */}
      <header className="md:hidden fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-4 flex items-center justify-between transition-all">
        <button onClick={() => router.back()} className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-4 items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-slate-500 hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <img src="/assets/images/logo.png" alt="Yetzo" className="h-6 opacity-80" />
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto md:px-8 md:py-8 grid md:grid-cols-12 gap-8 relative">
        
        {/* Left Column: Media & Details */}
        <div className="md:col-span-8">
          
          {/* Cover Media */}
          <div className="w-full h-[40vh] md:h-[500px] md:rounded-3xl overflow-hidden relative shadow-lg">
            {data?.image_url || data?.image ? (
              <img src={data.image_url || data.image} alt={data.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center"><span className="text-slate-400">No Image</span></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
              <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Yetzo Premium</span>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight"
              >
                {data?.name || 'Service Details'}
              </motion.h1>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-4 mt-4 text-white/90 font-medium text-sm md:text-base"
              >
                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> 
                  {data?.rating || '4.82'} ({data?.reviews_count || '12.4k'} reviews)
                </span>
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-1">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   {data?.estimated_duration_minutes || data?.duration || '45 mins'}
                </span>
              </motion.div>
            </div>
          </div>

          <div className="p-6 md:p-0 md:mt-10 space-y-10">
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-8">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div>
                <span className="text-xs font-bold text-slate-700">Verified<br/>Professionals</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                <span className="text-xs font-bold text-slate-700">Transparent<br/>Pricing</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg></div>
                <span className="text-xs font-bold text-slate-700">Yetzo<br/>Guarantee</span>
              </div>
            </div>

            {/* About / Description */}
            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">About this service</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-lg">{data?.description || 'Experience premium service quality delivered by verified professionals at your doorstep.'}</p>
            </section>
            
            {/* What's Included / Excluded (Urban Company Style) */}
            <section className="grid md:grid-cols-2 gap-6 bg-white p-6 md:p-8 rounded-3xl border border-slate-200">
               <div>
                 <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> What's Included
                 </h4>
                 <ul className="space-y-3 text-slate-600 font-medium text-sm">
                   <li>• Thorough inspection & diagnosis</li>
                   <li>• Standard cleaning of accessible parts</li>
                   <li>• Post-service cleanup of the area</li>
                   <li>• 30-Day service warranty</li>
                 </ul>
               </div>
               <div>
                 <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> What's Excluded
                 </h4>
                 <ul className="space-y-3 text-slate-600 font-medium text-sm">
                   <li>• Spare parts (billed separately)</li>
                   <li>• Major masonry or civil work</li>
                   <li>• Gas refilling (unless selected in addons)</li>
                 </ul>
               </div>
            </section>
            
            {/* Addons Grid */}
            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Frequently added together</h3>
              <div className="space-y-4">
                {data?.addons && data.addons.length > 0 ? (
                  data.addons.map((addon: any) => {
                    const isSelected = selectedAddons.has(addon.id);
                    return (
                      <div 
                        key={addon.id} 
                        onClick={() => toggleAddon(addon)}
                        className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-blue-300'}`}
                      >
                        <div className="flex-1">
                          <h4 className={`font-bold text-lg mb-1 ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>{addon.name}</h4>
                          <p className="text-sm text-slate-500 font-medium">Adds ~{addon.duration_minutes || 15} mins • Highly Recommended</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-extrabold text-slate-900">₹{addon.price}</span>
                          <button className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 text-slate-300'}`}>
                            {isSelected ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="p-8 bg-slate-100 rounded-3xl text-slate-500 font-medium text-center border-2 border-dashed border-slate-300">
                    No extra addons available for this service.
                  </div>
                )}
              </div>
            </section>

          </div>
        </div>

        {/* Right Column: Desktop Sticky Checkout Card */}
        <div className="hidden md:block md:col-span-4">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 sticky top-[100px]">
            <h3 className="text-4xl font-black text-slate-900 mb-2">₹{cartTotal}</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">Base price • Taxes calculated at checkout</p>
            
            <div className="bg-blue-50 text-blue-800 p-4 rounded-2xl mb-8 flex items-start gap-3 text-sm font-medium">
              <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
              You're completely protected by the Yetzo Service Guarantee. Don't pay until the job is done right.
            </div>
            
            <button 
              onClick={proceedToCart}
              className="w-full bg-blue-600 text-white font-extrabold py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 text-lg hover:scale-[1.02]"
            >
              Continue to Cart
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Booking Bar (Urban Company Style) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 px-6 pb-safe flex items-center justify-between z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <div>
           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Price</p>
           <h3 className="text-2xl font-black text-slate-900">₹{cartTotal}</h3>
        </div>
        <button 
          onClick={proceedToCart}
          className="bg-blue-600 text-white font-extrabold py-3.5 px-8 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
        >
          Book Now
        </button>
      </div>

    </div>
  );
}

export default function ServiceDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <ServiceDetailContent />
    </Suspense>
  );
}
