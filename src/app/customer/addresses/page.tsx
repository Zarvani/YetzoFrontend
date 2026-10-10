'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function SavedAddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', flat: '', area: '', landmark: '' });

  const fetchAddresses = async () => {
    try {
      const payload = await apiClient<any>('addresses/');
      setAddresses(payload?.results || payload || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAdd = async () => {
    try {
      await apiClient('addresses/', { method: 'POST', body: newAddress });
      setIsAdding(false);
      setNewAddress({ label: '', flat: '', area: '', landmark: '' });
      fetchAddresses();
    } catch (e) {
      alert("Failed to add address");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient(`addresses/${id}/`, { method: 'DELETE' });
      fetchAddresses();
    } catch (e) {
      alert("Failed to delete address");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center sticky top-0 z-50">
        <button onClick={() => router.back()} className="mr-4 text-slate-600 hover:text-slate-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="text-lg font-bold text-slate-900">Saved Addresses</h1>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-slate-900">Your Addresses</h2>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
          >
            {isAdding ? 'Cancel' : '+ Add New'}
          </button>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="space-y-4">
                <input type="text" placeholder="Label (e.g. Home, Office)" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="text" placeholder="Flat, Floor, Building" value={newAddress.flat} onChange={e => setNewAddress({...newAddress, flat: e.target.value})} className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="text" placeholder="Area, Sector, Locality" value={newAddress.area} onChange={e => setNewAddress({...newAddress, area: e.target.value})} className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="text" placeholder="Landmark (Optional)" value={newAddress.landmark} onChange={e => setNewAddress({...newAddress, landmark: e.target.value})} className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                <button onClick={handleAdd} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors">
                  Save Address
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
           <div className="animate-pulse space-y-4">
             <div className="h-32 bg-slate-200 rounded-2xl w-full"></div>
             <div className="h-32 bg-slate-200 rounded-2xl w-full"></div>
           </div>
        ) : addresses.length === 0 && !isAdding ? (
          <div className="text-center py-12 text-slate-500 font-medium bg-white rounded-2xl border border-slate-100">
            No saved addresses found.
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <motion.div key={addr.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 capitalize mb-1">{addr.label || 'Address'}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{addr.flat}, {addr.area}</p>
                    {addr.landmark && <p className="text-xs text-slate-500 mt-1">Landmark: {addr.landmark}</p>}
                  </div>
                </div>
                <button onClick={() => handleDelete(addr.id)} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 p-2 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </motion.div>
            ))}
          </div>
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
