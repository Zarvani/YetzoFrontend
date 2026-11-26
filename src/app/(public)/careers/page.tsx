'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  CircleDollarSign, HeartPulse, SunMedium, BookOpen, Home,
  Rocket, MapPin, ArrowRight
} from 'lucide-react';

export default function CareersPage() {
  const router = useRouter();
  const openRoles = [
    { title: 'Senior Backend Engineer — Python / Django', team: 'Platform Engineering', location: 'Bengaluru (Hybrid)', type: 'Full-Time' },
    { title: 'Senior Mobile Engineer — Flutter / Dart', team: 'Mobile Fleet', location: 'Bengaluru (Hybrid)', type: 'Full-Time' },
    { title: 'Operations Dispatch Manager', team: 'Hyper-Local Operations', location: 'Delhi NCR / Mumbai / Hyderabad', type: 'Full-Time' },
    { title: 'Product Manager — Fleet & Partner Experience', team: 'Product', location: 'Bengaluru (Hybrid)', type: 'Full-Time' },
    { title: 'Safety & Police Verification Lead', team: 'Trust & Safety', location: 'Bengaluru / Gurgaon', type: 'Full-Time' },
    { title: 'Quality & SOP Training Specialist', team: 'Fleet Operations', location: 'Pan-India', type: 'Full-Time' },
  ];

  const perks = [
    { icon: <CircleDollarSign className="w-6 h-6 text-[#2563EB]" />, label: 'Competitive Pay', desc: 'Top-tier base with meaningful equity ownership' },
    { icon: <HeartPulse className="w-6 h-6 text-[#2563EB]" />, label: 'Health Coverage', desc: 'Comprehensive medical protection for employee and family' },
    { icon: <SunMedium className="w-6 h-6 text-[#2563EB]" />, label: 'Flexible Leave', desc: 'Rest and recharge with generous paid time off' },
    { icon: <BookOpen className="w-6 h-6 text-[#2563EB]" />, label: 'Learning Stipend', desc: 'Annual budget for engineering courses and conferences' },
    { icon: <Home className="w-6 h-6 text-[#2563EB]" />, label: 'Modern Workspaces', desc: 'Collaborative hubs in major metropolitan clusters' },
    { icon: <Rocket className="w-6 h-6 text-[#2563EB]" />, label: 'Rapid Impact', desc: 'Solve high-scale algorithmic dispatch challenges daily' },
  ];

  return (
    <div className="min-h-screen bg-white font-body">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 py-24 px-4 text-center text-white">
        <div className="inline-flex items-center gap-2 bg-white/10 text-sky-400 font-semibold text-xs px-3.5 py-1.5 rounded-sm mb-6 border border-white/10 font-heading uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          <span>We are hiring across engineering and operations</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-[300] font-heading mb-4 tracking-tight">Build the Future of Urban House Help</h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Join a world-class team solving logistics, dispatch algorithms, and safety verification for India's 50-million household domestic economy.
        </p>
      </section>

      {/* Perks */}
      <section className="py-20 px-4 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">Culture & Benefits</span>
            <h2 className="text-3xl font-[300] font-heading text-slate-900">Why Build with Yetzo?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {perks.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-sm border border-slate-200 shadow-xs">
                <div className="w-11 h-11 rounded-sm bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">{p.icon}</div>
                <h4 className="font-heading font-medium text-slate-900 text-sm mb-1">{p.label}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold font-heading">Current Openings</span>
          <h2 className="text-3xl font-[300] font-heading text-slate-900">Join Our Core Team</h2>
        </div>

        <div className="space-y-3">
          {openRoles.map((role, i) => (
            <div key={i} className="p-5 bg-white border border-slate-200 rounded-sm hover:border-blue-400 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div>
                <h3 className="font-heading font-medium text-sm text-slate-900">{role.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="font-medium text-blue-700">{role.team}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {role.location}</span>
                  <span>•</span>
                  <span>{role.type}</span>
                </div>
              </div>
              <button onClick={() => router.push('/contact')} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-sm text-xs font-heading font-medium transition flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                <span>Apply Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
