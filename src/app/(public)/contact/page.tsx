'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    { icon: '📞', label: 'Customer Support', value: '1800-XXX-XXXX', sub: 'Mon–Sun, 8 AM – 10 PM' },
    { icon: '✉️', label: 'Email Us', value: 'support@yetzo.in', sub: 'Reply within 24 hours' },
    { icon: '💬', label: 'Live Chat', value: 'In-App Chat', sub: 'Available 24/7 in the app' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <title>Contact Us — Yetzo</title>
      <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center gap-4 sticky top-0 z-50">
        <img src="/assets/images/logo.png" alt="Yetzo" className="h-8 cursor-pointer" onClick={() => router.push('/')} />
        <nav className="ml-auto flex items-center gap-4">
          <button onClick={() => router.push('/help')} className="text-slate-600 font-bold text-sm hover:text-slate-900">Help Center</button>
          <button onClick={() => router.push('/auth/login')} className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-sm">Sign In</button>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-black text-slate-900 mb-4">Get in Touch</h1>
          <p className="text-slate-500 font-medium text-xl">We're here to help. Reach out through any channel that works for you.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {contacts.map((c, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="text-4xl mb-4">{c.icon}</div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{c.label}</p>
              <p className="font-black text-slate-900 text-lg">{c.value}</p>
              <p className="text-slate-500 font-medium text-sm mt-1">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
          {submitted ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Message Sent!</h3>
              <p className="text-slate-500 font-medium">Our team will get back to you within 24 hours.</p>
              <button onClick={() => router.push('/')} className="mt-6 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl">Back to Home</button>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-black text-slate-900 mb-6">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                    <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500" placeholder="Rahul Sharma" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500" placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500" placeholder="rahul@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
                  <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500">
                    <option>General Enquiry</option>
                    <option>Booking Issue</option>
                    <option>Payment Problem</option>
                    <option>Professional Complaint</option>
                    <option>Partner with Yetzo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Message</label>
                  <textarea required rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500 resize-none" placeholder="Tell us how we can help..."></textarea>
                </div>
                <button type="submit" disabled={sending} className="w-full bg-blue-600 text-white font-extrabold py-4 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  {sending ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...</> : 'Send Message →'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
