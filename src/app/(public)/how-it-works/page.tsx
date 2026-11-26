'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Calendar, MapPin, CreditCard, Home, Star,
  RefreshCw, CircleDollarSign, ShieldCheck, Clock
} from 'lucide-react';

export default function HowItWorksPage() {
  const router = useRouter();
  const steps = [
    { step: '01', icon: <Search className="w-8 h-8 text-white" />, title: 'Browse & Select', desc: 'Search for the service you need from our catalog of verified household services across all home care categories.' },
    { step: '02', icon: <Calendar className="w-8 h-8 text-white" />, title: 'Instant or Scheduled', desc: 'Choose 15-minute instant dispatch or pick a flexible 2-hour window. We work around your schedule, 7 days a week.' },
    { step: '03', icon: <MapPin className="w-8 h-8 text-white" />, title: 'Add Your Address', desc: 'Enter your location. Our hyper-local cluster dispatch finds the nearest available police-verified specialist.' },
    { step: '04', icon: <CreditCard className="w-8 h-8 text-white" />, title: 'Pay Securely via Escrow', desc: 'Pay via UPI, card, or cash. Your funds are held safely in escrow and released only after your door OTP.' },
    { step: '05', icon: <Home className="w-8 h-8 text-white" />, title: 'Get It Done with Guarantee', desc: 'Your certified pro arrives in uniform with photo ID, completes the job with SOP checklist, and cleans up.' },
    { step: '06', icon: <Star className="w-8 h-8 text-white" />, title: 'Rate & Review', desc: 'Rate your experience. Your feedback directly impacts professional badges and helps maintain 5-star quality.' },
  ];
  const guarantees = [
    { icon: <RefreshCw className="w-8 h-8 text-[#2563EB] mx-auto" />, title: '30-Day Free Rework', desc: 'Complimentary redo within 30 days if you aren\'t completely satisfied.' },
    { icon: <CircleDollarSign className="w-8 h-8 text-[#2563EB] mx-auto" />, title: 'Transparent Pricing', desc: 'Standardized rate card with zero surge or hidden visit charges.' },
    { icon: <ShieldCheck className="w-8 h-8 text-[#2563EB] mx-auto" />, title: '₹10,000 Insurance', desc: 'Every booking includes complimentary property damage protection.' },
    { icon: <Clock className="w-8 h-8 text-[#2563EB] mx-auto" />, title: '15-Minute SLA Guarantee', desc: 'Automated cluster dispatch ensures rapid arrival at your doorstep.' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <title>How Yetzo Works — Your Questions Answered</title>
      

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
              <div className="w-16 h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-600/20">{s.icon}</div>
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
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-3">{g.icon}</div>
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
