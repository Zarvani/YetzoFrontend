'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { motion } from 'framer-motion';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const data: any = await apiClient('carts/cart/my_cart/');
      setCart(data?.data || data || null);
    } catch (err: any) {
      if (err.message.includes('401')) {
        router.push('/auth/login?next=/customer/cart');
      } else {
        setCart(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, increment: boolean, currentQty: number) => {
    if (!increment && currentQty <= 1) {
      await removeItem(itemId);
      return;
    }
    const newQty = increment ? currentQty + 1 : currentQty - 1;
    try {
      await apiClient(`carts/cart-items/${itemId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity: newQty })
      });
      fetchCart();
    } catch (e) {
      console.error(e);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await apiClient(`carts/cart-items/${itemId}/`, { method: 'DELETE' });
      fetchCart();
    } catch (e) {
      console.error(e);
    }
  };

  const proceedToSchedule = () => {
    router.push('/customer/booking/schedule');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Loading your cart...</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <button onClick={() => router.back()} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="text-xl font-bold text-slate-900">Cart</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-6">Looks like you haven't added any services yet.</p>
          <button onClick={() => router.push('/services')} className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl">Browse Services</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <h1 className="text-xl font-bold text-slate-900">Summary</h1>
        </div>
      </div>

      <main className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
        {cart.items.map((item: any) => (
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key={item.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                {item.service?.image_url ? (
                  <img src={item.service.image_url} alt={item.service.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-3xl">🔧</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg mb-1">{item.service?.name}</h3>
                {item.variant && <p className="text-xs text-blue-600 font-bold mb-1">{item.variant.name}</p>}
                <p className="text-slate-900 font-black mb-2">₹{((item.unit_price || 0) / 100).toLocaleString('en-IN')}</p>
                
                {item.addons?.length > 0 && (
                  <div className="space-y-2 mt-4 border-t border-slate-100 pt-4">
                    {item.addons.map((addon: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">+ {addon.addon?.name || 'Addon'}</span>
                        <span className="text-slate-900 font-bold">₹{((addon.price || 0) / 100).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center border-t border-slate-100 pt-4">
              <button onClick={() => removeItem(item.id)} className="text-red-500 font-bold text-sm bg-red-50 px-4 py-2 rounded-xl">Remove</button>
              <div className="flex items-center gap-4 bg-slate-100 p-1 rounded-xl">
                <button onClick={() => updateQuantity(item.id, false, item.quantity)} className="w-8 h-8 rounded-lg bg-white shadow-sm font-bold text-slate-700">-</button>
                <span className="font-bold text-slate-900 w-4 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, true, item.quantity)} className="w-8 h-8 rounded-lg bg-white shadow-sm font-bold text-slate-700">+</button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Coupons */}
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-300">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
             </div>
             <span className="font-bold text-slate-900">Coupons and Offers</span>
           </div>
           <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </motion.div>

        {/* Bill Details */}
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.2}} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <h3 className="font-black text-lg text-slate-900 mb-4">Payment Summary</h3>
           <div className="space-y-3 text-sm">
             <div className="flex justify-between">
               <span className="text-slate-600 font-medium">Item Total</span>
               <span className="text-slate-900 font-bold">₹{((cart.subtotal || 0)/100).toLocaleString('en-IN')}</span>
             </div>
             {cart.discount > 0 && (
               <div className="flex justify-between text-green-600">
                 <span className="font-medium">Discount</span>
                 <span className="font-bold">-₹{((cart.discount || 0)/100).toLocaleString('en-IN')}</span>
               </div>
             )}
             <div className="flex justify-between">
               <span className="text-slate-600 font-medium flex items-center gap-1">Taxes & Fee <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span>
               <span className="text-slate-900 font-bold">₹{(((cart.tax || 0) + (cart.service_fee || 0))/100).toLocaleString('en-IN')}</span>
             </div>
             <div className="flex justify-between border-t border-slate-100 pt-3 mt-3">
               <span className="text-slate-900 font-black text-lg">Total</span>
               <span className="text-slate-900 font-black text-lg">₹{((cart.total || 0)/100).toLocaleString('en-IN')}</span>
             </div>
           </div>
           {cart.discount > 0 && (
             <div className="mt-4 bg-green-50 text-green-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
               Hurray! You saved ₹{((cart.discount || 0)/100).toLocaleString('en-IN')} on this order
             </div>
           )}
        </motion.div>

        {/* Cancellation Policy */}
        <div className="p-4 bg-slate-100 rounded-2xl text-xs text-slate-500 font-medium">
          Free cancellation until 2 hours before the booked slot. After that, a cancellation fee of ₹100 will be charged.
        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 px-6 pb-safe flex items-center justify-between z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <div>
           <h3 className="text-2xl font-black text-slate-900">₹{((cart.total || 0)/100).toLocaleString('en-IN')}</h3>
           <p className="text-xs font-bold text-blue-600 cursor-pointer">View detailed bill</p>
        </div>
        <button 
          onClick={proceedToSchedule}
          className="bg-slate-900 text-white font-extrabold py-3.5 px-8 rounded-xl hover:bg-black transition-all shadow-lg"
        >
          Select Time Slot
        </button>
      </div>
    </div>
  );
}
