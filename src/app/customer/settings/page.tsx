'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="text-xl font-black text-slate-900">Settings</h1>
        </div>
      </div>

      <main className="px-4 py-6 space-y-6">
        <div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Account</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {[
              { icon: '👤', label: 'Personal Information', desc: 'Name, Email, Phone' },
              { icon: '🔐', label: 'Security & Password', desc: 'Update your password' },
              { icon: '📱', label: 'Connected Devices', desc: 'Manage your logged-in devices' },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left">
                <span className="text-2xl bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm">{item.label}</p>
                  <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                </div>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">App Settings</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {[
              { icon: '🔔', label: 'Notifications', desc: 'Push, Email, SMS preferences' },
              { icon: '🌍', label: 'Language & Region', desc: 'English (India)' },
              { icon: '🌙', label: 'Appearance', desc: 'Light mode' },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left">
                <span className="text-2xl bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm">{item.label}</p>
                  <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                </div>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Legal</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {[
              { label: 'Terms of Service', path: '/terms' },
              { label: 'Privacy Policy', path: '/privacy' },
              { label: 'About Yetzo', path: '/about' },
            ].map((item, i) => (
              <button key={i} onClick={() => router.push(item.path)} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
                <p className="font-bold text-slate-900 text-sm">{item.label}</p>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
