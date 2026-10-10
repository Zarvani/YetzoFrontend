'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomerSupportScreen() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', description: '' });

  const fetchTickets = async () => {
    try {
      const res = await apiClient<any>('tickets/');
      setTickets(res?.results || res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreate = async () => {
    try {
      await apiClient('tickets/', { method: 'POST', body: newTicket });
      setIsCreating(false);
      setNewTicket({ subject: '', description: '' });
      fetchTickets();
    } catch (e) {
      alert("Failed to create ticket");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center sticky top-0 z-50">
        <button onClick={() => router.back()} className="mr-4 text-slate-600 hover:text-slate-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="text-lg font-bold text-slate-900">Customer Support</h1>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-slate-900">Support Tickets</h2>
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="text-purple-600 font-bold text-sm bg-purple-50 px-4 py-2 rounded-xl hover:bg-purple-100 transition-colors"
          >
            {isCreating ? 'Cancel' : '+ New Ticket'}
          </button>
        </div>

        <AnimatePresence>
          {isCreating && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="space-y-4">
                <input type="text" placeholder="Subject" value={newTicket.subject} onChange={e => setNewTicket({...newTicket, subject: e.target.value})} className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none" />
                <textarea placeholder="Describe your issue..." value={newTicket.description} onChange={e => setNewTicket({...newTicket, description: e.target.value})} className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none" />
                <button onClick={handleCreate} disabled={!newTicket.subject || !newTicket.description} className="w-full bg-purple-600 text-white font-bold py-3.5 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50">
                  Submit Ticket
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
           <div className="animate-pulse space-y-4">
             <div className="h-24 bg-slate-200 rounded-2xl w-full"></div>
             <div className="h-24 bg-slate-200 rounded-2xl w-full"></div>
           </div>
        ) : tickets.length === 0 && !isCreating ? (
          <div className="text-center py-12 text-slate-500 font-medium bg-white rounded-2xl border border-slate-100">
            No support tickets found. How can we help?
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <motion.div key={ticket.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900">{ticket.subject}</h4>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${ticket.status === 'open' ? 'bg-yellow-100 text-yellow-700' : ticket.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                    {ticket.status || 'OPEN'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{ticket.description}</p>
                <div className="text-xs text-slate-400 font-medium">Ticket ID: #{ticket.id?.substring(0,8)} • {new Date(ticket.created_at).toLocaleDateString()}</div>
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
