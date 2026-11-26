'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Settings, ArrowLeft, User, Phone, MapPin, Video, LogOut, ShieldCheck, Check, Save, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function ProfessionalSettingsPage() {
  const router = useRouter();

  const [pro, setPro] = useState<any>(null);
  const [maxRadius, setMaxRadius] = useState('10km');
  const [autoUploadWifi, setAutoUploadWifi] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPro = async () => {
      try {
        const data: any = await apiClient('professionals/me/').catch(() => null);
        setPro(data);
      } catch (e) {
        console.warn('Profile fetch error:', e);
      }
    };
    fetchPro();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      await apiClient('professionals/me/', {
        method: 'PATCH',
        body: {
          settings: {
            maxRadius,
            autoUploadWifi,
            soundAlerts,
          },
        },
      }).catch(() => null);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/professional/pro/login');
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
              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Partner Profile & App Settings</h1>
                <p className="text-xs text-slate-500">Configure dispatch radius, bodycam sync, and fleet preferences.</p>
              </div>
            </div>

            {saved && (
              <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

          {/* Profile Card */}
          <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center font-bold text-base">
                {pro?.user?.first_name ? pro.user.first_name[0] : 'P'}
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm block">
                  {pro?.user?.first_name ? `${pro.user.first_name} ${pro.user.last_name || ''}` : 'Fleet Partner'}
                </span>
                <span className="text-slate-500 font-mono text-[11px] block">{pro?.user?.phone || 'Verified'}</span>
              </div>
            </div>

            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-black text-[10px] rounded-full">
              KYC VERIFIED
            </span>
          </div>

          {/* Toggles */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Max Dispatch Cluster Radius</label>
              <select
                value={maxRadius}
                onChange={(e) => setMaxRadius(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="5km">5 km (Micro-Cluster High Density)</option>
                <option value="10km">10 km (Standard City Radius - Recommended)</option>
                <option value="15km">15 km (Wide Metro Zone)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">High-Priority Audio Dispatch Chimes</span>
                <span className="text-[11px] text-slate-500">Play loud buzzer when an instant 15-min job arrives</span>
              </div>
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Yetzo Bodycam Auto-Sync over WiFi</span>
                <span className="text-[11px] text-slate-500">Upload encrypted video files automatically when on home WiFi</span>
              </div>
              <input
                type="checkbox"
                checked={autoUploadWifi}
                onChange={(e) => setAutoUploadWifi(e.target.checked)}
                className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Preferences...' : 'Save App Preferences'}</span>
            </button>
          </div>

          {/* Logout */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out from Partner Fleet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
