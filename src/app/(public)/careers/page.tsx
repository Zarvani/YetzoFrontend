'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function CareersPage() {
  const router = useRouter();
  const openRoles = [
    { title: 'Senior Backend Engineer — Django/Python', team: 'Engineering', location: 'Bengaluru (Hybrid)', type: 'Full-Time' },
    { title: 'Product Manager — Customer Experience', team: 'Product', location: 'Bengaluru (On-site)', type: 'Full-Time' },
    { title: 'City Operations Manager', team: 'Operations', location: 'Delhi / Mumbai / Hyderabad', type: 'Full-Time' },
    { title: 'Growth Marketing Lead', team: 'Marketing', location: 'Remote (India)', type: 'Full-Time' },
    { title: 'iOS Engineer — React Native', team: 'Engineering', location: 'Bengaluru (Hybrid)', type: 'Full-Time' },
    { title: 'Head of Professional Training', team: 'People & Culture', location: 'Bengaluru (On-site)', type: 'Full-Time' },
  ];

  const perks = [
    { icon: '💰', label: 'Competitive Pay', desc: 'Top-of-market salaries with ESOPs' },
    { icon: '🏥', label: 'Health Coverage', desc: 'Full family medical & dental' },
    { icon: '🏖️', label: 'Unlimited PTO', desc: 'Take what you need, when you need it' },
    { icon: '📚', label: 'Learning Budget', desc: '₹50k/year for courses & conferences' },
    { icon: '🏠', label: 'Remote-Friendly', desc: 'Work from anywhere in India' },
    { icon: '🚀', label: 'Fast Growth', desc: 'Build India\'s next unicorn with us' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <title>Careers at Yetzo — Join Our Team</title>
      <header className="border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50 bg-white/90 backdrop-blur-md">
        <img src="/assets/images/logo.png" alt="Yetzo" className="h-8 cursor-pointer" onClick={() => router.push('/')} />
        <button onClick={() => router.push('/contact')} className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-sm">Apply Now</button>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 py-24 px-4 text-center text-white">
        <div className="inline-block bg-white/10 text-white font-bold text-sm px-4 py-1.5 rounded-full mb-6 border border-white/20">🚀 We're hiring across 8 teams</div>
        <h1 className="text-5xl md:text-6xl font-black mb-6">Build India's Most Trusted<br/>Home Services Platform</h1>
        <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto">Join a team of builders who are transforming the lives of millions of Indians — both the customers we serve and the professionals who deliver.</p>
      </section>

      {/* Perks */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900 text-center mb-12">Why Work at Yetzo?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {perks.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-4xl mb-3">{p.icon}</div>
                <h4 className="font-black text-slate-900 mb-1">{p.label}</h4>
                <p className="text-slate-500 font-medium text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900 mb-2">Open Roles</h2>
          <p className="text-slate-500 font-medium mb-10">{openRoles.length} positions open right now</p>
          <div className="space-y-4">
            {openRoles.map((role, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex justify-between items-center">
                <div>
                  <h4 className="font-black text-slate-900 text-lg mb-1">{role.title}</h4>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold text-xs">{role.team}</span>
                    <span>📍 {role.location}</span>
                    <span>⏱️ {role.type}</span>
                  </div>
                </div>
                <button onClick={() => router.push('/contact')} className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-black transition-colors shrink-0">Apply →</button>
              </div>
            ))}
          </div>
          <p className="text-slate-500 font-medium mt-8 text-center">Don't see a fit? We hire for attitude — <button onClick={() => router.push('/contact')} className="text-blue-600 font-bold hover:underline">send us your resume anyway</button>.</p>
        </div>
      </section>
    </div>
  );
}
