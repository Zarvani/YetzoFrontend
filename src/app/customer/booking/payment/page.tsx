'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function SecurePaymentScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const payload = await apiClient('carts/');
        setData(payload);
      } catch (err: any) {
        setError(err.message || "Failed to load checkout details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealData();
  }, []);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Create Booking & Escrow Entries
      await apiClient('carts/checkout/', { method: 'POST', body: {} });
      // Redirect to Booking Dashboard
      router.push('/customer/bookings');
    } catch (e: any) {
      alert("Checkout failed: " + e.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center sticky top-0 z-50">
        <button onClick={() => router.back()} className="mr-4 text-slate-600 hover:text-slate-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="text-lg font-bold text-slate-900">Secure Payment</h1>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-6">
        
        {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              <div className="w-full">
                <h3 className="font-semibold text-red-900">Checkout Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
        )}

        {isLoading ? (
           <div className="animate-pulse space-y-4 mt-4">
             <div className="h-48 bg-slate-200 rounded-3xl w-full"></div>
             <div className="h-16 bg-slate-200 rounded-3xl w-full"></div>
             <div className="h-16 bg-slate-200 rounded-3xl w-full"></div>
           </div>
        ) : !data ? (
          <div className="text-center py-20 text-slate-500 font-medium">Cart is empty.</div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Amount Summary */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-900/5 text-center">
              <p className="text-slate-500 font-bold tracking-widest uppercase text-xs mb-2">Total Amount to Pay</p>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight">₹{data.grand_total}</h2>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 text-lg">Select Payment Method</h3>
              
              <label className="flex items-center justify-between p-4 border border-blue-600 bg-blue-50/50 rounded-2xl cursor-pointer mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Credit / Debit Card</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Instant processing via Escrow</p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-4 border-blue-600 bg-white"></div>
              </label>

              <label className="flex items-center justify-between p-4 border border-slate-200 hover:border-slate-300 bg-white rounded-2xl cursor-pointer opacity-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Cash on Delivery</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Not available for this service</p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
              </label>
            </div>

            {/* Escrow Trust Badge */}
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl">
              <svg className="w-6 h-6 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              <div>
                <h4 className="font-bold text-green-900 text-sm">Escrow Protection Active</h4>
                <p className="text-xs text-green-700 font-medium mt-1">Your payment is held securely in an Escrow Ledger and is only released to the professional when the job is marked complete.</p>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/20 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </>
              ) : (
                `Pay ₹${data.grand_total} & Book`
              )}
            </button>
          </motion.div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 pb-safe z-50">
        <div className="max-w-xl mx-auto flex justify-around p-2">
          <button onClick={() => router.push('/customer/home')} className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button onClick={() => router.push('/customer/bookings')} className="flex flex-col items-center p-2 text-blue-600">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            <span className="text-[10px] font-bold">Bookings</span>
          </button>
          <button onClick={() => router.push('/customer/account')} className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <span className="text-[10px] font-bold">Account</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
