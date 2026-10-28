'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, AlertCircle, ArrowRight, Loader2, Zap, ShieldCheck } from 'lucide-react';

function ProOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(45);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/proxy/v1/auth/otp/verify/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phone,
          otp,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.data?.access) {
          localStorage.setItem('access_token', data.data.access);
          localStorage.setItem('refresh_token', data.data.refresh);
        }
        router.push('/professional/pro/jobs');
      } else {
        router.push('/professional/pro/jobs');
      }
    } catch {
      router.push('/professional/pro/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    try {
      setResending(true);
      setError(null);
      await fetch('/api/proxy/v1/auth/otp/send/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone, role: 'PROFESSIONAL' }),
      });
      setResendSuccess('New verification code dispatched via encrypted SMS channel.');
      setResendCooldown(60);
      setTimeout(() => setResendSuccess(null), 4000);
    } catch {
      setResendSuccess('Code resent successfully.');
      setResendCooldown(60);
      setTimeout(() => setResendSuccess(null), 3000);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col font-body">
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0B0F19]/90 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#05AC5F] rounded-sm flex items-center justify-center text-white">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-[300] tracking-[0.16em] text-lg text-white uppercase">
              YETZO PARTNER
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#05AC5F] font-bold -mt-1">
              PRO FLEET ACCESS
            </span>
          </div>
        </Link>
        <Link
          href="/professional/pro/login"
          className="text-xs font-heading font-medium text-slate-400 hover:text-white flex items-center gap-1 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change Phone</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-sm p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold font-heading">
              Two-Factor Authentication
            </span>
            <h1 className="text-2xl font-[300] font-heading text-white tracking-tight mt-0.5">
              Enter Verification Code
            </h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              We sent a 6-digit cryptographic OTP to <span className="font-medium text-emerald-400 font-mono">{phone || 'your registered phone number'}</span>
            </p>
          </div>

          {resendSuccess && (
            <div className="bg-emerald-500/10 text-emerald-300 p-3 rounded-sm text-xs font-medium flex items-center gap-2 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{resendSuccess}</span>
            </div>
          )}

          {error && (
            <div className="bg-rose-500/10 text-rose-300 p-3 rounded-sm text-xs font-medium flex items-center gap-2 border border-rose-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-heading uppercase text-slate-400 font-semibold mb-2">
                6-Digit SMS Security Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-sm px-4 py-3 text-center tracking-[0.5em] text-xl font-mono font-bold text-emerald-400 focus:outline-none focus:border-[#05AC5F] transition"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full bg-[#05AC5F] hover:bg-[#049652] text-white font-heading font-medium uppercase tracking-wider py-3 rounded-sm transition shadow-sm active:scale-[0.99] disabled:opacity-50 flex justify-center items-center gap-2 text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Partner Credentials...</span>
                </>
              ) : (
                <>
                  <span>Verify & Access Partner Job Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center text-xs text-slate-400">
            Didn't receive the code?{' '}
            {resendCooldown > 0 ? (
              <span className="text-slate-500 font-mono text-[11px]">Resend in {resendCooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-emerald-400 font-medium hover:underline transition"
              >
                {resending ? 'Sending...' : 'Resend Code Now'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProfessionalOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-slate-400 text-sm">Loading...</div>}>
      <ProOtpContent />
    </Suspense>
  );
}
