'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Real Django API Integration via Proxy
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const payload = await apiClient('carts/');
        setData(payload);
      } catch (err: any) {
        setError(err.message || "Failed to load cart");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealData();
  }, []);

  const removeFromCart = async (itemId: string) => {
    try {
      await apiClient(`carts/remove/${itemId}/`, { method: 'DELETE' });
      const payload = await apiClient('carts/');
      setData(payload);
    } catch (e) {
      alert("Failed to remove item");
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
          <h1 className="text-xl font-bold text-slate-900">Cart</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8">
        
        {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              <div className="w-full">
                <h3 className="font-semibold text-red-900">Cart Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
        )}

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-32 bg-slate-200 rounded-3xl w-full"></div>
            <div className="h-32 bg-slate-200 rounded-3xl w-full"></div>
            <div className="h-40 bg-slate-100 rounded-3xl mt-6 w-full md:w-1/2 ml-auto"></div>
          </div>
        ) : !data || !data.items || data.items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
            className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Your cart is empty</h3>
            <p className="text-slate-500 mt-2 mb-8 font-medium">Add some premium services to get started.</p>
            <button 
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              Browse Services
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <AnimatePresence>
                {data.items.map((item: any, idx: number) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center relative"
                  >
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 shrink-0 overflow-hidden">
                      {item.service?.image ? (
                        <img src={item.service.image} alt={item.service.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-10 h-10 text-slate-300 m-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-lg mb-1">{item.service?.name}</h4>
                      <p className="text-sm font-medium text-slate-500 mb-3">Base Price: ₹{item.service?.base_price}</p>
                      
                      {item.addons && item.addons.length > 0 && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Includes Add-ons</p>
                          {item.addons.map((addon: any) => (
                            <div key={addon.id} className="flex justify-between text-sm mb-1">
                              <span className="text-slate-700 font-medium">{addon.name}</span>
                              <span className="text-slate-900 font-bold">₹{addon.price}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end justify-between h-full gap-4">
                      <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2 bg-slate-50 rounded-full">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                      <div className="font-black text-xl text-slate-900">
                        ₹{item.total_price}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="md:col-span-1">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-24"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">Payment Summary</h3>
                
                <div className="space-y-4 mb-6 text-sm font-medium">
                  <div className="flex justify-between text-slate-600">
                    <span>Item Total</span>
                    <span className="text-slate-900 font-bold">₹{data.item_total}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Taxes & Fee</span>
                    <span className="text-slate-900 font-bold">₹{data.taxes}</span>
                  </div>
                  {data.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Membership Discount</span>
                      <span className="font-bold">-₹{data.discount}</span>
                    </div>
                  )}
                  <div className="h-px bg-slate-200 my-2 w-full"></div>
                  <div className="flex justify-between text-lg font-black text-slate-900">
                    <span>Total Amount</span>
                    <span>₹{data.grand_total}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => router.push('/customer/booking/checkout')}
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 flex justify-between items-center px-6"
                >
                  <span>Proceed</span>
                  <span>₹{data.grand_total}</span>
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
