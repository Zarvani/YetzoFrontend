'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, User, Phone, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

      const res = await fetch('/api/proxy/v1/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: formattedPhone,
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Store access/refresh tokens in localStorage if returned
        if (data.data?.access) {
          localStorage.setItem('access_token', data.data.access);
          localStorage.setItem('refresh_token', data.data.refresh);
        }
        router.push('/customer/booking');
      } else {
        const errorMsg = typeof data.error === 'object'
          ? Object.values(data.error).flat().join(' ')
          : data.error || 'Failed to create account.';
        setError(errorMsg);
      }
    } catch (err: any) {
      setError('A network error occurred. Please try again.');
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
          className="text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          Sign In
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900 mb-1">Create Your Account</h1>
            <p className="text-xs text-slate-500 font-medium">
              Join Yetzo for 15-minute home services, bodycam security, and 30-day warranty.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-700 p-3.5 rounded-2xl mb-5 text-xs font-semibold flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">First Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Aditya"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-slate-900 font-semibold focus:outline-none focus:border-[#059669] focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-slate-900 font-semibold focus:outline-none focus:border-[#059669] focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number (10 digits) *</label>
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

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address (Optional)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aditya@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-slate-900 font-semibold focus:outline-none focus:border-[#059669] focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-slate-900 font-semibold focus:outline-none focus:border-[#059669] focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 rounded-xl transition shadow shadow-emerald-900/10 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-medium text-slate-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#059669] font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
