'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Debounced Search via real backend (Elasticsearch integration)
  useEffect(() => {
    const fetchRealData = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const payload: any = await apiClient(`services/?q=${encodeURIComponent(query)}`);
        if (payload?.results) {
          setResults(payload.results);
        } else {
          setResults([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to search services");
      } finally {
        setIsLoading(false);
      }
    };
    
    const timeoutId = setTimeout(() => {
      fetchRealData();
    }, 400); // 400ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4 w-full max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-900 transition-colors bg-slate-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for 'AC Repair', 'Cleaning', etc."
              className="w-full bg-slate-100 border border-slate-200 text-slate-900 px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium placeholder-slate-400"
              autoFocus
            />
            {isLoading && (
              <div className="absolute right-4 top-3.5">
                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8">
        
        {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              <div className="w-full">
                <h3 className="font-semibold text-red-900">Search Failed</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
        )}

        <AnimatePresence>
          {query.trim().length > 0 && !isLoading && results.length === 0 && !error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">No services found</h3>
              <p className="text-slate-500 mt-2">Try searching for something else like "plumbing" or "massage".</p>
            </motion.div>
          )}

          {results.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h3 className="font-bold text-slate-900 mb-4 px-2 tracking-tight">Search Results</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {results.map((service: any, idx: number) => (
                  <motion.div 
                    key={service.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => router.push(`/service/${service.slug}`)}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer flex gap-4 transition-all group"
                  >
                    <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 relative">
                      {service.image ? (
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <svg className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{service.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{service.description || 'Premium home service.'}</p>
                      <div className="mt-2 text-sm font-bold text-slate-700">₹{service.base_price || '499'}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
