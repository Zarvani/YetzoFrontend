'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function EscalationsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [escalations, setEscalations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const payload = await apiClient<any>('tickets/');
        const allTickets = payload?.results || payload || [];
        // Filter for high priority or unresolved
        setEscalations(allTickets.filter((t: any) => t.priority === 'high' || t.status === 'open'));
      } catch (err: any) {
        setError(err.message || "Failed to connect to backend via apiClient");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealData();
  }, []);

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
          <h1 className="text-xl font-bold text-slate-900">Escalations</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
          
          {/* Top Decorative Gradient */}
          <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Escalations</h2>
                <p className="text-slate-500 mt-1">Live Endpoint via proxy: <code className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">/v1/system/ping/</code></p>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-12 bg-slate-100 rounded-lg mt-6 w-full"></div>
              </div>
            ) : error ? (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="w-full">
                    <h3 className="font-semibold text-red-900">API Connection Failed</h3>
                    <p className="text-red-700 text-sm mt-1 mb-2">{error}</p>
                    <p className="text-red-600 text-xs">Ensure your Django server is running on port 8000.</p>
                  </div>
                </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {escalations.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-slate-500 font-medium bg-white rounded-2xl border border-slate-100">
                      No active escalations. Everything is running smoothly.
                    </div>
                  )}
                  
                  {escalations.map((ticket, idx) => (
                    <motion.div 
                      key={ticket.id || idx} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="bg-white p-5 rounded-2xl border border-red-200 shadow-[0_4px_20px_-4px_rgba(239,68,68,0.1)] flex flex-col md:flex-row gap-4 justify-between md:items-center relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                      <div className="pl-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 animate-pulse">Critical</span>
                          <h4 className="font-bold text-slate-900">{ticket.subject || 'Escalation Reported'}</h4>
                        </div>
                        <p className="text-sm text-slate-700">{ticket.description || 'Action required immediately'}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span>Reported: {new Date(ticket.created_at || Date.now()).toLocaleString()}</span>
                          <span>User ID: {ticket.user || 'Unknown'}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold py-2 px-6 rounded-xl transition-colors">
                          Investigate
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
