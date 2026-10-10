'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Real Django API Integration via Proxy
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const payload = await apiClient('/auth/me/');
        setData(payload);
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
          <h1 className="text-xl font-bold text-slate-900">Forgot Password</h1>
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
                <h2 className="text-2xl font-bold text-slate-900">Forgot Password</h2>
                <p className="text-slate-500 mt-1">Live Endpoint via proxy: <code className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">/v1/auth/me/</code></p>
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
                <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="w-full overflow-x-auto">
                    <h3 className="font-semibold text-green-900">Real Payload Received</h3>
                    <pre className="text-green-800 text-xs mt-2 bg-green-100/50 p-3 rounded-lg overflow-x-auto">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  This interface actively pulls live data from your Django backend through the Next.js API proxy using <strong>apiClient</strong>.
                </p>

                <button 
                  onClick={() => router.push('/')}
                  className="mt-8 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all w-full md:w-auto"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
