'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle2, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get('phone') || '';

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Verify OTP
      const verifyRes = await fetch('/api/proxy/v1/auth/otp/verify/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneParam,
          otp,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        setError(verifyData.error || 'Invalid verification code. Please try again.');
        return;
      }

      // If OTP verified, update password
      const accessToken = verifyData.data?.access;
      if (accessToken) {
        await fetch('/api/proxy/v1/auth/me/', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ password: newPassword }),
        });
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2500);
    } catch (err: any) {
      setError('Network error during password reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <Link href="/" className="cursor-pointer flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center text-white font-black">Y</div>
          <span className="font-black text-xl tracking-tight text-slate-900">Yetzo</span>
        </Link>
        <Link
          href="/auth/login"
          className="text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          Sign In
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900 mb-1">Set New Password</h1>
            <p className="text-xs text-slate-500 font-medium">
              Enter the 6-digit OTP sent to <span className="font-bold text-slate-700">{phoneParam || 'your phone'}</span> and specify a new secure password.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-700 p-3.5 rounded-2xl mb-5 text-xs font-semibold flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto" />
              <h2 className="text-base font-bold text-slate-900">Password Reset Successful!</h2>
              <p className="text-xs text-slate-600">
                Your credentials have been securely updated. Redirecting you to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">6-Digit Verification Code *</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center tracking-[0.5em] text-lg font-black text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password (8+ characters) *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6 || !newPassword}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-3.5 rounded-xl transition shadow shadow-emerald-900/10 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 text-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password & Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-semibold text-sm">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
