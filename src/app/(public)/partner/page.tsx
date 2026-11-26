'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  CircleDollarSign, Calendar, Smartphone, GraduationCap,
  ShieldCheck, CreditCard
} from 'lucide-react';

export default function PartnerPage() {
  const router = useRouter();
  const benefits = [
    { icon: <CircleDollarSign className="w-7 h-7 text-[#2563EB]" />, title: 'Earn ₹30,000–80,000/month', desc: 'Top professionals on Yetzo earn over ₹80,000 a month working on their own schedule.' },
    { icon: <Calendar className="w-7 h-7 text-[#2563EB]" />, title: 'Set Your Own Hours', desc: 'Work when you want. Toggle your availability in the app and receive jobs only when you\'re free.' },
    { icon: <Smartphone className="w-7 h-7 text-[#2563EB]" />, title: 'All Jobs via App', desc: 'No phone calls, no paperwork. Every job request, invoice, and payment is handled in the Yetzo Pro app.' },
    { icon: <GraduationCap className="w-7 h-7 text-[#2563EB]" />, title: 'Free Training & Tools', desc: 'Get access to Yetzo Academy — professional courses, technique videos, and certifications at no cost.' },
    { icon: <ShieldCheck className="w-7 h-7 text-[#2563EB]" />, title: 'Liability Insurance', desc: 'We cover you. Every Yetzo professional is covered by platform-wide professional liability insurance.' },
    { icon: <CreditCard className="w-7 h-7 text-[#2563EB]" />, title: 'Daily Payouts', desc: 'Don\'t wait for weekly paychecks. Request a payout any day and get it in your bank within 2 hours.' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <title>Become a Yetzo Professional Partner</title>
      

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-blue-500/20 text-blue-300 font-bold text-sm px-4 py-1.5 rounded-full mb-6 border border-blue-500/30">Now hiring in 30+ cities across India</div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">Grow Your Career<br/>with Yetzo</h1>
          <p className="text-xl text-slate-300 font-medium mb-10 max-w-2xl mx-auto">Join 12,000+ verified professionals earning a premium income by delivering expert home services through the Yetzo platform.</p>
          <button onClick={() => router.push('/professional/pro/register')} className="bg-blue-600 text-white font-extrabold px-10 py-5 rounded-2xl shadow-2xl shadow-blue-600/30 hover:bg-blue-500 transition-all text-lg">Start Your Application →</button>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900 text-center mb-12">Why Professionals Choose Yetzo</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">{b.icon}</div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{b.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-12">How to Join</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Apply Online', desc: 'Fill in your details and skills in 5 minutes.' },
              { step: '2', title: 'KYC & Training', desc: 'Submit documents and complete a short training module.' },
              { step: '3', title: 'Start Earning', desc: 'Go live and receive your first job within 48 hours.' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-lg shadow-blue-600/30">{s.step}</div>
                <h4 className="font-black text-slate-900 mb-2">{s.title}</h4>
                <p className="text-slate-500 font-medium text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          <button onClick={() => router.push('/professional/pro/register')} className="mt-12 bg-slate-900 text-white font-extrabold px-10 py-4 rounded-2xl hover:bg-black transition-all">Apply Now — Free & Takes 5 Minutes</button>
        </div>
      </section>
    </div>
  );
}
