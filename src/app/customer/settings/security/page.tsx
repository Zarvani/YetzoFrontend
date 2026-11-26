'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Key, Lock, Smartphone, Check, AlertCircle, Save, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function SecuritySettingsPage() {
  const router = useRouter();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [requireBookingPin, setRequireBookingPin] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    try {
      setChangingPassword(true);
      setPasswordError(null);

      await apiClient('auth/me/', {
        method: 'PATCH',
        body: {
          password: newPassword,
        },
      });

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to update password.');
    } finally {
      setChangingPassword(false);
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
          Back to Settings
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Security & Credentials</h1>
              <p className="text-xs text-slate-500">Protect your Yetzo account and booking payment authority.</p>
            </div>
          </div>

          {/* 2FA & PIN Toggles */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-800 rounded-lg shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Two-Factor Authentication (2FA)</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Require a high-security OTP sent to your verified mobile number on every new login.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
              </label>
            </div>

            <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-lg shrink-0 mt-0.5">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Wallet & Booking Payment PIN</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ask for a 4-digit security PIN before deducting funds from your Yetzo Wallet balance.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={requireBookingPin}
                  onChange={(e) => setRequireBookingPin(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
              </label>
            </div>
          </div>

          {/* Update Password Form */}
          <form onSubmit={handlePasswordChange} className="pt-6 border-t border-slate-100 space-y-4 text-xs">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Change Account Password
            </h2>

            {passwordError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Password updated successfully!</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">New Password *</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2563EB] text-slate-900"
                required
              />
            </div>

            <button
              type="submit"
              disabled={changingPassword || !newPassword}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {changingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Account Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
