'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { motion } from 'framer-motion';

function ServiceDetailContent() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Real Django API Integration via Proxy
  useEffect(() => {
    const fetchRealData = async () => {
      if (!slug) return;
      try {
        const payload = await apiClient(`services/${slug}/`);
        setData(payload);
      } catch (err: any) {
        setError(err.message || "Failed to load service details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealData();
  }, [slug]);

  const addToCart = async (addonId?: string) => {
    try {
      // Step 3B: Cart Operations mapping
      await apiClient('carts/add/', {
        method: 'POST',
        body: { 
          service_id: data?.id, 
          addons: addonId ? [addonId] : [] 
        }
      });
      router.push('/customer/cart');
    } catch(e) {
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-slate-900">Service Detail</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full mx-auto pb-32">
        {/* Cover Image */}
        <div className="w-full h-64 md:h-96 bg-slate-200 relative">
          {data?.image && (
            <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-5xl mx-auto">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl md:text-5xl font-extrabold text-white tracking-tight"
            >
              {data?.name || 'Service Details'}
            </motion.h1>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 mt-4 text-white/90 font-medium"
            >
              <span className="flex items-center gap-1"><svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> {data?.rating || '4.8'}</span>
              <span>•</span>
              <span>{data?.duration || '45 mins'}</span>
            </motion.div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-6 md:p-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h3 className="text-xl font-bold text-slate-900 mb-3">About this service</h3>
              <p className="text-slate-600 leading-relaxed font-medium">{data?.description || 'Experience premium service quality delivered by verified professionals at your doorstep.'}</p>
            </motion.section>
            
            {/* Addons Grid */}
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Included & Add-ons</h3>
              <div className="space-y-4">
                {isLoading ? (
                  [1,2].map(i => <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-2xl w-full"></div>)
                ) : data?.addons && data.addons.length > 0 ? (
                  data.addons.map((addon: any) => (
                    <div key={addon.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-colors">
                      <div>
                        <h4 className="font-bold text-slate-900">{addon.name}</h4>
                        <p className="text-sm text-slate-500 font-medium">₹{addon.price}</p>
                      </div>
                      <button onClick={() => addToCart(addon.id)} className="px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors">
                        Add
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-slate-100 rounded-2xl text-slate-500 font-medium text-center border border-dashed border-slate-300">
                    Standard service package
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          <div className="md:col-span-1">
            {/* Sticky Pricing Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-24"
            >
              <h3 className="text-2xl font-black text-slate-900 mb-2">₹{data?.base_price || '499'}</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">Base price (taxes extra)</p>
              
              <ul className="space-y-3 mb-8 text-sm font-medium text-slate-700">
                <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Verified Professional</li>
                <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Service Guarantee</li>
              </ul>
              
              <button 
                onClick={() => addToCart()}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50"
              >
                Book Now
              </button>
            </motion.div>
          </div>
        </div>
      </main>
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
