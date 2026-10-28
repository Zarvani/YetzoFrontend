'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();
  const stats = [
    { number: '5 Lakh+', label: 'Happy Customers' },
    { number: '12,000+', label: 'Verified Professionals' },
    { number: '30+', label: 'Cities Covered' },
    { number: '4.82★', label: 'Average Rating' },
  ];
  const values = [
    { icon: '🛡️', title: 'Trust & Safety', desc: 'Every professional is background-verified, trained, and insured before they enter your home.' },
    { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden charges. What you see is what you pay. Dynamic pricing shown upfront.' },
    { icon: '⚡', title: 'Yetzo Instant', desc: 'Need someone right now? Our Instant mode dispatches a professional to you within 60 minutes.' },
    { icon: '🏆', title: 'Service Guarantee', desc: '30-day free rework guarantee on all services. Not satisfied? We fix it for free.' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <title>About Us — Yetzo</title>
      <header className="border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <img src="/assets/images/logo.png" alt="Yetzo" className="h-8 cursor-pointer" onClick={() => router.push('/')} />
        <nav className="hidden md:flex items-center gap-6 text-slate-600 font-medium text-sm">
          <button onClick={() => router.push('/services')} className="hover:text-slate-900">Services</button>
          <button onClick={() => router.push('/how-it-works')} className="hover:text-slate-900">How it Works</button>
          <button onClick={() => router.push('/partner')} className="hover:text-slate-900">Become a Partner</button>
        </nav>
        <button onClick={() => router.push('/auth/login')} className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-sm">Sign In</button>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-24 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">India's Most Trusted<br/>Home Services Platform</h1>
        <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto">Yetzo connects millions of Indians with verified, skilled professionals for every home service need — from AC repair to deep cleaning.</p>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-black text-blue-600 mb-2">{s.number}</p>
              <p className="text-slate-600 font-bold text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-6">Our Mission</h2>
        <p className="text-xl text-slate-600 font-medium leading-relaxed">To create dignified livelihoods for skilled professionals across India while giving every household access to safe, reliable, and affordable home services — delivered with the same consistency every time.</p>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">What We Stand For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{v.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4">Ready to experience Yetzo?</h2>
        <p className="text-slate-500 font-medium mb-8">Join over 5 lakh happy customers across India.</p>
        <button onClick={() => router.push('/')} className="bg-blue-600 text-white font-extrabold px-10 py-4 rounded-2xl shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all text-lg">Book a Service Now →</button>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-10 px-4 text-center text-sm font-medium">
        <p>© 2026 Yetzo Technologies Pvt. Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
