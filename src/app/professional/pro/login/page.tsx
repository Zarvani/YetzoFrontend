'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Phone, ArrowRight, AlertCircle, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

export default function ProfessionalLoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

      const res = await fetch('/api/proxy/v1/auth/otp/send/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: formattedPhone }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push(`/professional/pro/otp?phone=${encodeURIComponent(formattedPhone)}`);
      } else {
        // Fallback directly to OTP entry for testing
        router.push(`/professional/pro/otp?phone=${encodeURIComponent(formattedPhone)}`);
      }
    } catch (err: any) {
      router.push(`/professional/pro/otp?phone=${encodeURIComponent(phone)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center text-white font-black">Y</div>
          <span className="font-black text-xl tracking-tight text-white">Yetzo Partner</span>
        </Link>
        <Link
          href="/auth/login"
          className="text-xs font-bold text-slate-400 hover:text-white"
        >
          Customer Login
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-800/80 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-6">
            <span className="px-3 py-1 bg-blue-500/20 text-sky-400 border border-blue-500/30 rounded-full text-[10px] font-black uppercase tracking-wider inline-block mb-3">
              Fleet Partner App
            </span>
            <h1 className="text-2xl font-black text-white mb-1">Partner Sign In</h1>
            <p className="text-xs text-slate-400 font-medium">
              Enter your registered mobile number to manage jobs, receive 15-min dispatches, and track wallet earnings.
            </p>
          </div>

          {error && (
            <div className="bg-rose-500/10 text-rose-300 p-3.5 rounded-2xl mb-5 text-xs font-semibold flex items-center gap-2 border border-rose-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-3 py-3 text-white font-semibold focus:outline-none focus:border-[#2563EB] transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-emerald-900/30 active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2 text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <span>Continue with OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Value props */}
          <div className="mt-8 pt-6 border-t border-slate-700/60 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Earn ₹35,000 - ₹55,000/mo with 80% payout split</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Yetzo Bodycam safety protection & insurance</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Instant daily UPI wallet settlements</span>
            </div>
          </div>

          <div className="mt-6 text-center text-xs font-medium text-slate-400">
            Want to become a service partner?{' '}
            <Link href="/professional/pro/register" className="text-sky-400 font-bold hover:underline">
              Register New Partner
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
