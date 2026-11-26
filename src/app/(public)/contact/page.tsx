'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', subject: 'General Enquiry' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitted(true);
    setSending(false);
  };

  const contacts = [
    { icon: <Phone className="w-6 h-6 text-[#2563EB]" />, label: 'Customer Helpline', value: '1800-YETZO-HELP', sub: '24/7 Priority Support Desk' },
    { icon: <Mail className="w-6 h-6 text-[#2563EB]" />, label: 'Email Desk', value: 'support@yetzo.com', sub: 'Response within 2 hours' },
    { icon: <MessageSquare className="w-6 h-6 text-[#2563EB]" />, label: 'Live Chat', value: 'In-App Support Relay', sub: 'Instant resolution with agent' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-body">
      <main className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-[300] font-heading text-slate-900 mb-4">Get in Touch</h1>
          <p className="text-slate-500 font-medium text-lg">We are here to support your domestic help experience 24 hours a day, 7 days a week.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {contacts.map((c, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">{c.icon}</div>
              <p className="text-xs font-bold font-heading text-slate-500 uppercase tracking-wider mb-2">{c.label}</p>
              <p className="font-heading font-medium text-slate-900 text-lg">{c.value}</p>
              <p className="text-slate-500 font-medium text-xs mt-1">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h3 className="text-2xl font-[300] font-heading text-slate-900">Message Received</h3>
              <p className="text-slate-500 text-sm font-medium">A dedicated customer support manager will respond to you within 2 hours.</p>
              <button onClick={() => router.push('/')} className="mt-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium px-6 py-2.5 rounded-sm text-xs font-heading uppercase tracking-wider transition">Back to Home</button>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-[300] font-heading text-slate-900 mb-6">Send Us a Direct Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-heading">Full Name</label>
                    <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 font-body" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-heading">Phone Number</label>
                    <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 font-body" placeholder="+91 98765 43210" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-heading">Email Address</label>
                  <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 font-body" placeholder="you@example.com" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-heading">Subject</label>
                  <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 font-body">
                    <option>General Enquiry</option>
                    <option>Booking Status</option>
                    <option>Refund or Billing</option>
                    <option>Partner Onboarding</option>
                    <option>Corporate Tie-ups</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-heading">Message</label>
                  <textarea rows={4} required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 font-body" placeholder="How can our operations team help you?" />
                </div>

                <button type="submit" disabled={sending} className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-3 rounded-sm text-xs font-heading uppercase tracking-wider transition">
                  {sending ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
