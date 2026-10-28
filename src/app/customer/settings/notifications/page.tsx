'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, MessageSquare, Smartphone, Mail, ShieldCheck, Check, Save } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function NotificationsSettingsPage() {
  const router = useRouter();

  const [serviceUpdates, setServiceUpdates] = useState(true);
  const [smsOtp, setSmsOtp] = useState(true);
  const [whatsappReceipts, setWhatsappReceipts] = useState(true);
  const [promoOffers, setPromoOffers] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load existing settings if stored or from user profile
    const loadSettings = async () => {
      try {
        const user: any = await apiClient('auth/me/');
        if (user?.preferences) {
          setServiceUpdates(user.preferences.serviceUpdates ?? true);
          setSmsOtp(user.preferences.smsOtp ?? true);
          setWhatsappReceipts(user.preferences.whatsappReceipts ?? true);
          setPromoOffers(user.preferences.promoOffers ?? false);
        }
      } catch (e) {
        console.warn('Could not load user preferences:', e);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      await apiClient('auth/me/', {
        method: 'PATCH',
        body: {
          preferences: {
            serviceUpdates,
            smsOtp,
            whatsappReceipts,
            promoOffers,
          },
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.warn('Preferences update error:', e);
    } finally {
      setLoading(false);
    }
  };

  const notificationChannels = [
    {
      id: 'service',
      title: 'Service & Dispatch Tracking',
      desc: 'Real-time 15-min ETA updates, professional arrival, and bodycam session notices.',
      icon: Bell,
      checked: serviceUpdates,
      onChange: setServiceUpdates,
      required: true,
    },
    {
      id: 'otp',
      title: 'Security & Verification OTPs',
      desc: 'Critical 4-digit start OTP and completion release codes via SMS.',
      icon: Smartphone,
      checked: smsOtp,
      onChange: setSmsOtp,
      required: true,
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Invoices & Warranty Cards',
      desc: 'Get GST Tax invoice and 30-Day Urban Company warranty certificates directly on WhatsApp.',
      icon: MessageSquare,
      checked: whatsappReceipts,
      onChange: setWhatsappReceipts,
      required: false,
    },
    {
      id: 'promos',
      title: 'Exclusive Yetzo Club Offers',
      desc: 'Discounts, seasonal maintenance alerts, and limited-time chore bundles.',
      icon: Mail,
      checked: promoOffers,
      onChange: setPromoOffers,
      required: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Notification Preferences</h1>
                <p className="text-xs text-slate-500">Configure how and when Yetzo sends you alerts.</p>
              </div>
            </div>

            {saved && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

          <div className="divide-y divide-slate-100 space-y-4">
            {notificationChannels.map((ch) => {
              const Icon = ch.icon;
              return (
                <div key={ch.id} className="pt-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 text-slate-700 rounded-lg shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{ch.title}</span>
                        {ch.required && (
                          <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{ch.desc}</p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={ch.checked}
                      disabled={ch.required}
                      onChange={(e) => ch.onChange(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#059669]"></div>
                  </label>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Changes...' : 'Save Notification Preferences'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
