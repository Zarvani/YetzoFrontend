'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function HowItWorksPage() {
  const router = useRouter();
  const steps = [
    { step: '01', icon: '🔍', title: 'Browse & Select', desc: 'Search for the service you need from our catalog of 200+ verified services across all home care categories.' },
    { step: '02', icon: '📅', title: 'Choose Date & Time', desc: 'Pick a convenient slot. Morning, afternoon, or evening — we work around your schedule, 7 days a week.' },
    { step: '03', icon: '📍', title: 'Add Your Address', desc: 'Enter your location. Our intelligent dispatch system finds the nearest available verified professional.' },
    { step: '04', icon: '💳', title: 'Pay Securely', desc: 'Pay via UPI, card, or cash after the service. Your payment is protected by the Yetzo Service Guarantee.' },
    { step: '05', icon: '🏠', title: 'Get It Done', desc: 'Your professional arrives on time, completes the job, and takes before/after photos for your records.' },
    { step: '06', icon: '⭐', title: 'Rate & Review', desc: 'Rate your experience. Your feedback directly impacts professional earnings and helps others choose better.' },
  ];
  const guarantees = [
    { icon: '🔁', title: '30-Day Rework', desc: 'Free redo within 30 days if you aren\'t satisfied.' },
    { icon: '💰', title: 'Price Match', desc: 'We\'ll match any competitor\'s verified price.' },
    { icon: '🛡️', title: 'Insured Professionals', desc: 'All pros carry professional liability coverage.' },
    { icon: '⏰', title: 'On-Time Promise', desc: 'If we\'re late by 15+ mins, you get a discount.' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <title>How Yetzo Works — Your Questions Answered</title>
      <header className="border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50 bg-white/90 backdrop-blur-md">
        <img src="/assets/images/logo.png" alt="Yetzo" className="h-8 cursor-pointer" onClick={() => router.push('/')} />
        <button onClick={() => router.push('/auth/login')} className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-sm">Get Started</button>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-black mb-4">How Yetzo Works</h1>
        <p className="text-xl text-blue-100 font-medium max-w-xl mx-auto">From clicking to completion — your home service in 6 simple steps</p>
      </section>

      {/* Steps */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <div className="space-y-8">
          {steps.map((s, i) => (
            <div key={i} className={`flex gap-8 items-start ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl shrink-0 shadow-xl shadow-blue-600/30">{s.icon}</div>
              <div className="flex-1 pt-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-blue-600 font-black text-sm">{s.step}</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed text-lg">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900 text-center mb-12">The Yetzo Guarantee</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {guarantees.map((g, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
                <div className="text-4xl mb-3">{g.icon}</div>
                <h4 className="font-black text-slate-900 mb-2">{g.title}</h4>
                <p className="text-slate-500 font-medium text-sm">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4">Ready? It takes 2 minutes.</h2>
        <button onClick={() => router.push('/')} className="bg-blue-600 text-white font-extrabold px-10 py-4 rounded-2xl shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all text-lg">Book Your First Service →</button>
      </section>
    </div>
  );
}
