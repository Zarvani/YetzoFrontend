'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HelpPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = [
    { icon: '📋', label: 'Bookings', path: '/customer/support' },
    { icon: '💳', label: 'Payments & Refunds', path: '/customer/support' },
    { icon: '👷', label: 'About Professionals', path: '/customer/support' },
    { icon: '🔒', label: 'Account & Security', path: '/customer/settings/security' },
    { icon: '🏠', label: 'Service Quality', path: '/customer/support' },
    { icon: '🎁', label: 'Offers & Coupons', path: '/offers' },
  ];

  const faqs = [
    { q: 'How do I cancel a booking?', a: 'Go to My Bookings → Select the booking → Tap "Cancel Booking". Free cancellations are allowed up to 2 hours before your scheduled slot.' },
    { q: 'What if the professional doesn\'t show up?', a: 'If your professional is more than 30 minutes late without notification, tap "Help" in your booking. We\'ll either dispatch a replacement or issue a full refund immediately.' },
    { q: 'How do I get a refund?', a: 'Refunds for completed services are processed within 24 hours after our team reviews your case. For cancelled bookings, refunds appear in your bank within 5–7 business days.' },
    { q: 'Can I reschedule my booking?', a: 'Yes! Go to My Bookings and tap "Reschedule". You can change the date and time up to 2 hours before the original slot for free.' },
    { q: 'Are the professionals background-verified?', a: 'Absolutely. Every professional undergoes Aadhaar verification, police verification, and skills assessment before being onboarded. Only professionals with a 4.0+ rating remain active on the platform.' },
    { q: 'What is the Yetzo Service Guarantee?', a: 'If you\'re unhappy with the service quality, we\'ll send a professional to redo it for free within 30 days. No questions asked. Just tap "Request Rework" in your completed booking.' },
    { q: 'How do I add a new address?', a: 'Go to Profile → Saved Addresses → Tap "+ Add New". You can save multiple addresses (Home, Work, Other) and set a default for faster booking.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <title>Help Center — Yetzo</title>
      <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <img src="/assets/images/logo.png" alt="Yetzo" className="h-8 cursor-pointer" onClick={() => router.push('/')} />
        <button onClick={() => router.push('/contact')} className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-sm">Contact Support</button>
      </header>

      {/* Hero Search */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 py-16 px-4 text-center">
        <h1 className="text-4xl font-black text-white mb-4">How can we help?</h1>
        <div className="max-w-lg mx-auto relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Search help articles..." className="w-full pl-12 pr-4 py-4 rounded-2xl font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Help Categories */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <button key={i} onClick={() => router.push(cat.path)} className="bg-white p-6 rounded-2xl border border-slate-200 text-left hover:border-blue-300 transition-colors shadow-sm">
                <div className="text-3xl mb-3">{cat.icon}</div>
                <p className="font-black text-slate-900">{cat.label}</p>
                <p className="text-blue-600 text-sm font-bold mt-1">View articles →</p>
              </button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-bold text-slate-900">{faq.q}</span>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 border-t border-slate-100">
                    <p className="text-slate-600 font-medium leading-relaxed pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Still need help */}
        <div className="bg-blue-600 p-8 rounded-3xl text-white text-center">
          <h3 className="text-2xl font-black mb-2">Still need help?</h3>
          <p className="text-blue-100 font-medium mb-6">Our support team is available Mon–Sun, 8 AM – 10 PM</p>
          <button onClick={() => router.push('/contact')} className="bg-white text-blue-600 font-extrabold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">Contact Support Team</button>
        </div>
      </main>
    </div>
  );
}
