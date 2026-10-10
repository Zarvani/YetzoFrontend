'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveTrackingMap } from '@/components/tracking/LiveTrackingMap';

export default function LivePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const payload = await apiClient<any>('bookings/?status=in_progress');
        setActiveJobs(payload?.results || payload || []);
      } catch (err: any) {
        setError(err.message || "Failed to connect to backend via apiClient");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRealData();
    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchRealData, 30000);
    return () => clearInterval(interval);
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
          <h1 className="text-xl font-bold text-slate-900">Live</h1>
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
                <h2 className="text-2xl font-bold text-slate-900">Live</h2>
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
              <div className="space-y-6">
                <div className="h-[400px] w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative">
                   <LiveTrackingMap />
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {activeJobs.length} Active Professionals
                      </span>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <AnimatePresence>
                     {activeJobs.length === 0 && !isLoading && (
                       <div className="col-span-full text-center py-8 text-slate-500 font-medium">No active jobs right now.</div>
                     )}
                     {activeJobs.map((job, idx) => (
                       <motion.div key={job.id || idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                         <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                           {job.professional?.user?.first_name?.[0] || 'P'}
                         </div>
                         <div>
                           <p className="font-bold text-slate-900">{job.professional?.user?.first_name || 'Professional'} is active</p>
                           <p className="text-xs text-slate-500 mt-1">Heading to {job.address?.address_line_1 || 'Customer location'}</p>
                           <p className="text-[10px] font-bold text-blue-600 mt-2 uppercase tracking-wider">Job #{job.id?.substring(0,8)}</p>
                         </div>
                       </motion.div>
                     ))}
                   </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
