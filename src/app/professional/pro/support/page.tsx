'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function SupportPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [incidentType, setIncidentType] = useState('safety');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await apiClient('incidents/report/', { 
        method: 'POST', 
        body: { type: incidentType, description } 
      });
      alert('Incident reported successfully. Our team will contact you shortly.');
      setDescription('');
    } catch (err: any) {
      alert("Failed to report incident: " + err.message);
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-xl font-bold text-slate-900">Support</h1>
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
                <h2 className="text-2xl font-bold text-slate-900">Support</h2>
                <p className="text-slate-500 mt-1">Live Endpoint via proxy: <code className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">/v1/support/tickets/</code></p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Incident Type</label>
                <select 
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="safety">Safety Concern</option>
                  <option value="fraud">Fraud / Fake Customer</option>
                  <option value="payment">Payment Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe the incident in detail..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 h-32 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button 
                onClick={handleSubmit}
                disabled={!description || isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50"
              >
                {isSubmitting ? 'Reporting...' : 'Report Urgent Incident'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
