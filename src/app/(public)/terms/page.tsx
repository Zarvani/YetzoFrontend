'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-4 py-6 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
          <a href="/" className="text-blue-600 font-bold hover:underline">Back to Home</a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Agreement of Terms</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              By accessing and using the Yetzo platform, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900">1. Description of Service</h3>
              <p className="text-slate-600 leading-relaxed">
                Yetzo provides an online marketplace connecting customers with verified independent professionals for home services, repairs, and other tasks. We do not provide the services directly, but facilitate the connection and payment.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900">2. User Obligations</h3>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>You must provide accurate information when registering.</li>
                <li>You are responsible for maintaining the confidentiality of your account.</li>
                <li>You agree not to use the service for any illegal purposes or to harm others.</li>
                <li>You will respect the professionals arriving at your premises.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900">3. Escrow and Payments</h3>
              <p className="text-slate-600 leading-relaxed">
                All payments are held securely in Escrow until the service is successfully completed and verified via OTP.
              </p>
            </section>
          </div>
          
          <div className="pt-8 border-t border-slate-200/60 text-slate-500 text-sm">
            Last updated: October 2026
          </div>
        </motion.div>
      </main>
    </div>
  );
}
