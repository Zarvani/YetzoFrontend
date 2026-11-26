'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();
  const sections = [
    { title: '1. Information We Collect', content: 'We collect information you provide directly: name, phone number, email address, and location data when you create an account or book a service. We also collect device information and usage logs to improve your experience.' },
    { title: '2. How We Use Your Information', content: 'We use your data to provide and improve our services, match you with professionals, process payments, send booking confirmations and updates, and personalise your experience on the Yetzo platform.' },
    { title: '3. Sharing Your Information', content: 'Your personal information is shared only with the professional assigned to your booking and with our payment partners (Razorpay) as necessary to complete transactions. We never sell your data to third parties.' },
    { title: '4. Location Data', content: 'We use your location to show you available professionals and services near you. Location is shared with your assigned professional only during the active booking window for navigation purposes.' },
    { title: '5. Data Security', content: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We use NeonDB with row-level security and regularly conduct security audits. We are ISO 27001 compliant.' },
    { title: '6. Your Rights', content: 'You have the right to access, correct, or delete your personal data at any time. You can export your data from the Settings page or contact us at privacy@yetzo.in within 72 hours of your request.' },
    { title: '7. Cookie Policy', content: 'We use essential cookies for authentication and analytics cookies (anonymised) to understand how users navigate the platform. You can manage cookie preferences from your browser settings.' },
    { title: '8. Contact Us', content: 'For any privacy-related queries, write to: Data Protection Officer, Yetzo Technologies Pvt. Ltd., privacy@yetzo.in. We respond to all requests within 72 hours.' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <title>Privacy Policy — Yetzo</title>
      

      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-3">Privacy Policy</h1>
          <p className="text-slate-500 font-medium">Last updated: October 10, 2026</p>
          <p className="text-slate-600 font-medium mt-4 leading-relaxed">At Yetzo Technologies Pvt. Ltd., your privacy is fundamental to everything we build. This policy explains exactly what data we collect, why we collect it, and how you remain in control.</p>
        </div>
        <div className="space-y-8">
          {sections.map((s, i) => (
            <div key={i} className="border-b border-slate-100 pb-8">
              <h2 className="text-xl font-black text-slate-900 mb-3">{s.title}</h2>
              <p className="text-slate-600 font-medium leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-black text-blue-900 mb-2">Questions about your privacy?</h3>
          <p className="text-blue-700 font-medium text-sm mb-4">Our Data Protection Officer responds within 72 hours.</p>
          <button onClick={() => router.push('/contact')} className="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm">Contact Us</button>
        </div>
      </main>

      
    </div>
  );
}
