'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Phone, Zap, ArrowRight, AlertCircle, Loader2, Clock, CheckCircle2 } from 'lucide-react';

export default function CustomerSignupPage() {
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Send OTP via standard Yetzo Auth endpoint
      const res = await fetch('/api/proxy/v1/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (fullName.trim()) {
          localStorage.setItem('yetzo_pending_name', fullName.trim());
        }
        router.push(`/auth/verify-otp?phone=${encodeURIComponent(phone)}`);
      } else {
        // Fallback or retry
        if (fullName.trim()) {
          localStorage.setItem('yetzo_pending_name', fullName.trim());
        }
        router.push(`/auth/verify-otp?phone=${encodeURIComponent(phone)}`);
      }
    } catch (err: any) {
      if (fullName.trim()) {
        localStorage.setItem('yetzo_pending_name', fullName.trim());
      }
      router.push(`/auth/verify-otp?phone=${encodeURIComponent(phone)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-50">
        <Link href="/" className="cursor-pointer flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-full overflow-hidden shadow-sm border border-slate-200 flex-shrink-0">
            <Image src="/logo.jpg" alt="Yetzo" fill className="object-cover" priority />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-[300] tracking-[0.16em] text-xl text-slate-900 uppercase">Yetzo</span>
            <span className="text-[8px] uppercase tracking-widest text-[#2563EB] font-bold -mt-1">Instant 15-Min Fleet</span>
          </div>
        </Link>
        <Link
          href="/auth/login"
          className="text-xs font-bold text-slate-600 hover:text-[#2563EB] transition"
        >
          Already registered? <span className="text-[#2563EB] underline">Log in</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Top Banner - Quick Commerce Vibe */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-[10px] font-bold font-heading uppercase tracking-wider">
              <Zap className="w-3 h-3 fill-[#2563EB]" />
              <span>Doorstep House Help in 15 Minutes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
              Create Account
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed font-body">
              Join thousands of households booking verified domestic helpers, cooks, and cleaning professionals on-demand.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 font-heading mb-1.5">
                Full Name (Optional)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full text-xs font-medium px-3.5 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 font-heading mb-1.5">
                Mobile Number *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full text-xs font-bold px-3.5 py-3 pl-12 border border-slate-300 rounded-xl focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition tracking-wide text-slate-900"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                We will send an instant 4-digit SMS OTP for passwordless login.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white rounded-xl font-bold font-heading text-xs uppercase tracking-wider shadow-sm transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <span>Continue with OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-[10px] text-slate-500 font-body">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>100% Background-Verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>15-Minute Express Arrival</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center leading-normal">
            By proceeding, you agree to Yetzo's{' '}
            <Link href="/terms" className="underline hover:text-slate-600">Terms of Service</Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>.
          </p>

        </div>
      </main>
    </div>
  );
}
