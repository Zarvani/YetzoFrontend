'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();
  const sections = [
    { title: '1. Acceptance of Terms', content: 'By accessing or using the Yetzo platform (web or mobile), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.' },
    { title: '2. Services Offered', content: 'Yetzo is a marketplace platform that connects customers with independent service professionals. Yetzo does not directly provide home services but facilitates bookings and transactions between customers and professionals.' },
    { title: '3. User Accounts', content: 'You must register with accurate information. You are responsible for all activity under your account. Sharing account credentials is prohibited. Yetzo reserves the right to suspend accounts for policy violations.' },
    { title: '4. Booking & Payment', content: 'Prices displayed are final. A booking is confirmed only after payment or explicit confirmation. Refunds are governed by our Cancellation Policy below. Service Guarantee covers rework requests within 30 days.' },
    { title: '5. Cancellation Policy', content: 'Free cancellation up to 2 hours before the scheduled slot. Cancellations within 2 hours incur a ₹100 fee. No-shows (professional or customer) are handled by our dispute resolution team within 24 hours.' },
    { title: '6. Professional Conduct', content: 'All professionals on Yetzo are independent contractors. They must comply with Yetzo\'s Code of Conduct. Yetzo is not liable for damages caused by professional negligence, though we mediate all disputes.' },
    { title: '7. Intellectual Property', content: 'All content on the Yetzo platform, including logos, design, and data, is the exclusive property of Yetzo Technologies Pvt. Ltd. Reproduction without written consent is prohibited.' },
    { title: '8. Limitation of Liability', content: 'Yetzo\'s liability is limited to the amount paid for the specific service that caused the claim. We are not liable for indirect, incidental, or consequential damages.' },
    { title: '9. Governing Law', content: 'These terms are governed by the laws of India. All disputes are subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <title>Terms of Service — Yetzo</title>
      <header className="border-b border-slate-200 px-4 md:px-8 py-4 flex items-center gap-4 sticky top-0 z-50 bg-white/90 backdrop-blur-md">
        <img src="/assets/images/logo.png" alt="Yetzo" className="h-8 cursor-pointer" onClick={() => router.push('/')} />
        <nav className="ml-auto flex items-center gap-4">
          <button onClick={() => router.push('/privacy')} className="text-slate-600 font-bold text-sm hover:text-slate-900">Privacy</button>
          <button onClick={() => router.push('/contact')} className="text-slate-600 font-bold text-sm hover:text-slate-900">Contact</button>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-3">Terms of Service</h1>
          <p className="text-slate-500 font-medium">Last updated: October 10, 2026 · Effective immediately</p>
          <p className="text-slate-600 font-medium mt-4 leading-relaxed">Please read these terms carefully before using Yetzo. By creating an account or making a booking, you accept these terms in full.</p>
        </div>
        <div className="space-y-8">
          {sections.map((s, i) => (
            <div key={i} className="border-b border-slate-100 pb-8">
              <h2 className="text-xl font-black text-slate-900 mb-3">{s.title}</h2>
              <p className="text-slate-600 font-medium leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center text-sm font-medium">
        <p>© 2026 Yetzo Technologies Pvt. Ltd. · <button onClick={() => router.push('/terms')} className="hover:text-white">Terms</button> · <button onClick={() => router.push('/privacy')} className="hover:text-white">Privacy</button></p>
      </footer>
    </div>
  );
}
