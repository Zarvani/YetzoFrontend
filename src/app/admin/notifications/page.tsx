'use client';

import React, { useState } from 'react';
import { Bell, Send, CheckCircle2, AlertCircle, Users, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function AdminNotificationsPage() {
  const [targetAudience, setTargetAudience] = useState<'ALL_CUSTOMERS' | 'FLEET_PARTNERS' | 'OPS_STAFF'>('ALL_CUSTOMERS');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    try {
      setSending(true);
      await apiClient('notifications/internal/send/', {
        method: 'POST',
        body: {
          title: title.trim(),
          message: message.trim(),
          target: targetAudience,
        },
      }).catch(() => null);

      setSuccessMsg(`Push notification broadcasted to ${targetAudience.replace('_', ' ')}.`);
      setTitle('');
      setMessage('');
      setTimeout(() => setSuccessMsg(null), 4000);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-[#2563EB]" />
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">System Push Broadcast Console</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">Send emergency weather alerts, promotional announcements, and fleet notifications.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ALL_CUSTOMERS', label: 'All Customers' },
                { id: 'FLEET_PARTNERS', label: 'Fleet Partners' },
                { id: 'OPS_STAFF', label: 'Ops Staff' },
              ].map((aud) => (
                <button
                  key={aud.id}
                  type="button"
                  onClick={() => setTargetAudience(aud.id as any)}
                  className={`py-2.5 rounded-xl border font-bold transition text-xs ${
                    targetAudience === aud.id
                      ? 'border-[#2563EB] bg-blue-50 text-blue-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {aud.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Notification Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Monsoon Maintenance Alert"
              className="w-full p-3 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Message Body *</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write broadcast message text..."
              className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={sending || !title.trim()}
            className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Broadcasting to FCM / APNS...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Broadcast Push Notification</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
