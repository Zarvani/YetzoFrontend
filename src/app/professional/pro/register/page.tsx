'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, User, Phone, MapPin, Wrench, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function ProfessionalRegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [trade, setTrade] = useState('AC & Appliance Repair');
  const [experience, setExperience] = useState('3-5 Years');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
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
          password: 'PartnerDefaultSecurePass123!',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.data?.access) {
          localStorage.setItem('access_token', data.data.access);
          localStorage.setItem('refresh_token', data.data.refresh);
        }
        router.push('/professional/pro/onboarding');
      } else {
        router.push('/professional/pro/onboarding');
      }
    } catch (err: any) {
      router.push('/professional/pro/onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#059669] rounded-lg flex items-center justify-center text-white font-black">Y</div>
          <span className="font-black text-xl tracking-tight text-white">Yetzo Partner Network</span>
        </Link>
        <Link
          href="/professional/pro/login"
          className="text-xs font-bold text-slate-400 hover:text-white"
        >
          Sign In
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-slate-800/80 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-6">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase tracking-wider inline-block mb-3">
              Join Our Verified Fleet
            </span>
            <h1 className="text-2xl font-black text-white mb-1">Partner Onboarding Application</h1>
            <p className="text-xs text-slate-400 font-medium">
              Join 5,000+ top technicians earning high daily payouts with transparent Urban Company & Pronto rate cards.
            </p>
          </div>

          {error && (
            <div className="bg-rose-500/10 text-rose-300 p-3.5 rounded-2xl mb-5 text-xs font-semibold flex items-center gap-2 border border-rose-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ramesh"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-white font-semibold focus:outline-none focus:border-[#059669] transition"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Kumar"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-white font-semibold focus:outline-none focus:border-[#059669] transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Mobile Number (For Job Dispatches) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-3 py-3 text-white font-semibold focus:outline-none focus:border-[#059669] transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Operational City *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-white font-semibold focus:outline-none focus:border-[#059669] transition"
                >
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Primary Skill / Trade *</label>
                <select
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-white font-semibold focus:outline-none focus:border-[#059669] transition"
                >
                  <option value="AC & Appliance Repair">AC & Appliance Repair</option>
                  <option value="Deep Home Cleaning">Deep Home Cleaning</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Home Painting">Home Painting</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Hands-on Trade Experience</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-white font-semibold focus:outline-none focus:border-[#059669] transition"
              >
                <option value="1-2 Years">1-2 Years</option>
                <option value="3-5 Years">3-5 Years (Recommended)</option>
                <option value="5-10 Years">5-10 Years (Senior Master)</option>
                <option value="10+ Years">10+ Years (Master Certified)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-emerald-900/30 active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2 text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <span>Submit & Start Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-medium text-slate-400">
            Already registered?{' '}
            <Link href="/professional/pro/login" className="text-emerald-400 font-bold hover:underline">
              Partner Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
