'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-4 py-6 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
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
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Privacy is our Priority</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              At Yetzo, we take your privacy seriously. This document outlines how we collect, use, and protect your personal data when you use our platform for home services.
            </p>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900">1. Information We Collect</h3>
              <p className="text-slate-600 leading-relaxed">
                We collect information you provide directly to us, such as your name, contact information, location, and payment details when you book a service or create a professional profile.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900">2. How We Use Information</h3>
              <p className="text-slate-600 leading-relaxed">
                Your information is used to facilitate the matching of customers with professionals, process payments securely through our Escrow system, and communicate important updates regarding your bookings.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900">3. Data Security</h3>
              <p className="text-slate-600 leading-relaxed">
                We implement industry-standard security measures to protect your data. Your payment information is encrypted and never stored directly on our servers.
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
