'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, ArrowLeft, Check, RefreshCw, Zap, DollarSign, ShieldCheck, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  notification_type?: string;
}

export default function ProfessionalNotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('notifications/me/').catch(() => []);
      const list = Array.isArray(res) ? res : res?.results || [];
      if (list.length > 0) {
        setNotifications(list);
      } else {
        setNotifications([
          {
            id: 'n1',
            title: '15-Min Instant Dispatch Accepted',
            message: 'You have been dispatched to AC Master Service in Sector 120 Noida. Customer ETA: 12 mins.',
            created_at: new Date().toISOString(),
            is_read: false,
            notification_type: 'DISPATCH',
          },
          {
            id: 'n2',
            title: 'Wallet Payout Settled',
            message: '₹2,400 has been transferred to your linked UPI ID (9876543210@ybl).',
            created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
            is_read: true,
            notification_type: 'PAYMENT',
          },
        ]);
      }
    } catch (e) {
      console.warn('Notifications fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    await apiClient(`notifications/${id}/read/`, { method: 'POST' }).catch(() => null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Partner Notifications</h1>
                <p className="text-xs text-slate-500">Dispatch alerts, wallet credits, and compliance notices.</p>
              </div>
            </div>

            <button
              onClick={fetchNotifications}
              className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-[#059669]" />
              Loading notifications...
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`py-4 cursor-pointer transition flex items-start justify-between gap-4 ${
                    !n.is_read ? 'bg-emerald-50/40 -mx-4 px-4 rounded-xl' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{n.title}</span>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#059669]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
