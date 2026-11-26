'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClipboardList, CreditCard, UserCheck, ShieldCheck, Award, Tag,
  Search, ChevronDown, ChevronUp, MessageSquare, Phone
} from 'lucide-react';

export default function HelpPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = [
    { icon: <ClipboardList className="w-6 h-6 text-[#2563EB]" />, label: 'Bookings & Dispatch', path: '/how-it-works' },
    { icon: <CreditCard className="w-6 h-6 text-[#2563EB]" />, label: 'Payments & Escrow', path: '/how-it-works' },
    { icon: <UserCheck className="w-6 h-6 text-[#2563EB]" />, label: 'Verified Fleet', path: '/about' },
    { icon: <ShieldCheck className="w-6 h-6 text-[#2563EB]" />, label: 'Safety & Insurance', path: '/privacy' },
    { icon: <Award className="w-6 h-6 text-[#2563EB]" />, label: 'Quality Guarantee', path: '/about' },
    { icon: <Tag className="w-6 h-6 text-[#2563EB]" />, label: 'Offers & Passes', path: '/offers' },
  ];

  const faqs = [
    { q: 'How does Yetzo 15-Minute Instant dispatch work?', a: 'Our hyper-local algorithmic cluster dispatch assigns the nearest police-verified domestic pro within a 3km radius. Pros arrive equipped with uniform, bodycam badge, and cleaning kits in ~15 minutes.' },
    { q: 'How does payment escrow work?', a: 'Your funds are safely held in escrow during booking. Funds are never released to the professional until the job is completed and you provide your 4-digit completion OTP at your door.' },
    { q: 'What is the ₹10,000 Property Damage Guarantee?', a: 'Every service visit is backed by our complimentary ₹10,000 property damage protection. In the rare event of accidental breakage during service, our claims desk resolves it within 24 hours.' },
    { q: 'Are all domestic pros police verified?', a: 'Yes. 100% of Yetzo partners undergo biometric Aadhaar verification, court criminal history clearance, and permanent address verification before onboarding.' },
    { q: 'What if I am unhappy with the service?', a: 'We offer a 30-day rework guarantee. Simply reach out via 24/7 Helpline or in-app support, and we will dispatch a specialist to redo the chore completely free of charge.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-body">
      {/* Hero Search */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 py-16 px-4 text-center text-white">
        <h1 className="text-3xl sm:text-4xl font-[300] font-heading mb-3">How can our dispatch team help?</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">Search support articles, service guarantees, and platform protocols.</p>
        <div className="max-w-lg mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Search by topic (e.g. cancellation, damage claim)..." className="w-full pl-12 pr-4 py-3.5 rounded-sm text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Help Categories */}
        <div>
          <h2 className="text-xl font-[300] font-heading text-slate-900 mb-6">Support Knowledge Base</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <button key={i} onClick={() => router.push(cat.path)} className="bg-white p-6 rounded-sm border border-slate-200 text-left hover:border-blue-400 transition-colors shadow-xs group">
                <div className="w-10 h-10 rounded-sm bg-blue-50 border border-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">{cat.icon}</div>
                <p className="font-heading font-medium text-xs text-slate-900">{cat.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-xl font-[300] font-heading text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between font-heading font-medium text-xs text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Banner */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-semibold font-heading text-slate-900">Still have questions?</h3>
            <p className="text-xs text-slate-500">Our customer success and operations desk is active 24/7.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push('/contact')} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-sm text-xs font-heading font-medium transition flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact Desk</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
