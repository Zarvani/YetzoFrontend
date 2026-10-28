'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Gift, Copy, Check, Share2, Users, Wallet, ShieldCheck } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function CustomerReferralsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient('auth/me/')
      .then((res: any) => setUser(res?.data?.user || res?.user || res))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const referralCode = user ? `YETZO-${(user.id || 'VIP').slice(0, 6).toUpperCase()}` : 'YETZO-JOIN';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Get ₹250 off your first Yetzo home service (15-min instant arrival & 30-day warranty). Use my referral code: ${referralCode}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 space-y-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-emerald-950 via-[#064E3B] to-[#047857] text-white p-8 rounded-3xl shadow-xl text-center space-y-4 relative overflow-hidden">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto border border-white/20">
            <Gift className="w-8 h-8 text-emerald-300" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-3 py-1 rounded-full">
              Give ₹250, Get ₹250
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">Invite Friends to Yetzo</h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-md mx-auto mt-1 leading-relaxed">
              Share your unique referral link. When your friend completes their first service, both of you receive ₹250 directly into your Yetzo Wallet!
            </p>
          </div>

          {/* Referral Code Box */}
          <div className="max-w-xs mx-auto bg-black/30 p-3 rounded-2xl border border-white/15 flex items-center justify-between">
            <span className="font-mono font-black text-xl tracking-wider text-emerald-300 pl-2">
              {referralCode}
            </span>
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-white text-slate-900 font-bold rounded-xl text-xs hover:bg-slate-100 transition shadow flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Social Share */}
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-extrabold rounded-2xl text-xs shadow-lg hover:bg-[#20ba5a] transition"
            >
              <Share2 className="w-4 h-4" />
              Share on WhatsApp
            </a>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-xs mb-2">1</span>
              <h3 className="font-bold text-slate-900">Share Link</h3>
              <p className="text-slate-500">Send your code via WhatsApp, SMS, or social media.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-xs mb-2">2</span>
              <h3 className="font-bold text-slate-900">Friend Books</h3>
              <p className="text-slate-500">They get ₹250 discount on their first home service booking.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-xs mb-2">3</span>
              <h3 className="font-bold text-slate-900">You Get Paid</h3>
              <p className="text-slate-500">₹250 credited to your Yetzo Wallet upon job completion.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
