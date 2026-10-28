'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { KeyRound, ArrowLeft, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit registered mobile number');
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
        router.push(`/auth/reset-password?phone=${encodeURIComponent(formattedPhone)}`);
      } else {
        setError(data.error || 'Failed to send verification code. Please check your number.');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <Link href="/" className="cursor-pointer flex items-center gap-2">
          <div className="w-8 h-8 bg-[#059669] rounded-lg flex items-center justify-center text-white font-black">Y</div>
          <span className="font-black text-xl tracking-tight text-slate-900">Yetzo</span>
        </Link>
        <Link
          href="/auth/login"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-1">Forgot Password?</h1>
            <p className="text-xs text-slate-500 font-medium">
              Enter your registered mobile number and we'll send a 6-digit verification code to reset your account credentials.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-700 p-3.5 rounded-2xl mb-5 text-xs font-semibold flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Registered Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-3 py-3 text-slate-900 font-semibold focus:outline-none focus:border-[#059669] focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 rounded-xl transition shadow shadow-emerald-900/10 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Code...</span>
                </>
              ) : (
                <>
                  <span>Send Reset OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-medium text-slate-500">
            Remembered your credentials?{' '}
            <Link href="/auth/login" className="text-[#059669] font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
