'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function SupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res: any = await apiClient('support/tickets/');
      setTickets(res?.data || res || []);
    } catch (e) {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const statusColor: Record<string, string> = {
    OPEN: 'bg-yellow-100 text-yellow-700',
    ASSIGNED: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
    RESOLVED: 'bg-green-100 text-green-700',
    CLOSED: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <header className="bg-white px-4 py-5 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="text-xl font-black text-slate-900">Support Center</h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Help Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2 items-center text-center">
            <span className="text-3xl">📞</span>
            <span className="font-bold text-sm text-slate-900">Call Us</span>
            <span className="text-xs text-slate-500">24/7 Support</span>
          </button>
          <button className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2 items-center text-center">
            <span className="text-3xl">💬</span>
            <span className="font-bold text-sm text-slate-900">Chat</span>
            <span className="text-xs text-slate-500">Typically 5 mins</span>
          </button>
        </div>

        {/* Tickets */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900">My Support Tickets</h2>
            <button className="text-blue-600 text-sm font-bold bg-blue-50 px-3 py-1.5 rounded-lg">+ New Ticket</button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 animate-pulse space-y-3">
                  <div className="flex justify-between">
                    <div className="w-24 h-4 bg-slate-200 rounded" />
                    <div className="w-16 h-4 bg-slate-200 rounded" />
                  </div>
                  <div className="w-3/4 h-3 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
              <div className="text-4xl mb-4">🎫</div>
              <h3 className="font-black text-lg text-slate-900 mb-1">No active tickets</h3>
              <p className="text-slate-500 text-sm">Need help with a booking? Create a ticket and we'll assist you right away.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map(t => (
                <div key={t.id} className="bg-white p-4 rounded-2xl border border-slate-200 cursor-pointer hover:border-blue-200 transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-black text-slate-400 block mb-0.5">{t.ticket_number}</span>
                      <h4 className="font-bold text-slate-900 text-sm">{t.subject}</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${statusColor[t.status] || 'bg-slate-100 text-slate-600'}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{t.description}</p>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-400">{new Date(t.created_at).toLocaleDateString()}</span>
                    <span className="text-blue-600 flex items-center gap-1">
                      View details <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
