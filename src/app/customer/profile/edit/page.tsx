'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, Globe, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function CustomerProfileEditPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient('auth/me/');
      const u = res?.data?.user || res?.user || res;
      if (u) {
        setFirstName(u.first_name || '');
        setLastName(u.last_name || '');
        setEmail(u.email || '');
        setPhone(u.phone || '');
        setLanguage(u.preferred_language || 'en');
      }
    } catch (e) {
      console.warn('Profile fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      await apiClient('auth/me/', {
        method: 'PATCH',
        body: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          preferred_language: language,
        },
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/customer/profile');
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-2xl flex items-center justify-center font-bold text-lg">
              {firstName ? firstName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Edit Profile Details</h1>
              <p className="text-xs text-slate-500">Manage your name, verified contact info, and preferences.</p>
            </div>
          </div>

          {success && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Profile updated successfully! Redirecting...</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Verified Phone Number</label>
              <input
                type="text"
                value={phone}
                disabled
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-mono cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Phone number is linked to your verified OTP authentication.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Preferred Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] bg-white text-slate-900"
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
              </select>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={saving || loading}
                className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 text-xs flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
